import $ from 'jquery';
import * as Backbone from 'backbone';
import CategoryView from './category-view.js';
import Events from '../utils/backbone-events.js';

class CategoriesView extends Backbone.View {

    get tagName() {
        return "dl";
    }

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
        this.collection.each((model) => {
            let catViewEl = (new CategoryView({model:model})).render()
            this.$el.append(catViewEl);  

            if (model.get("subset")) {
                catViewEl.append(
                    (new CategoriesView({collection:model.get("subset"), className: "subset"})).render()
                );
            }            
        });
        return this.$el;
    }
}

export default CategoriesView;