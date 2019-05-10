/**
 * Created by Aaron on 2018/8/30.
 */
import requireAuthentication from "../../components/sys/requireAuthentication"
module.exports = {
    path: 'addNewDb',

    getComponent(nextState, cb) {
        const addNewDb = requireAuthentication(
            require('../../components/sys/addNewDb').default
        )
        require.ensure([], (require) => {
            cb(null,addNewDb )
        }, 'AddNewDb')
    }
}

