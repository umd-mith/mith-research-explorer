import * as Backbone from 'backbone';
import * as _ from 'underscore';

class Project extends Backbone.Model {
	// Set all categories as active on creation
	parse(resp, options){             
        if (resp.research_type) {
            if (resp.research_type.indexOf("Active") != -1) {
                resp["active"] = true;
            }
        }
        if (!resp.research_sponsor) {
            resp.research_sponsor = ["No sponsor"];
        }

        
		return resp;
	}
}

export default Project;