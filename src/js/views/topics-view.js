import $ from 'jquery';
import * as Backbone from 'backbone';
import TopicView from './topic-view.js';

class TopicsView extends Backbone.View {

    get events() {
        return {"click #all_topics": "showAll"};
    }

    initialize() {
        this.listenTo(this.collection, 'uncheck:others', this.uncheckOthers);
    }

    uncheckOthers(topicId){
        this.collection.each(function(topic){
            if (topic.cid != topicId){
                topic.trigger('uncheck');                
            }
        });
    }

    showAll(e) {
        e.preventDefault();
        this.collection.each((topic) => {
            topic.trigger("check");
        });
    }

    render() {
        this.collection.each((model) => {
            if (model.get("projects").length) {
                this.$el.find("dl").append(
                    (new TopicView({model:model, collection: this.collection})).render()
                );             
            }
        });
    }
}

export default TopicsView;