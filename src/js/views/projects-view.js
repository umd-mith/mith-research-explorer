import $ from 'jquery';
import * as Backbone from 'backbone';
import * as _ from 'underscore';
import ProjectView from './project-view.js';
import Events from '../utils/backbone-events.js';

class ProjectsView extends Backbone.View {

    get categoriesTable() {
        return {
            "Topic" : "topic",
            "Type" : "research_type",
            "Sponsor" : "research_sponsor",
            "YearRange" : "start"
        }
    }

    initialize() {
        this.listenTo(Events, "projects:showOne", this.showProjectsFor);
        this.listenTo(Events, "projects:intersect", this.intersectProjects);
        this.listenTo(Events, "projects:include", this.includeProjects);
        this.listenTo(Events, "projects:exclude", this.excludeProjects);
        this.listenTo(this, "projects:sort", this.sortProjects);
    }

    render(order) {

        if (!order) {
            this.collection.sort();
            // duplicate array, because reverse() actually changes 
            // the order of the original array.
            let models = this.collection.models.slice();
            for (let model of models.reverse()) {
                this.$el.append(
                    (new ProjectView({model:model})).render()
                );
            }
        }
        else if (order == 'year_newest') {
            let models = this.collection.models.slice();
            for (let model of models.reverse()) {
                // If the project was not previously visible, hide it again.
                let wasAttached = model.get("attached");

                this.$el.append(
                    (new ProjectView({model:model})).render()
                );
                
                if (!wasAttached){
                    model.trigger("view:remove");
                }
            }
        }
        else {
            this.collection.each( (model) =>{
                // If the project was not previously visible, hide it again.
                let wasAttached = model.get("attached");

                this.$el.append(                    
                    (new ProjectView({model:model})).render()
                );
                
                if (!wasAttached){
                    model.trigger("view:remove");
                }
            });
        }
        
    }

    sortProjects(order) {
        this.$el.empty();
        this.render(order);
    }

    showProjectsFor(options) {
        this.collection.each( (proj) => {
            // Reset all
            proj.set("activeTopics", []);
            proj.set("activeTypes", []);
            proj.set("activeSponsors", []);
            proj.set("activeYears", []);
            if (proj.get("attached")){
                proj.trigger("view:remove");
            }
            // Then restore current category

            // Year special case
            if (options.catType=="YearRange"){
               let yearLimits = options.catName.split(" – ");
                let yearRange = _.range(parseInt(yearLimits[0]), parseInt(yearLimits[1])+1);
                if (proj.get("start")) {
                    if (yearRange.indexOf(parseInt(proj.get("start").substring(0,4))) !== -1) {
                        // Record info about the type
                        let activeSet = new Set(proj.get("activeSponsors"));
                        activeSet = new Set([...activeSet, ...new Set(options.catName)]);
                        proj.set("activeSponsors", Array.from(activeSet)); 
                        proj.trigger("view:restore");
                    }
                }
            }    
            // The rest
            else {
                let field = this.categoriesTable[options.catType];
                let activeCat = "active" + options.catType;
                if (proj.get(field)) {           
                    if (_.intersection(proj.get(field), options.catName).length) {
                        // Record info about the type
                        let activeSet = new Set(proj.get(activeCat));
                        activeSet = new Set([...activeSet, ...new Set(options.catName)]);
                        proj.set(activeCat, Array.from(activeSet)); 
                        proj.trigger("view:restore");
                    }
                }
            }
            
        });
    }

    intersectProjects(options) {

        this.collection.each( (proj) => {

            // Only process if already attached    
            if (proj.get("attached")) {

                // Year special case
                if (options.catType=="YearRange"){
                   let yearLimits = options.catName.split(" – ");
                    let yearRange = _.range(parseInt(yearLimits[0]), parseInt(yearLimits[1])+1);
                    if (proj.get("start")) {
                        if (yearRange.indexOf(parseInt(proj.get("start").substring(0,4))) !== -1) {
                            // Record info about the type
                            let activeSet = new Set(proj.get("activeSponsors"));
                            activeSet = new Set([...activeSet, ...new Set(options.catName)]);
                            proj.set("activeSponsors", Array.from(activeSet)); 
                            proj.trigger("view:restore");
                        } else proj.trigger("view:remove");
                    } else proj.trigger("view:remove");
                }    
                // The rest
                else {
                    let field = this.categoriesTable[options.catType];
                    let activeCat = "active" + options.catType;
                    if (proj.get(field)) {           
                        if (_.intersection(proj.get(field), options.catName).length) {
                            // Record info about the type
                            let activeSet = new Set(proj.get(activeCat));
                            activeSet = new Set([...activeSet, ...new Set(options.catName)]);
                            proj.set(activeCat, Array.from(activeSet)); 
                            proj.trigger("view:restore");
                        } else proj.trigger("view:remove");
                    } else proj.trigger("view:remove");
                }
            }
        });
    }

    includeProjects(options) {

        this.collection.each( (proj) => {
            if (options.catType=="YearRange"){
                let yearLimits = options.catName.split(" – ");
                let yearRange = _.range(parseInt(yearLimits[0]), parseInt(yearLimits[1])+1);
                if (proj.get("start")) {
                    if (yearRange.indexOf(parseInt(proj.get("start").substring(0,4))) !== -1) {
                        // Record info about the type
                        let activeSet = new Set(proj.get("activeSponsors"));
                        activeSet = new Set([...activeSet, ...new Set(options.catName)]);
                        proj.set("activeSponsor", Array.from(activeSet));
                        if (!proj.get("attached")){
                            proj.trigger("view:restore");
                        }
                    }
                }   
            }
            else {
                let field = this.categoriesTable[options.catType];
                let activeCat = "active" + options.catType;
                if (proj.get(field)) {           
                    if (_.intersection(proj.get(field), options.catName).length) {
                        // Record info about the type
                        let activeSet = new Set(proj.get(activeCat));
                        activeSet = new Set([...activeSet, ...new Set(options.catName)]);
                        proj.set(activeCat, Array.from(activeSet)); 
                        if (!proj.get("attached")){
                            proj.trigger("view:restore");
                        }
                    }
                }
            }    
        });
    }

    excludeProjects(options) {

        this.collection.each( (proj) => {
            if (options.catType=="YearRange"){
                let yearLimits = options.catName.split(" – ");
                let yearRange = _.range(parseInt(yearLimits[0]), parseInt(yearLimits[1])+1);
                if (proj.get("start")) {
                    if (yearRange.indexOf(parseInt(proj.get("start").substring(0,4))) !== -1) {
                        // Record info about the type
                        let activeSet = new Set(proj.get("activeSponsors"));
                        activeSet.delete(options.catName);
                        proj.set("activeSponsor", Array.from(activeSet));
                        if (proj.get("attached") && !activeSet.size){
                            proj.trigger("view:remove");
                        }
                    }
                }   
            }
            else {
                let field = this.categoriesTable[options.catType];
                let activeCat = "active" + options.catType;
                if (proj.get(field)) {           
                    if (_.intersection(proj.get(field), options.catName).length) {
                        // Record info about the type
                        let activeSet = new Set(proj.get(activeCat));
                        activeSet.delete(options.catName);
                        proj.set(activeCat, Array.from(activeSet)); 
                        if (proj.get("attached") && !activeSet.size){
                            proj.trigger("view:remove");
                        }
                    }
                }
            }    
        });
    }
}

export default ProjectsView;