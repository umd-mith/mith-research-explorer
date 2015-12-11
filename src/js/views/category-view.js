import $ from 'jquery';
import * as Backbone from 'backbone';
import category_tpl from '../templates/category-tpl.js';
import Events from '../utils/backbone-events.js';

class CategoryView extends Backbone.View {

    get className() {
        return "category";
    }

    get events() {
        return {
            "click .toggle_cat:first" : "toggle",
            "click .only_cat:first" : "showOne",
            "mouseover dt:first" : "showOnlyBtn",
            "mouseleave dt:first" : "hideOnlyBtn",
            "touchstart dt:first" : "showOnlyBtn"
        }
    }

    initialize(options) {
        this.parentEl = options.parentEl;
        this.collection = options.collection;
        this.listenTo(this.model, 'uncheck', this.uncheck);
        this.listenTo(this.model, 'check', this.check);
        this.listenTo(this.model, 'partialCheck', this.partialCheck);
        this.listenTo(Events, "categories:updateProjectCounts", this.updateProjectCount);
        // Convenience property
        this.subset = this.model.get("subset");
        // Get the type of category
        this.catType = this.model.get("type");

    }

    toggle(e) {  

        let checked = $(e.target).prop("checked");

        if (checked) {
            // Set this category active
            this.model.set("active", true);
        }
        else {
            // Set this category not active
            this.model.set("active", false);
        }

        let _doSubsets = (md) => {
            // If the category has a subset, all the subset should be included
            if (md.get("subset")){
                md.get("subset").each(function (subcat) {  
                    if (subcat.get("active")){
                        subcat.set("active", false);
                    }

                    subcat.trigger("uncheck");

                    if (subcat.get("subset")) {
                        _doSubsets(subcat);
                    }

                });
            }
        }
        
        _doSubsets(this.model);        

        if (this.model.get("broader")) {
            if (this.model.get("broader").length) {
                Events.trigger("categories:partialCheck", this.model.get("broader")[0], checked);
            }
        }

    }
    showOne(e) {
        e.preventDefault();
        // Set this category active
        this.model.set("active", true);

        // Also check the checkbox
        this.$el.find('.toggle_cat').eq(0).prop("checked", true);
        // And tell other categories to uncheck themselves
        Events.trigger("categories:uncheck:others", this.model.cid);

        if (this.model.get("broader")) {
            if (this.model.get("broader").length) {
                Events.trigger("categories:partialCheck", this.model.get("broader")[0], true);
            }
        }

    }
    uncheck() {
        let box = this.$el.find('.toggle_cat').eq(0)
        box.prop("checked", false);
        box.prop("indeterminate", false);
        box.removeClass("indeterminate");
    }
    check() {
        let box = this.$el.find('.toggle_cat').eq(0);
        box.prop("checked", true);
    }
    partialCheck(checked) {
        let box = this.$el.find('.toggle_cat').eq(0);
        if (checked) {
            if (this.model.get("active")) {
                this.model.set("active", false);            
            }            
            box.prop("indeterminate", true);
            box.prop("checked", false);
            box.addClass("indeterminate");    
        }
        else {
            box.prop("indeterminate", false);
            box.prop("checked", false);
            box.removeClass("indeterminate");    
        }
    }
    showOnlyBtn() {
        // Show the 'only' button
        this.$el.find('.only_cat:first').css("display", "inline");
    }
    hideOnlyBtn() {
        // Hide the 'only' button
        this.$el.find('.only_cat:first').css("display", "none");
    }

    getActiveProjectsCount() {
        let activeProjects = new Set();

        let _countSubset = function (md) {
            if (md.get("subset")){
                md.get("subset").each(function(subcat){
                    subcat.get("projects").each(function(project){
                        if (project.get("attached")) {
                            activeProjects.add(project.get("slug"));                            
                        }
                    });

                    if (subcat.get("subset")) {
                        _countSubset(subcat);
                    }

                });
            }
        }

        _countSubset(this.model);
        
        this.model.get("projects").each(function(project){
            if (project.get("attached")) {
                activeProjects.add(project.get("slug"));                            
            }
        });

        this.model.set("totProjects", activeProjects.size)

        return activeProjects.size
    }

    updateProjectCount () {

        this.$el.find("dd").text(this.getActiveProjectsCount());

    }

    render() {
        
        let containedProjects = this.getActiveProjectsCount();        

        // Don't render if there are no contained projects
        if (containedProjects) {
            this.$el.append(category_tpl(this.model.toJSON()))
        }
        return this.$el;
    }
}

export default CategoryView;