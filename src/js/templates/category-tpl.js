import * as Handlebars from 'handlebars';

let category_tpl = `
<span class="cat_count">{{totProjects}}</span>
<a href="javascript:void(0);" class="only_cat">(only)<a/>
<span class="cb-wrapper">
	<a href="#" class="cb-icon"><input type="checkbox" class="toggle_cat cb-input" checked></a>
	<label for="class="cb-label">{{name}}</label>
</span>`

export default Handlebars.compile(category_tpl);