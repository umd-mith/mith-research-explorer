import $ from 'jquery';
import * as Backbone from 'backbone';
import topic_tpl from '../templates/topic-tpl.js';

class TopicView extends Backbone.View {

	get events() {
		return {
			"click .inc_topic" : "includeTopic",
			"click .only_topic" : "showTopic"
		}
	}

	initialize(options) {
        this.parentEl = options.parentEl;
    }
    includeTopic() {    	
    	Backbone.trigger("includeProjects", {"topic":this.model.name});
    }
    showTopic(e) {
    	e.preventDefault();
    	console.log('yeh');
    	Backbone.trigger("showProjects", {"topic":this.model.name});
    }
    render() {
        $(this.parentEl).append(topic_tpl(this.model.toJSON()));
    }
}

export default TopicView;