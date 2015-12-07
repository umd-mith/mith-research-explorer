import $ from 'jquery';
import * as Backbone from 'backbone';
import CategoryView from './category-view.js';
import Events from '../utils/backbone-events.js';

class CategoriesView extends Backbone.View {

    initialize() {
        this.listenTo(Events, 'categories:uncheck:others', this.uncheckOthers);
    }

    uncheckOthers(catId){
        this.collection.each(function(cat){
            if (cat.cid != catId){
                cat.trigger('uncheck');
            }
        });
    }

    showAll(e) {
        e.preventDefault();
        this.collection.each((cat) => {
            cat.trigger("check");
        });
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