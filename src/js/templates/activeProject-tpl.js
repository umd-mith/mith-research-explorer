import * as Handlebars from 'handlebars';

let activeProject_tpl = `
<dd class="cat_count">{{totProjects}}</dd>
<dt>
<span class="cb-wrapper">
	<a href="#" class="cb-icon"><input type="checkbox" class="toggle_cat cb-input"></a>
	<label class="cb-label" title="Show only active">Show only active</label>
</span></dt>
`

export default Handlebars.compile(activeProject_tpl);