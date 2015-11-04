import $ from 'jquery';
import * as Backbone from 'backbone';
import project_tpl from '../templates/project-tpl.js';

class ProjectView extends Backbone.View {
    initialize(options) {
        this.parentEl = options.parentEl;
        // {{research_start_mth}} {{research_start_yr}}<span class="dates-sep"> &ndash; </span>
        //             {{research_end_mth}} {{research_end_yr}}

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
        $(this.parentEl).append(project_tpl(this.model.toJSON()));
    } 
}

export default ProjectView;