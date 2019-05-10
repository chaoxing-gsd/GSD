/**
 * Created by Aaron on 2018/8/30.
 */
import ToolApp from "../../containers/toolApp"
module.exports = {
    path: '/toolPages/similarWord',

    getComponent(nextState, cb) {
        const similarWord = ToolApp(
            require('../../components/tools/similarWord').default
        )
        require.ensure([], (require) => {
            cb(null,similarWord)
        }, 'SimilarWord')
    }
}