import * as Backbone from 'backbone';
import Projects from './coll-projects.js';

class Topic extends Backbone.Model {
	constructor(options) {
		super(options);
		this.projects = new Projects
	}
}

export default Topic;