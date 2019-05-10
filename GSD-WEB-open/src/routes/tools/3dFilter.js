/**
 * Created by Aaron on 2018/8/30.
 */
import ToolApp from "../../containers/toolApp"
module.exports = {
    path: '/toolPages/threedFilterChart',

    getComponent(nextState, cb) {
        const filterScatter = ToolApp(
            require('../../components/charts/fullScreenFilterScatter').default
        )
        require.ensure([], (require) => {
            cb(null,filterScatter)
        }, 'FullScreenFilterScatter')
    }
}