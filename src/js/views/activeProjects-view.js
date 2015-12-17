import $ from 'jquery';
import * as Backbone from 'backbone';
import CategoriesView from './categories-view.js';
import ActiveProjectView from './activeProject-view.js';

class ActiveProjectsView extends CategoriesView {

    constructor(options){
        super(options);
    }

    render() {

        let container = $("<dl/>");
        let catViewEl = new ActiveProjectView({model:this.collection.first()}).render();
		container.append(catViewEl)
        this.$el.append(container);  

        return container;
    }

}

export default ActiveProjectsView;