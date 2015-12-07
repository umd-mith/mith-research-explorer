import * as Backbone from 'backbone';
import Categories from './coll-categories.js';
import YearRange from './model-yearRange.js';

class Years extends Categories {
	constructor() {
		super();
		this.model = YearRange;
	}
}

export default Years;