import $ from 'jquery';
import * as Backbone from 'backbone';
import topic_tpl from '../templates/topic-tpl.js';
import Events from '../utils/backbone-events.js';

class TopicView extends Backbone.View {

    get events() {
        return {
            "click .toggle_topic" : "toggleTopic",
            "click .only_topic" : "showOneTopic"
        }
    }

    initialize(options) {
        this.parentEl = options.parentEl;
        this.collection = options.collection;
        this.listenTo(this.model, 'uncheck', this.uncheck);
        this.listenTo(this.model, 'check', this.check);
    }
    toggleTopic(e) {      
        if ($(e.target).prop("checked")) {
            Events.trigger("projects:include", {"topic":this.model.get("name")});            
        }
        else Events.trigger("projects:exclude", {"topic":this.model.get("name")});
    }
    showOneTopic(e) {
        e.preventDefault();
        Events.trigger("projects:showOne", {"topic":this.model.get("name")});
        // Also check the checkbox
        this.$el.find('.toggle_topic').prop("checked", true);
        // And tell other topics to uncheck themselves
        this.collection.trigger("uncheck:others", this.model.cid);
    }
    uncheck() {
        this.$el.find('.toggle_topic').prop("checked", false);
    }
    check() {
        let checkbox = this.$el.find('.toggle_topic')
        checkbox.prop("checked", true);
        this.toggleTopic({"target":checkbox});
    }
    render() {
        this.$el.append(topic_tpl(this.model.toJSON()))
        return this.$el;
    }
}

export default TopicView;