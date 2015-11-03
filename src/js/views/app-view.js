import $ from 'jquery';
import * as Backbone from 'backbone';
import AppRouter from '../routers/app-router.js';

class MRE extends Backbone.View {

	get el() { return "#home"; }

    initialize() {
    	new AppRouter()
    }
}

export default MRE;