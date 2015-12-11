import * as Backbone from 'backbone';
import Category from './model-category.js'

class ActiveProject extends Category {
	constructor(options) {
		super(options);
		this.set("type", "ActiveProject");
	}
}

export default ActiveProject;