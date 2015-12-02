import $ from 'jquery';
import * as Backbone from 'backbone';
import ProjectView from './project-view.js';
import Events from '../utils/backbone-events.js';

class ProjectsView extends Backbone.View {
    initialize() {
        this.listenTo(Events, "projects:showOne", this.showProjectsFor);
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
        this.collection.each(function (proj) {
            // Reset all
            proj.set("activeTopics", []);
            proj.set("activeTypes", []);
            proj.set("activeSponsors", []);
            if (proj.get("attached")){
                proj.trigger("view:remove");
            }
            // Then restore current category
            if (options.catType=="Topic"){
                if (proj.get("topic")) {
                    if (proj.get("topic").indexOf(options.catName) !== -1) {
                        // Record info about the topic
                        proj.set("activeTopics", [options.catName]); 
                        proj.trigger("view:restore");
                    }
                } 
            }
            else if (options.catType=="Type"){
                if (proj.get("research_type")) {
                    if (proj.get("research_type").indexOf(options.catName) !== -1) {
                        // Record info about the type
                        proj.set("activeTypes", [options.catName]); 
                        proj.trigger("view:restore");
                    }
                }   
            }     
            else if (options.catType=="Sponsor"){
                if (proj.get("research_sponsor")) {
                    if (proj.get("research_sponsor").indexOf(options.catName) !== -1) {
                        // Record info about the type
                        proj.set("activeSponsors", [options.catName]); 
                        proj.trigger("view:restore");
                    }
                }   
            }           
            
        });
    }

    includeProjects(options) {
        this.collection.each(function (proj) {
            if (options.catType=="Topic"){
                if (proj.get("topic")) {
                    if (proj.get("topic").indexOf(options.catName) !== -1) {
                        // Record info about the type
                        let activeSet = new Set(proj.get("activeTopic"));
                        activeSet.add(options.catName);
                        proj.set("activeTopic", Array.from(activeSet)); 
                        if (!proj.get("attached")){
                            proj.trigger("view:restore");
                        }  
                    }
                } 
            }
            else if (options.catType=="Type"){
                if (proj.get("research_type")) {
                    if (proj.get("research_type").indexOf(options.catName) !== -1) {
                        // Record info about the type
                        let activeSet = new Set(proj.get("activeTypes"));
                        activeSet.add(options.catName);
                        proj.set("activeTypes", Array.from(activeSet)); 
                        if (!proj.get("attached")){
                            proj.trigger("view:restore");
                        }
                    }
                }   
            }
            else if (options.catType=="Sponsor"){
                if (proj.get("research_sponsor")) {
                    if (proj.get("research_sponsor").indexOf(options.catName) !== -1) {
                        // Record info about the type
                        let activeSet = new Set(proj.get("activeSponsors"));
                        activeSet.add(options.catName);
                        proj.set("activeSponsors", Array.from(activeSet)); 
                        if (!proj.get("attached")){
                            proj.trigger("view:restore");
                        }
                    }
                }   
            }
        });
    }

    excludeProjects(options) {

        this.collection.each(function (proj) {
            if (options.catType=="Topic"){
                if (proj.get("topic")) {
                    if (proj.get("topic").indexOf(options.catName) !== -1) {
                        // Record info about the type
                        let activeSet = new Set(proj.get("activeTopics"));
                        activeSet.delete(options.catName);
                        proj.set("activeTopics", Array.from(activeSet));
                        // Do not remove if other topics are active
                        if (proj.get("attached") && !activeSet.size){
                            proj.trigger("view:remove");
                        }  
                    }
                } 
            }
            else if (options.catType=="Type"){
                if (proj.get("research_type")) {
                    if (proj.get("research_type").indexOf(options.catName) !== -1) {
                        // Record info about the type
                        let activeSet = new Set(proj.get("activeTypes"));
                        activeSet.delete(options.catName);
                        proj.set("activeTypes", Array.from(activeSet));
                        if (proj.get("attached") && !activeSet.size){
                            proj.trigger("view:remove");
                        }
                    }
                }   
            }  
            else if (options.catType=="Sponsor"){
                if (proj.get("research_sponsor")) {
                    if (proj.get("research_sponsor").indexOf(options.catName) !== -1) {
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
        });
    }
}

export default ProjectsView;