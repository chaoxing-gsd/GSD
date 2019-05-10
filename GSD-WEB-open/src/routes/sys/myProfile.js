/**
 * Created by Aaron on 2018/8/30.
 */
import requireAuthentication from "../../components/sys/requireAuthentication"
module.exports = {
    path: 'myProfile',

    getComponent(nextState, cb) {
        const history = requireAuthentication(
            require('../../components/MyProfile').default
        )
        require.ensure([], (require) => {
            cb(null,history )
        }, 'MyProfile')
    }
}