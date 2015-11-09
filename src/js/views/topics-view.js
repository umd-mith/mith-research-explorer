import $ from 'jquery';
import * as Backbone from 'backbone';
import TopicView from './topic-view.js';
import Events from '../utils/backbone-events.js';

class TopicsView extends Backbone.View {

    get events() {
        return {"click #all_topics": "showAll"};
    }

    initialize() {
        this.listenTo(Events, 'topics:uncheck:others', this.uncheckOthers);
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
            let topicViewEl = (new TopicView({model:model, collection: this.collection})).render()
            this.$el.first("dl").append(topicViewEl);  

            if (model.get("subset")) {
                let subel = $("<dl/>").addClass("subset");
                topicViewEl.append(subel);
                (new TopicsView({collection:model.get("subset"), el: subel})).render();
            }
        });
    }
}

export default TopicsView;