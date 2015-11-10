import $ from 'jquery';
import * as Backbone from 'backbone';
import ProjectView from './project-view.js';
import Events from '../utils/backbone-events.js';

class ProjectsView extends Backbone.View {
    initialize() {
        this.listenTo(this.collection, 'add', this.addOne)
        this.listenTo(Events, "projects:showOne", this.showProjectsFor);
        this.listenTo(Events, "projects:include", this.includeProjects);
        this.listenTo(Events, "projects:exclude", this.excludeProjects);
    }

    addOne(model) {
        this.$el.append(
            (new ProjectView({model:model})).render()
        );
    }

    showProjectsFor(options) {
        this.collection.each(function (proj) {
            // Reset all
            proj.set("activeTopics", []);
            proj.set("activeTypes", []);
            if (proj.get("attached")){
                proj.trigger("view:remove");
            }
            // Then restore current category
            if (options.catType=="Topic"){
                if (proj.get("topic")) {
                    if (proj.get("topic").indexOf(options.name) !== -1) {
                        // Record info about the topic
                        let activeSet = new Set(proj.get("activeTopics"));
                        activeSet.add(options.name);
                        proj.set("activeTopics", Array.from(activeSet)); 
                        proj.trigger("view:restore");
                    }
                } 
            }
            else if (options.catType=="Type"){
                if (proj.get("research_type")) {
                    if (proj.get("research_type").indexOf(options.name) !== -1) {
                        // Record info about the type
                        let activeSet = new Set(proj.get("activeTypes"));
                        activeSet.add(options.name);
                        proj.set("activeTypes", Array.from(activeSet)); 
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
                    if (proj.get("topic").indexOf(options.name) !== -1) {
                        // Record info about the type
                        let activeSet = new Set(proj.get("activeTopic"));
                        activeSet.add(options.name);
                        proj.set("activeTopic", Array.from(activeSet)); 
                        if (!proj.get("attached")){
                            proj.trigger("view:restore");
                        }  
                    }
                } 
            }
            else if (options.catType=="Type"){
                if (proj.get("research_type")) {
                    if (proj.get("research_type").indexOf(options.name) !== -1) {
                        // Record info about the type
                        let activeSet = new Set(proj.get("activeTypes"));
                        activeSet.add(options.name);
                        proj.set("activeTypes", Array.from(activeSet)); 
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
                    if (proj.get("topic").indexOf(options.name) !== -1) {
                        // Record info about the type
                        let activeSet = new Set(proj.get("activeTopics"));
                        activeSet.delete(options.name);
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
                    if (proj.get("research_type").indexOf(options.name) !== -1) {
                        // Record info about the type
                        let activeSet = new Set(proj.get("activeTypes"));
                        activeSet.delete(options.name);
                        proj.set("activeTypes", Array.from(activeSet));
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