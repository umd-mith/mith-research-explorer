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
        this.collection.each((model) => {
            let catViewEl = (new CategoryView({model:model})).render()
            this.$el.first("dl").append(catViewEl);  

            if (model.get("subset")) {
                let subel = $("<dl/>").addClass("subset");
                catViewEl.append(subel);
                (new CategoriesView({collection:model.get("subset"), el: subel})).render();
            }
        });
    }
}

export default CategoriesView;