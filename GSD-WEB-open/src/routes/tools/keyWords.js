/**
 * Created by Aaron on 2018/8/30.
 */
import ToolApp from "../../containers/toolApp"
module.exports = {
    path: '/toolPages/keyWords',

    getComponent(nextState, cb) {
        const keyWords = ToolApp(
            require('../../components/tools/keyWords').default
        )
        require.ensure([], (require) => {
            cb(null,keyWords)
        }, 'KeyWords')
    }
}