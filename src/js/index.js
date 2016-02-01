import $ from 'jquery';
import * as Backbone from 'backbone';
import MRE from './views/app-view.js';

Backbone.history.start({ pushState: true, root: '/' });

$(() => {
    // Before building, replace *Data parameters with actual location.
    new MRE({
            el:"#content", 
            projectsData: "/wp-content/mu-plugins/mith-research-explorer-data/projects.json",
            topicsData: "/wp-content/mu-plugins/mith-research-explorer-data/topics.json",
            typesData: "/wp-content/mu-plugins/mith-research-explorer-data/types.json",
         });
});