import * as Backbone from 'backbone';
import * as _ from 'underscore';

class Project extends Backbone.Model {
	// Set all categories as active on creation
	parse(resp, options){             
        if (!resp.research_type) {
            resp.research_type = ["Other"];
        }
        if (!resp.research_sponsor) {
            resp.research_type = ["Other"];
        }
        if (!resp.topic) {
            resp.research_type = ["Other"];
        }
        if (!resp.start) {
            resp.research_type = "0000";
        }

        if (resp.research_type.indexOf("Active") != -1) {
            resp["active"] = true;
        }
		return resp;
	}
}

export default Project;