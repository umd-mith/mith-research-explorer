import * as Backbone from 'backbone';
import Categories from './coll-categories.js';
import ActiveProject from './model-activeProject.js';

class ActiveProjects extends Categories {
	constructor() {
		super();
		this.model = ActiveProject;		
	}
}

export default ActiveProjects;