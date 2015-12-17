import * as Backbone from 'backbone';
import Category from './model-category.js';

class Categories extends Backbone.Collection {
    constructor() {
        super();
        this.model = Category;      
    }

    _findActiveIn(cat) {

        let arr = [];

        let _doSubsets = (md) => {
            if (md.get("subset")){
                md.get("subset").each(function (subcat) {
                    arr.push(subcat.get("name"));
                });
            }
        }

        if (cat.get("active")){            

            arr.push(cat.get("name"));
            _doSubsets(cat);

        }        

        return arr;

    }

    getActive() {        

        let active = [];

        this.each( (cat) => {
            if (cat.get("active")){
                active.push(this._findActiveIn(cat));
            }
            else if (cat.get("subset")) {
                let subsets = this._findActiveIn(cat.get("subset"));
                if (subsets.length) {
                    active.push();                    
                }
            }
        });

        return active;
    }
}

export default Categories;