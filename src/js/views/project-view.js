import $ from 'jquery';
import * as Backbone from 'backbone';
import project_tpl from '../templates/project-tpl.js';

class ProjectView extends Backbone.View {
    initialize(options) {
        this.parentEl = options.parentEl;

        // listeners
        this.listenTo(this.model, 'view:remove', this.detach);
        this.listenTo(this.model, 'view:restore', this.render);

        var monthNames = ["January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
        ];

        let startDateRaw = this.model.get("research_start_yyyymm");
        let endDateRaw = this.model.get("research_end_yyyymm");
        let startDate = "";
        let endDate = "";
        if (startDateRaw) {
            let date = new Date(startDateRaw);
            let month = monthNames[date.getMonth()];
            if (month) {
                startDate = month + " ";
            }
            startDate += date.getFullYear();
        }
        if (endDateRaw) {
            let date = new Date(endDateRaw);
            let month = monthNames[date.getMonth()];
            if (month) {
                endDate = month + " ";
            }
            endDate += date.getFullYear();
        }
        
        if (startDate && endDate){
            this.model.set("date", startDate+" – "+endDate);
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