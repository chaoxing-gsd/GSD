/**
 * Created by Aaron on 2018/8/30.
 */
import ToolApp from "../../containers/toolApp"
module.exports = {
    path: '/toolPages/gisMap',

    getComponent(nextState, cb) {
        const gisMap = ToolApp(
            require('../../components/charts/GISMap').default
        )
        require.ensure([], (require) => {
            cb(null,gisMap )
        }, 'GISMap')
    }
}