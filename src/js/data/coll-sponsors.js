import * as Backbone from 'backbone';
import Categories from './coll-categories.js';
import Sponsor from './model-sponsor.js';

class Sponsors extends Categories {
	constructor() {
		super();
		this.model = Sponsor;
	}
}

export default Sponsors;