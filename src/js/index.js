import $ from 'jquery';
import * as Backbone from 'backbone';
import MRE from './views/app-view.js';

Backbone.history.start({ pushState: true, root: '/' });

$(() => {
    new MRE({el:"#content"});
});