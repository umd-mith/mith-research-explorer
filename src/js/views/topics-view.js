import $ from 'jquery';
import * as Backbone from 'backbone';
import TopicView from './topic-view.js';

class TopicsView extends Backbone.View {
    render() {
        this.collection.each((model) => {
            if (model.get("projects").length) {
                (new TopicView({model:model, parentEl: this.el})).render();             
            }
        });
    }
}

export default TopicsView;