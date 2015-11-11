import * as Backbone from 'backbone';
import Project from './model-project.js';

class Projects extends Backbone.Collection {
	constructor(options) {
		super(options);
		this.model = Project;
		this.comparator = "start";
	}
}

export default Projects;