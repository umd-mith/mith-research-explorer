import $ from 'jquery';
import * as Backbone from 'backbone';
import * as _ from 'underscore';
import splitUp from '../utils/array-splitUp';
import Events from '../utils/backbone-events.js';
import AppRouter from '../routers/app-router.js';
import Projects from '../data/coll-projects.js';
import ProjectsView from '../views/projects-view.js';
import Topics from '../data/coll-topics.js';
import TopicsView from '../views/topics-view.js';
import Types from '../data/coll-types.js';
import TypesView from '../views/types-view.js';
import Sponsors from '../data/coll-sponsors.js';
import SponsorsView from '../views/sponsors-view.js';
import Years from '../data/coll-years.js';
import YearsView from '../views/years-view.js';
import ActiveProjects from '../data/coll-activeProjects.js';
import ActiveProjectsView from '../views/activeProjects-view.js';

class MRE extends Backbone.View {

    events() {
        return {
            'change #select_yr' : 'sortProjects',
            'click #reset_filters' : 'showAllProjects'
        };
    }

    sortProjects(e) {
        e.preventDefault();
        this.projsView.trigger("projects:sort", $(e.target).find(":selected").val());
    }

    initialize(options) {
        // Start router
        new AppRouter();

        // Keep track of active categories
        this.activeCategories = {};

        this.listenTo(Events, "app:updateCats", this.updateActiveCats);

        // Load projects and start subview
        var projs = new Projects();
        var projsView = new ProjectsView({collection: projs, el: '#mre_items div:first'});
        // Make projects view available to class:
        this.projsView = projsView;
        projs.url = options.projectsData;
        projs.deferred = projs.fetch();

        // Load all categories
        this.categories = {};

        // Load topics (subview is instatiated when all data is loaded)
        var topics = new Topics(); 
        this.categories["Topic"] = topics;
        topics.url = projs.url = options.topicsData;
        topics.deferred = topics.fetch();

        // Load types (subview is instatiated when all data is loaded)
        var types = new Types(); 
        this.categories["Type"] = types;
        types.url = projs.url = options.typesData;
        types.deferred = types.fetch();

        // Create sponsor and date collections
        var sponsorsTable = {};
        var sponsors = new Sponsors();
        this.categories["Sponsor"] = sponsors;

        var yearsTable = {};
        var years = new Years();
        this.categories["YearRange"] = years;

        var activeProjects = new ActiveProjects();
        this.categories["ActiveProject"] = activeProjects;
        // this is kind of a hack, but simplifies treating the active switch as a regular category:
        activeProjects.add({name:"true", slug:"active-true", narrower:[], broader:[]});

        // When projects and topics are loaded, assign projects to each topic
        // Maybe we could use ES6 promises here
        projs.deferred.done( function () {

            projsView.render();

            // Build table of projects by research type and topic
            var projsByType = {}
            var projsByTopic = {}
            projs.each(function(proj){
                let allTypes = proj.get("research_type");
                if (!allTypes) {
                    proj.set("research_type", ["Other"]);
                    allTypes = ["Other"];
                }
                for (let rType of allTypes) {
                    if (projsByType[rType]) { 
                        projsByType[rType].push(proj);
                    } 
                    else projsByType[rType] = [proj];
                }

                let allTopics = proj.get("topic");
                if (!allTopics) {
                    proj.set("topic", ["Other"]);
                    allTopics = ["Other"];
                }
                else {
                    for (let topic of allTopics) {
                        if (projsByTopic[topic]) { 
                            projsByTopic[topic].push(proj);
                        } 
                        else projsByTopic[topic] = [proj];
                    }
                }

                // While we're looping on projects, also populate collections for sponsors, dates, and activeprojects
                if (proj.get("research_sponsor")){
                    for (let sponsor of proj.get("research_sponsor")) {
                        if (Object.keys(sponsorsTable).indexOf(sponsor) == -1){
                            // Create sponsor and add to reference table
                            let spModel = sponsors.add({"name": sponsor});
                            spModel.get("projects").add(proj);
                            sponsorsTable[sponsor] = spModel.cid;
                        } 
                        else {
                            // Add this project to existing sponsor
                            sponsors.get(sponsorsTable[sponsor]).get("projects").add(proj);
                        }
                    }
                }

                if (proj.get("start")){
                    let year = proj.get("start").substring(0,4);
                    if (Object.keys(yearsTable).indexOf(year) == -1){
                        // Add to reference table
                        yearsTable[year] = [proj];
                    } 
                    else {
                        // Add this project to existing year
                        yearsTable[year].push(proj);
                    }
                }     

                if (proj.get("active")){
                    activeProjects.first().get("projects").add(proj);
                }            

            });

            // Group years
            let groupedYears = {}
            let sortedYears = Object.keys(yearsTable).sort();
            let yearRanges = splitUp(
                _.range(parseInt(sortedYears[0]), parseInt(sortedYears.slice(-1)[0])+1), 4
                );

            for (let yRange of yearRanges) {
                let projectsInRange = [];
                for (let y of yRange){
                    if (yearsTable[y]){
                        projectsInRange = projectsInRange.concat(yearsTable[y]);                        
                    }
                }
                let rangeString = yRange[0].toString() + " – " + yRange.slice(-1)[0].toString();
                let yrModel = years.add({"name": rangeString});
                yrModel.get("projects").add(projectsInRange);
            }            

            topics.deferred.done( function () {                

                topics.each(function(topic){
                    let name = topic.get("name");                    
                    topic.get("projects").add(projsByTopic[name]);
                    
                    // Create nested collections
                    if (topic.get("narrower") ? topic.get("narrower").length : false){
                        let subset = new Topics;
                        topic.set("subset", subset);
                        for (let narrower of topic.get("narrower")) {
                            subset.add(topics.where({"name":narrower}));                            
                        }                    
                    }
                });
                // Now instantiate topics subview, but only for top level topics
                // (the other topics will be contained by the top level ones)
                let organizedTopics = new Backbone.Collection(topics.filter(function(topic){
                    return !topic.get("broader").length
                }));                
                new TopicsView({el: '#topics', collection: organizedTopics}).render();
            });

            types.deferred.done( function () {                 

                types.each(function(type){
                    let name = type.get("name");                    
                    type.get("projects").add(projsByType[name]);
                    
                    // Create nested collections
                    if (type.get("narrower") ? type.get("narrower").length : false){
                        let subset = new Types;
                        type.set("subset", subset);
                        for (let narrower of type.get("narrower")) {
                            subset.add(types.where({"name":narrower}));                            
                        }
                    }
                });
                // Now instantiate types subview, but only for top level types
                // (the other types will be contained by the top level ones)
                let organizedTypes = new Backbone.Collection(types.filter(function(type){
                    return !type.get("broader").length
                }));                
                new TypesView({el: '#types', collection: organizedTypes}).render();
            });

            // Now instantiate sponsor and date views
            new SponsorsView({el: '#sponsors', collection: sponsors}).render();
            new YearsView({el: '#years', collection: years}).render();

            // Now instantiate active topic view
            new ActiveProjectsView({el: "#activeProjects", collection: activeProjects}).render();
        });
    }

    updateActiveCats(type){

        if (type) {
            let cat = this.categories[type];
            this.activeCategories[type] = cat.getActive();    
        }
        else {
            this.activeCategories = {};
        }
        
        // Propagate to ProjectsView and CategoriesView
        Events.trigger("projects:intersect", this.activeCategories);
        Events.trigger("categories:updateProjectCounts");
    }

    showAllProjects(e) {
        e. preventDefault();
        Events.trigger("categories:uncheck:others", []);
    }

}

export default MRE;