import * as Handlebars from 'handlebars';

let category_tpl = `
<dt><input type="checkbox" class="toggle_cat" checked> {{name}} <a href="#" class="only_cat">(only)<a/></dt>
<dd>{{totProjects}}</dd>`

export default Handlebars.compile(category_tpl);