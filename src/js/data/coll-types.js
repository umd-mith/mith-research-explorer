import * as Backbone from 'backbone';
import Categories from './coll-categories.js';
import Type from './model-type.js';

class Types extends Categories {
	constructor() {
		super();
		this.model = Type;		
	}
}

export default Types;