import * as Backbone from 'backbone';

class Project extends Backbone.Model {
	// Set all categories as active on creation
	parse(resp, options){
		resp["activeTopics"] = resp.topic ? resp.topic : ["Other"];
		resp["activeTypes"] = resp.research_type ? resp.research_type : ["Other"];
		return resp;
	}
}

export default Project;