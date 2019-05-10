/**
 * Created by Aaron on 2018/8/30.
 */
import requireAuthentication from "../components/sys/requireAuthentication"
module.exports = {
    path: 'analyse',

    getComponent(nextState, cb) {
        const analyse = requireAuthentication(
            require('../components/history/analyse').default
        )

        require.ensure([], (require) => {
            cb(null, analyse)
        }, 'AnalysePage')
    }
}