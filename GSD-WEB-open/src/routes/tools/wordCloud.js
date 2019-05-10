/**
 * Created by Aaron on 2018/8/30.
 */
import ToolApp from "../../containers/toolApp"
module.exports = {
    path: '/toolPages/wordCloud',

    getComponent(nextState, cb) {
        const wordCloud = ToolApp(
            require('../../components/tools/wordCloud').default
        )
        require.ensure([], (require) => {
            cb(null,wordCloud)
        }, 'WordCloud')
    }
}