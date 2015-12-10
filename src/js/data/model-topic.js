import * as Backbone from 'backbone';
import Category from './model-category.js'

class Topic extends Category {
	constructor(options) {
		super(options);
		this.set("type", "Topic");
	}
}

export default Topic;