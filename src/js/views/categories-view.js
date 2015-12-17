import $ from 'jquery';
import * as Backbone from 'backbone';
import CategoryView from './category-view.js';
import Events from '../utils/backbone-events.js';

class CategoriesView extends Backbone.View {

    initialize() {
        this.listenTo(Events, 'categories:uncheck:others', this.uncheckOthers);
        this.listenTo(Events, 'categories:partialCheck', this.partialCheck);
        this.listenTo(this.collection, "change:active", this.propagateActive);
    }

    uncheckOthers(catId){
        let trigger = false;
        this.collection.each(function(cat){
            if (cat.cid != catId){
                if (cat.get("active")){
                    trigger = true;
                    cat.set("active", false, {silent: true});                    
                }
                cat.trigger('uncheck');
            }
        });
        if (trigger) {
            this.propagateActive();
        }        
    }

    partialCheck(catName, checked) {
        let cat = this.collection.where({"name": catName})[0];
        if (cat) {
            cat.trigger("partialCheck", checked); 
            if (cat.get("broader").length) {
                Events.trigger("categories:partialCheck", cat.get("broader")[0], checked);
            }
       }
    }

    showAll(e) {
        e.preventDefault();
        this.collection.each((cat) => {
            cat.trigger("check");
        });
    }

    propagateActive() {
        Events.trigger("app:updateCats", this.collection.first().get("type"));
    }

    render() {

        let container = $("<dl/>");
        if (this.className){
            container.addClass(this.className);
        }

        this.collection.each((model) => {
            let catViewEl = (new CategoryView({model:model})).render()
            container.append(catViewEl)
            this.$el.append(container);  

            if (model.get("subset")) {
                catViewEl.append(
                    (new CategoriesView({collection:model.get("subset"), className: "subset"})).render()
                );
            }            
        });
        return container;
    }
}

export default CategoriesView;