import * as Backbone from 'backbone';
import Categories from './coll-categories.js';
import Topic from './model-topic.js';

class Topics extends Categories {
	constructor() {
		super();
		this.model = Topic;		
	}
}

export default Topics;