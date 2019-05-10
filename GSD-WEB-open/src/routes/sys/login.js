/**
 * Created by Aaron on 2018/8/30.
 */
module.exports = {
    path: 'login',

    getComponent(nextState, cb) {
        require.ensure([], (require) => {
            cb(null, require('../../components/sys/login').default)
        }, 'Login')
    }
}