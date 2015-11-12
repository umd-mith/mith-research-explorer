import * as Handlebars from 'handlebars';

let project_tpl = `
<div class="fusion-portfolio-post mith-research-post fusion-col-spacing fusion-image-landscape">
    <div class="fusion-portfolio-content-wrapper mith-research-content-wrapper" style="opacity: 1">
        <div class="fusion-image-wrapper" aria-haspopup="true">
            <a href="/research/{{slug}}">
                <img width="669" height="200" 
                     src="{{thumbnail}}" 
                     class="attachment-full wp-post-image" />
            </a>
        </div>
        <div class="fusion-portfolio-content mith-research-content">
            <h2 class="entry-title">
                <a href="/research/{{slug}}/">
                    {{title}}
                </a>
            </h2>
            <div class="fusion-post-content">

                <div class="mith-research-dates" style="margin-top:0;margin-bottom:5px;">
                    {{date}}
                </div>
                <p>{{description}}</p>
            </div>
        </div>
    </div>
</div>`

export default Handlebars.compile(project_tpl);