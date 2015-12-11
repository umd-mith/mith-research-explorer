import * as Backbone from 'backbone';
import Category from './model-category.js'

class Type extends Category {
	constructor(options) {
		super(options);
		this.set("type", "Type");
	}
}

export default Type;