/**
 * Created by Aaron on 2018/8/30.
 */
import requireAuthentication from "../../components/sys/requireAuthentication"
module.exports = {
    path: 'mySource',

    getComponent(nextState, cb) {
        const mySource = requireAuthentication(
            require('../../components/mySource').default
        )
        require.ensure([], (require) => {
            cb(null,mySource )
        }, 'mySource')
    }
}