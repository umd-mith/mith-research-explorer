import * as Handlebars from 'handlebars';

let topic_tpl = `
<dt><input type="checkbox" class="toggle_topic" checked> <a href="#" class="only_topic">{{name}}</a></dt>
<dd>{{totProjects}}</dd>`

export default Handlebars.compile(topic_tpl);