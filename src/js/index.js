import $ from 'jquery';
import * as Backbone from 'backbone';
import MRE from './views/app-view.js';

// const mre = new MRE();
Backbone.history.start({ pushState: true, root: '/' });

$(() => {
    new MRE();
});