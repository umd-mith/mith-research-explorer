import $ from 'jquery';
import * as Backbone from 'backbone';
import project_tpl from '../templates/project-tpl.js';

class ProjectView extends Backbone.View {
    initialize(options) {
        this.parentEl = options.parentEl;

        // listeners
        this.listenTo(this.model, 'view:remove', this.detach);
        this.listenTo(this.model, 'view:restore', this.render);

        let isActive = this.model.get("activeTypes").indexOf("Active") == -1 ? false : true;

        var monthNames = ["January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
        ];

        let startDateParts = /^(\d{4})-?(\d{2})?-?(\d{2})?/.exec(this.model.get("start"));
        let startYear = startDateParts ? startDateParts[1] : null;
        let startMonth = startDateParts ? startDateParts[2] : null;
        let endDateParts = /^(\d{4})-?(\d{2})?-?(\d{2})?/.exec(this.model.get("end"));
        let endYear = endDateParts ? endDateParts[1] : null;
        let endMonth = endDateParts ? endDateParts[2] : null;
        let startDate = "";
        let endDate = "";
        if (startYear && !startMonth){
            startDate = startYear;
        }
        else if (startYear && startMonth) {
            let month = monthNames[parseInt(startMonth)-1];
            if (month) {
                startDate = month + " ";
            }
            startDate += startYear;
        }

        if (endYear && !endMonth){
            endDate = endYear;
        }
        else if (endYear && endMonth) {
            let month = monthNames[parseInt(endMonth)-1];
            if (month) {
                endDate = month + " ";
            }
            endDate += endYear;
        } else if (isActive) {
            endDate += "present";
        } 

        if (startDate){
            let dateString = endDate ? startDate + " – " + endDate : startDate;
            this.model.set("date", dateString);
        }

    }
    render() {
        this.model.set("attached", true);
        this.$el.html(project_tpl(this.model.toJSON()));
        return this.$el;
    } 
    detach() {
        this.model.set("attached", false);
        this.$el.empty();
    }
}

export default ProjectView;