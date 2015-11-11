import $ from 'jquery';
import * as Backbone from 'backbone';
import _ from 'backbone/node_modules/underscore';
import AppRouter from '../routers/app-router.js';
import Projects from '../data/coll-projects.js';
import ProjectsView from '../views/projects-view.js';
import Topics from '../data/coll-topics.js';
import TopicsView from '../views/topics-view.js';
import Types from '../data/coll-types.js';
import TypesView from '../views/types-view.js';

class MRE extends Backbone.View {

    events() {
        return {
            'change #select_yr' : 'sortProjects'
        };
    }

    sortProjects(e) {
        e.preventDefault();
        this.projsView.trigger("projects:sort", $(e.target).find(":selected").val());
    }

    initialize() {
        // Start router
        new AppRouter();        

        // Load projects and start subview
        var projs = new Projects;
        var projsView = new ProjectsView({collection: projs, el: '.fusion-portfolio-wrapper'});
        // Make projects view available to class:
        this.projsView = projsView;
        projs.url = '/src/projects.json';
        projs.deferred = projs.fetch();

        // Load topics (subview is instatiated when all data is loaded)
        var topics = new Topics(); 
        topics.url = '/src/taxonomy.json';
        topics.deferred = topics.fetch();

        // Load types (subview is instatiated when all data is loaded)
        var types = new Types(); 
        types.url = '/src/types.json';
        types.deferred = types.fetch();

        // When projects and topics are loaded, assign projects to each topic
        // Maybe we could use ES6 promises here
        projs.deferred.done( function () {

            projsView.render();

            // Build table of projects by research type and topic
            var projsByType = {}
            var projsByTopic = {}
            projs.each(function(proj){
                let types = proj.get("research_type");
                if (!types) {
                    proj.set("research_type", ["Other"]);
                    types = ["Other"];
                }
                for (let rType of types) {
                    if (projsByType[rType]) { 
                        projsByType[rType].push(proj);
                    } 
                    else projsByType[rType] = [proj];
                }

                let topics = proj.get("topic");
                if (!topics) {
                    proj.set("topic", ["Other"]);
                    topics = ["Other"];
                }
                for (let topic of topics) {
                    if (projsByTopic[topic]) { 
                        projsByTopic[topic].push(proj);
                    } 
                    else projsByTopic[topic] = [proj];
                }
            });

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

        });
    }
}

export default MRE;