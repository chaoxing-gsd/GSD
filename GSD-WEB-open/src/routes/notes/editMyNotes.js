/**
 * Created by Aaron on 2018/8/30.
 */
import requireAuthentication from "../../components/sys/requireAuthentication"
module.exports = {
    path: 'editMyNotes',

    getComponent(nextState, cb) {
        const history = requireAuthentication(
            require('../../components/myNotes/edit').default
        )
        require.ensure([], (require) => {
            cb(null,history )
        }, 'EditNotes')
    }
}