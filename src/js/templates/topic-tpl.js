import * as Handlebars from 'handlebars';

let topic_tpl = `
<dt><input type="checkbox" class="inc_topic"> <a href="#" class="only_topic">{{name}}</a></dt>
<dd>{{projects.length}}</dd>`

export default Handlebars.compile(topic_tpl);