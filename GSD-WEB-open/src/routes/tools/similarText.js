/**
 * Created by Aaron on 2018/8/30.
 */
import ToolApp from "../../containers/toolApp"
module.exports = {
    path: '/toolPages/similarText',

    getComponent(nextState, cb) {
        const similarText = ToolApp(
            require('../../components/tools/similarText').default
        )
        require.ensure([], (require) => {
            cb(null,similarText)
        }, 'SimilarText')
    }
}