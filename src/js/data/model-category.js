import * as Backbone from 'backbone';
import Projects from './coll-projects.js';

class Category extends Backbone.Model {
	constructor(options) {
		super(options);
		this.set("projects", new Projects)
	}

    getTerms() {

        let terms = [this.get("name")];        

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

        _parseSubsets(this);

        return terms;

    }
}

export default Category;