import $ from 'jquery';
import * as Backbone from 'backbone';
import CategoriesView from './categories-view.js';

class SponsorsView extends CategoriesView {

    constructor(options){
        super(options);
    }

    get events() {
        return {"click #all_sponsors": "showAll"};
    }

}

export default SponsorsView;