/**
 * Created by Aaron on 2018/8/30.
 */
import requireAuthentication from "../../components/sys/requireAuthentication"
module.exports = {
    path: 'myNotes',

    getComponent(nextState, cb) {
        const history = requireAuthentication(
            require('../../components/myNotes').default
        )
        require.ensure([], (require) => {
            cb(null,history )
        }, 'MyNotes')
    }
}