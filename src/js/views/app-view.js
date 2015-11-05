import $ from 'jquery';
import * as Backbone from 'backbone';
import AppRouter from '../routers/app-router.js';
import Projects from '../data/coll-projects.js';
import Topics from '../data/coll-topics.js';
import ProjectsView from '../views/projects-view.js';
import TopicsView from '../views/topics-view.js';

class MRE extends Backbone.View {

    initialize() {
        // Start router
        new AppRouter();

        // Load projects and start subview
        var projs = new Projects;
        var projsView = new ProjectsView({collection: projs, el: '.fusion-portfolio-wrapper'});
        projs.url = '/src/projects.json';
        projs.deferred = projs.fetch();

        // Load topics (subview is instatiated when all data is loaded)
        var topics = new Topics();        
        topics.url = '/src/taxonomy.json';
        topics.deferred = topics.fetch();

        // When projects and topics are loaded, assign projects to each topic
        // Maybe we could use ES6 promises here
        projs.deferred.done( function () {

            // Build table of projects by research type and topic
            var projsByType = {}
            var projsByTopic = {}
            projs.each(function(proj){
                let types = proj.get("research_type");
                types = types ? types : ["Other"];
                for (let rType of types) {
                    if (projsByType[rType]) { 
                        projsByType[rType].push(proj);
                    } 
                    else projsByType[rType] = [proj];
                }

                let topics = proj.get("topic");
                topics = topics ? topics : ["Other"];
                for (let topic of topics) {
                    if (projsByTopic[topic]) { 
                        projsByTopic[topic].push(proj);
                    } 
                    else projsByTopic[topic] = [proj];
                }
            });

            topics.deferred.done( function () {
                topics.each(function(topic){
                    let name = topic.get("name");
                    topic.get("projects").add(projsByTopic[name]);
                    
                    // Create nested collections
                    if (topic.get("narrower") ? topic.get("narrower").length : false){
                        let subset = new Topics;
                        topic.set("subset", subset);
                        for (let narrower of topic.get("narrower")) {
                            subset.add(topics.where({"name":narrower}));                            
                        }                        
                        console.log (subset);
                    }
                });
                // Now instantiate topics subview:
                new TopicsView({el: '#topics', collection: topics}).render();
            });

        });
    }
}

export default MRE;