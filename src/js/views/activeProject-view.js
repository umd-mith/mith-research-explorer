import $ from 'jquery';
import * as Backbone from 'backbone';
import CategoryView from './category-view.js';
import activeProject_tpl from '../templates/activeProject-tpl.js';

class ActiveProjectView extends CategoryView {

    constructor(options){
        super(options);
    }

    render() {
        
        let containedProjects = this.getActiveProjectsCount();        

        // Don't render if there are no contained projects
        if (containedProjects) {
            this.$el.append(activeProject_tpl(this.model.toJSON()));
        }
        return this.$el;
    }

}

export default ActiveProjectView;