/**
 * Created by Aaron on 2018/8/30.
 */
import ToolApp from "../../containers/toolApp"
module.exports = {
    path: '/toolPages/geoMap',

    getComponent(nextState, cb) {
        const geoMap = ToolApp(
            require('../../components/charts/GeoMap').default
        )
        require.ensure([], (require) => {
            cb(null,geoMap)
        }, 'GeoMap')
    }
}