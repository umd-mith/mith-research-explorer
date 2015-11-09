import * as Backbone from 'backbone';
import Projects from './coll-projects.js';

class Category extends Backbone.Model {
	constructor(options) {
		super(options);
		this.set("projects", new Projects)
	}
}

export default Category;