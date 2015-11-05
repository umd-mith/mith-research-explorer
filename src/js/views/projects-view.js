import $ from 'jquery';
import * as Backbone from 'backbone';
import ProjectView from './project-view.js';

class ProjectsView extends Backbone.View {
    initialize() {
        this.listenTo(this.collection, 'add', this.addOne)
        // this.listenTo(this.collection, 'remove', this.removeOne)
        this.listenTo(Backbone, "showProjects", this.showProjects);
    }

    addOne(model) {
        (new ProjectView({model:model, parentEl: this.el})).render();
    }

    showProjects() {
    	console.log('showing projects');
    }
}

export default ProjectsView;