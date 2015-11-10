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
            if (!proj.get("attached")){
                proj.trigger("view:restore");
            }
            if (options.catType=="Topic"){
                if (proj.get("topic")) {
                    if (proj.get("topic").indexOf(options.name) == -1) {
                        proj.trigger("view:remove");
                    }
                } 
                else proj.trigger("view:remove");   
            }
            else if (options.catType=="Type"){
                if (proj.get("research_type")) {
                    if (proj.get("research_type").indexOf(options.name) == -1) {
                        proj.trigger("view:remove");
                    }
                } 
                else proj.trigger("view:remove");   
            }                
            
        });
    }

    includeProjects(options) {
        this.collection.each(function (proj) {
            if (options.catType=="Topic"){
                if (proj.get("topic")) {
                    if (proj.get("topic").indexOf(options.name) == -1) {
                        if (!proj.get("attached")){
                            proj.trigger("view:restore");
                        }  
                    }
                } 
            }
            else if (options.catType=="Type"){
                if (proj.get("research_type")) {
                    if (proj.get("research_type").indexOf(options.name) == -1) {
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
                        if (proj.get("attached")){
                            proj.trigger("view:remove");
                        }  
                    }
                } 
            }
            else if (options.catType=="Type"){
                if (proj.get("research_type")) {
                    if (proj.get("research_type").indexOf(options.name) !== -1) {
                        if (proj.get("attached")){
                            proj.trigger("view:remove");
                        }
                    }
                }   
            }  
        });
    }
}

export default ProjectsView;