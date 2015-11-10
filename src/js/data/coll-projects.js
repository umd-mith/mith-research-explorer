import * as Backbone from 'backbone';
import Project from './model-project.js';

class Projects extends Backbone.Collection {
	constructor(options) {
		super(options);
		this.model = Project;
	}
	comparator(model){
		let yyyymm = model.get("research_start_yyyymm");
		let yr = model.get("research_start_yr")
		
		return yyyymm ? yyyymm : yr;
	}
}

export default Projects;