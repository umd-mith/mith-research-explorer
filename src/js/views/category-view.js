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
        // Convenience property
        this.subset = this.model.get("subset");
        // Get the type of category
        this.catType = this.model.constructor.name;

    }

    _getTerms() {

        let terms = [this.model.get("name")];        

        let _parseSubsets = (md) => {
            if (md.get("subset")){
                md.get("subset").each((subcat) => {

                    terms.push(subcat.get("name"))

                    if (subcat.get("subset")) {
                        _parseSubsets(subcat);
                    }

                });
            }
        }

        _parseSubsets(this.model);

        return terms;

    }

    toggle(e) {  

        let checked = $(e.target).prop("checked");

        if (checked) {            
            Events.trigger("projects:intersect", {"catType": this.catType, "catName": this._getTerms()});
        }
        else Events.trigger("projects:exclude", {"catType": this.catType, "catName": [this.model.get("name")] });

        if (this.model.get("subset")){
            this.model.get("subset").each(function(subcat){
                subcat.trigger("uncheck");
            });
        }

        if (this.model.get("broader")) {
            if (this.model.get("broader").length) {
                Events.trigger("categories:partialCheck", this.model.get("broader")[0]);
            }
        }

    }
    showOne(e) {
        e.preventDefault();
        Events.trigger("projects:showOne", {"catType": this.catType, "catName": this._getTerms()});
        // Also check the checkbox
        this.$el.find('.toggle_cat').eq(0).prop("checked", true);
        // And tell other categories to uncheck themselves
        Events.trigger("categories:uncheck:others", this.model.cid);

        let _doSubsets = (md) => {
            // If the category has a subset, all the subset should be included
            if (md.get("subset")){
                md.get("subset").each((subcat) => {  
                    Events.trigger("projects:include", {"catType": this.catType, "catName": [subcat.get("name")]});

                    if (subcat.get("subset")) {
                        doSubsets(subcat);
                    }

                });
            }
        }

        _doSubsets(this.model);

        if (this.model.get("broader")) {
            if (this.model.get("broader").length) {
                Events.trigger("categories:partialCheck", this.model.get("broader")[0]);
            }
        }

    }
    uncheck() {
        let box = this.$el.find('.toggle_cat').eq(0)
        box.prop("checked", false);
        box.prop("indeterminate", false);
    }
    check() {
        let checkbox = this.$el.find('.toggle_cat').eq(0);
        checkbox.prop("checked", true);
        this.toggle({"target":checkbox});

    }
    partialCheck() {
        this.$el.find('.toggle_cat').eq(0).prop("indeterminate", true);
    }
    showOnlyBtn() {
        // Show the 'only' button
        this.$el.find('.only_cat:first').css("display", "inline");
    }
    hideOnlyBtn() {
        // Hide the 'only' button
        this.$el.find('.only_cat:first').css("display", "none");
    }
    render() {
        let containedProjects = new Set();

        let countSubset = function (md) {
            if (md.get("subset")){
                md.get("subset").each(function(subcat){
                    subcat.get("projects").each(function(project){
                        containedProjects.add(project.get("slug"));
                    });

                    if (subcat.get("subset")) {
                        countSubset(subcat);
                    }

                });
            }
        }

        countSubset(this.model);
        
        this.model.get("projects").each(function(project){
            containedProjects.add(project.get("slug"));
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