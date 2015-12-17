import $ from 'jquery';
import * as Backbone from 'backbone';
import MRE from './views/app-view.js';

Backbone.history.start({ pushState: true, root: '/' });

$(() => {
    // Before building, replace *Data parameters with actual location.
    new MRE({
            el:"#content", 
            projectsData: "projects.json",
            topicsData: "taxonomy.json",
            typesData: "types.json",
         });
});