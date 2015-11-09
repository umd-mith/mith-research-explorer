import $ from 'jquery';
import * as Backbone from 'backbone';
import CategoriesView from './categories-view.js';

class TypesView extends CategoriesView {

    constructor(options){
        super(options);
    }

    get events() {
        return {"click #all_types": "showAll"};
    }

}

export default TypesView;