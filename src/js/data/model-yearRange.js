import * as Backbone from 'backbone';
import Category from './model-category.js'

class YearRange extends Category {
	constructor(options) {
		super(options);
		this.set("type", "YearRange");
	}
}

export default YearRange;