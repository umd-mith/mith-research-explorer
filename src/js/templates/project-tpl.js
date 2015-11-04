import * as Handlebars from 'handlebars';

let project_tpl = `
<div class="fusion-portfolio-post mith-research-post fusion-col-spacing fusion-image-landscape">
    <div class="fusion-portfolio-content-wrapper mith-research-content-wrapper" style="opacity: 1">
        <div class="fusion-image-wrapper" aria-haspopup="true">
            <a href="/research/{{name}}">
                <img width="669" height="200" 
                     src="https://dev.mith.org/wp-content/uploads/2014/04/header_hathi-trust.png" 
                     class="attachment-full wp-post-image" alt="header_hathi-trust" />
            </a>
        </div>
        <div class="fusion-portfolio-content mith-research-content">
            <h2 class="entry-title">
                <a href="/research/{{name}}/">
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