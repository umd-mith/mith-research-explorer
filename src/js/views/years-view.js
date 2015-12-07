import $ from 'jquery';
import * as Backbone from 'backbone';
import CategoriesView from './categories-view.js';

class YearsView extends CategoriesView {

    constructor(options){
        super(options);
    }

    get events() {
        return {"click #all_years": "showAll"};
    }

}

export default YearsView;