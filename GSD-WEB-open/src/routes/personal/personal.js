/**
 * Created by qiye on 2018/8/30.
 */
import requireAuthentication from "../../components/sys/requireAuthentication"
module.exports = {
    path: 'personal',

    getComponent(nextState, cb) {
        const history = requireAuthentication(
            require('../../components/personal/personal').default
        )
        require.ensure([], (require) => {
            cb(null,history )
        }, 'personal')
    }
}