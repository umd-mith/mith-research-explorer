import $ from 'jquery';
import * as Backbone from 'backbone';
import CategoriesView from './categories-view.js';

class TopicsView extends CategoriesView {

    constructor(options){
        super(options);
    }

    get events() {
        return {"click #all_topics": "showAll"};
    }

}

export default TopicsView;