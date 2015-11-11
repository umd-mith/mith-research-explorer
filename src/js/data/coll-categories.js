import * as Backbone from 'backbone';
import Category from './model-category.js';

class Categories extends Backbone.Collection {
	constructor() {
		super();
		this.model = Category;		
	}
}

export default Categories;