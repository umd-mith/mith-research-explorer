import $ from 'jquery';
import * as Backbone from 'backbone';
import category_tpl from '../templates/category-tpl.js';
import Events from '../utils/backbone-events.js';

class CategoryView extends Backbone.View {

    get events() {
        return {
            "click .toggle_cat:first" : "toggle",
            "click .only_cat:first" : "showOne"
        }
    }

    initialize(options) {
        this.parentEl = options.parentEl;
        this.collection = options.collection;
        this.listenTo(this.model, 'uncheck', this.uncheck);
        this.listenTo(this.model, 'check', this.check);
        // Convenience property
        this.subset = this.model.get("subset");
        // Get the type of category
        this.catType = this.model.constructor.name;

    }
    toggle(e) {  

        let checked = $(e.target).prop("checked")
        if (checked) {            
            Events.trigger("projects:include", {"catType": this.catType, "name":this.model.get("name")});            
        }
        else Events.trigger("projects:exclude", {"catType": this.catType, "name":this.model.get("name")});

        let doSubsets = (md) => {
            // If the category has a subset, all the subset should be toggled too
            if (md.get("subset")){
                md.get("subset").each((subcat) => {                
                    if (checked) {
                        Events.trigger("projects:include", {"catType": this.catType, "name":subcat.get("name")});
                        subcat.trigger("check");
                    } 
                    else {
                        Events.trigger("projects:exclude", {"catType": this.catType, "name":subcat.get("name")});
                        subcat.trigger("uncheck");
                    }

                    if (subcat.get("subset")) {
                        doSubsets(subcat);
                    }

                });
            }
        }

        doSubsets(this.model);        

    }
    showOne(e) {
        e.preventDefault();
        Events.trigger("projects:showOne", {"catType": this.catType, "name":this.model.get("name")});
        // Also check the checkbox
        this.$el.find('.toggle_cat').eq(0).prop("checked", true);
        // And tell other categories to uncheck themselves
        Events.trigger("categories:uncheck:others", this.model.cid);

        // If the category has a subset, all the subset should be shown too
        if (this.subset){
            this.subset.each((subcat) => {
                Events.trigger("projects:include", {"catType": this.catType, "name":subcat.get("name")});
                subcat.trigger("check");
            });
        }

    }
    uncheck() {
        this.$el.find('.toggle_cat').eq(0).prop("checked", false);
    }
    check() {
        let checkbox = this.$el.find('.toggle_cat').eq(0);
        checkbox.prop("checked", true);
        this.toggle({"target":checkbox});

    }
    render() {
        let containedProjects = new Set();
        if (this.subset){
            this.subset.each(function(subcat){
                subcat.get("projects").each(function(project){
                    containedProjects.add(project.get("name"));
                });
            });
        }
        this.model.get("projects").each(function(project){
            containedProjects.add(project.get("name"));
        });
        this.model.set("totProjects", containedProjects.size)

        // Don't render if there are no contained projects
        if (containedProjects.size) {
            this.$el.append(category_tpl(this.model.toJSON()))
        }
        return this.$el;
    }
}

export default CategoryView;