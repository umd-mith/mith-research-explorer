import * as Handlebars from 'handlebars';

let category_tpl = `
<dt><input type="checkbox" class="toggle_cat" checked> <a href="#" class="only_cat">{{name}}</a></dt>
<dd>{{totProjects}}</dd>`

export default Handlebars.compile(category_tpl);