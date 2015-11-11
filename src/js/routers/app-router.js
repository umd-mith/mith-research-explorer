import * as Backbone from 'backbone';

class AppRouter extends Backbone.Router {
    get routes() {
        return {
            '': 'loadDefault'
        }
    }

    loadDefault() {
        window.console.log('Router initialized');
    }
}

export default AppRouter;