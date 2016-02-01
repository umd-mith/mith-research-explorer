import * as Handlebars from 'handlebars';

let category_tpl = `
<dd class="cat_count">{{totProjects}}</dd>
<dt>{{#if subset}}<i class="fa fa-caret-right toggle_subset"></i>{{/if}}<a href="#" class="only_cat">only<a/>
<span class="cb-wrapper">
	<a href="#" class="cb-icon"><input type="checkbox" class="toggle_cat cb-input"></a>
	<label class="cb-label" title="{{name}}">{{name}}</label>
</span></dt>
`

export default Handlebars.compile(category_tpl);