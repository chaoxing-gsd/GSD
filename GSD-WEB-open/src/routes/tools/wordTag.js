/**
 * Created by Aaron on 2018/8/30.
 */
import ToolApp from "../../containers/toolApp"
module.exports = {
    path: '/toolPages/wordTag',

    getComponent(nextState, cb) {
        const wordTag = ToolApp(
            require('../../components/tools/wordTag').default
        )
        require.ensure([], (require) => {
            cb(null,wordTag)
        }, 'WordTag')
    }
}