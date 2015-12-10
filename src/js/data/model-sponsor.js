import * as Backbone from 'backbone';
import Category from './model-category.js'

class Sponsor extends Category {
	constructor(options) {
		super(options);
		this.set("type", "Sponsor");
	}
}

export default Sponsor;