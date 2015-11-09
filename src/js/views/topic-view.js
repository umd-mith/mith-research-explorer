import $ from 'jquery';
import * as Backbone from 'backbone';
import topic_tpl from '../templates/topic-tpl.js';
import Events from '../utils/backbone-events.js';

class TopicView extends Backbone.View {

    get events() {
        return {
            "click .toggle_topic:first" : "toggleTopic",
            "click .only_topic:first" : "showOneTopic"
        }
    }

    initialize(options) {
        this.parentEl = options.parentEl;
        this.collection = options.collection;
        this.listenTo(this.model, 'uncheck', this.uncheck);
        this.listenTo(this.model, 'check', this.check);
        // Convenience property
        this.subset = this.model.get("subset");

    }
    toggleTopic(e) {      
        let checked = $(e.target).prop("checked")
        if (checked) {
            Events.trigger("projects:include", {"topic":this.model.get("name")});            
        }
        else Events.trigger("projects:exclude", {"topic":this.model.get("name")});

        // If the topic has a subset, all the subset should be toggled too
        if (this.model.get("subset")){
            this.subset.each((subtopic) => {                
                if (checked) {
                    Events.trigger("projects:include", {"topic":subtopic.get("name")});
                    subtopic.trigger("check");
                } 
                else {
                    Events.trigger("projects:exclude", {"topic":subtopic.get("name")});
                    subtopic.trigger("uncheck");
                }
            });
        }

    }
    showOneTopic(e) {
        e.preventDefault();
        Events.trigger("projects:showOne", {"topic":this.model.get("name")});
        // Also check the checkbox
        this.$el.find('.toggle_topic').eq(0).prop("checked", true);
        // And tell other topics to uncheck themselves
        Events.trigger("topics:uncheck:others", this.model.cid);

        // If the topic has a subset, all the subset should be shown too
        if (this.subset){
            this.subset.each(function(subtopic){
                Events.trigger("projects:include", {"topic":subtopic.get("name")});
                subtopic.trigger("check");
            });
        }

    }
    uncheck() {
        this.$el.find('.toggle_topic').eq(0).prop("checked", false);
    }
    check() {
        let checkbox = this.$el.find('.toggle_topic').eq(0);
        checkbox.prop("checked", true);
        this.toggleTopic({"target":checkbox});

    }
    render() {
        let containedProjects = new Set();
        if (this.subset){
            this.subset.each(function(subtopic){
                subtopic.get("projects").each(function(project){
                    containedProjects.add(project.get("name"));
                });
            });
        }
        this.model.get("projects").each(function(project){
            containedProjects.add(project.get("name"));
        });
        this.model.set("totProjects", containedProjects.size)

        // Don't render if there are no contained projects
        if (containedProjects.size) {
            this.$el.append(topic_tpl(this.model.toJSON()))
        }
        return this.$el;
    }
}

export default TopicView;