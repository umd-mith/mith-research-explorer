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

        let startDateRaw = this.model.get("start");
        let endDateRaw = this.model.get("end");
        let startDate = "";
        let endDate = "";
        if (/^\d{4}$/.exec(startDateRaw)){
            startDate = startDateRaw
        }
        else if (startDateRaw) {
            let date = new Date(startDateRaw);
            let month = monthNames[date.getMonth()];
            if (month) {
                startDate = month + " ";
            }
            startDate += date.getFullYear();
        }

        if (/^\d{4}$/.exec(endDateRaw)){
            endDate = endDateRaw
        }
        else if (endDateRaw) {
            let date = new Date(endDateRaw);
            let month = monthNames[date.getMonth()];
            if (month) {
                endDate = month + " ";
            }
            endDate += date.getFullYear();
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