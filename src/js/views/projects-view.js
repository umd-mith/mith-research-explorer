import $ from 'jquery';
import * as Backbone from 'backbone';
import ProjectView from './project-view.js';

class ProjectsView extends Backbone.View {
    initialize() {
        this.listenTo(this.collection, 'add', this.addOne)
        // this.listenTo(this.collection, 'remove', this.removeOne)
    }

    addOne(model) {
        (new ProjectView({model:model, parentEl: this.el})).render();
    }
}

export default ProjectsView;