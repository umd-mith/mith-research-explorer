import * as Backbone from 'backbone';
import Topic from './model-topic.js';

class Topics extends Backbone.Collection {
	constructor() {
		super();
		this.model = Topic;		
	}
}

export default Topics;