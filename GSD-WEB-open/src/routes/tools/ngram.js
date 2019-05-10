/**
 * Created by Aaron on 2018/8/30.
 */
import ToolApp from "../../containers/toolApp"
module.exports = {
    path: '/toolPages/ngram',

    getComponent(nextState, cb) {
        const NgRam = ToolApp(
            require('../../components/tools/ngRam').default
        )
        require.ensure([], (require) => {
            cb(null,NgRam)
        }, 'NgRam')
    }
}