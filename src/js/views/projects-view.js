import $ from 'jquery';
import * as Backbone from 'backbone';
import * as _ from 'underscore';
import ProjectView from './project-view.js';
import Events from '../utils/backbone-events.js';

class ProjectsView extends Backbone.View {

    get categoriesTable() {
        return {
            "Topic" : "topic",
            "Type" : "research_type",
            "Sponsor" : "research_sponsor",
            "YearRange" : "start",
            "ActiveProject" : "active"
        }
    }

    initialize() {
        this.listenTo(Events, "projects:intersect", this.intersectProjects);
        this.listenTo(this, "projects:sort", this.sortProjects);
    }

    render(order) {

        if (!order) {
            this.collection.sort();
            // duplicate array, because reverse() actually changes 
            // the order of the original array.
            let models = this.collection.models.slice();
            for (let model of models.reverse()) {
                this.$el.append(
                    (new ProjectView({model:model})).render()
                );
            }
        }
        else if (order == 'year_newest') {
            let models = this.collection.models.slice();
            for (let model of models.reverse()) {
                // If the project was not previously visible, hide it again.
                let wasAttached = model.get("attached");

                this.$el.append(
                    (new ProjectView({model:model})).render()
                );
                
                if (!wasAttached){
                    model.trigger("view:remove");
                }
            }
        }
        else {
            this.collection.each( (model) =>{
                // If the project was not previously visible, hide it again.
                let wasAttached = model.get("attached");

                this.$el.append(                    
                    (new ProjectView({model:model})).render()
                );
                
                if (!wasAttached){
                    model.trigger("view:remove");
                }
            });
        }
        
    }

    sortProjects(order) {
        this.$el.empty();
        this.render(order);
    }

    intersectProjects(activeCategories) {

        this.collection.each( (proj) => {

            if (!proj.get("attached")){
                proj.trigger("view:restore");
            }

            for (let activeCat of Object.keys(activeCategories)) {
                if (activeCategories[activeCat].length) {
                    let field = this.categoriesTable[activeCat];
                    if (proj.get(field)) {
                        // it has to intersect with at least one term from each list
                        // in current active category
                        for (let terms of activeCategories[activeCat]) {
                            let fieldData = proj.get(field) instanceof Array ? proj.get(field) : [proj.get(field)];
                            if (activeCat == "YearRange") {
                                let yearLimits = terms[0].split(" – ");
                                terms = _.range(parseInt(yearLimits[0]), parseInt(yearLimits[1])+1);
                                fieldData = [parseInt(fieldData.substring(0,4))];
                            }
                            if (!_.intersection(fieldData, terms).length) {
                                proj.trigger("view:remove");
                            }
                        }
                    }
                }                
            }
        });
    }
}

export default ProjectsView;