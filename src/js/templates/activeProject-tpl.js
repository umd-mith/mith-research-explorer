import * as Handlebars from 'handlebars';

let activeProject_tpl = `
<dt><input type="checkbox" class="toggle_cat"> Show only active projects</dt>
<dd>{{totProjects}}</dd>`

export default Handlebars.compile(activeProject_tpl);