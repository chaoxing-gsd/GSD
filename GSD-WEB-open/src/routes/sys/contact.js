/**
 * Created by Aaron on 2018/8/30.
 */
module.exports = {
    path: 'contact',

    getComponent(nextState, cb) {
        require.ensure([], (require) => {
            cb(null, require('../../components/sys/contact').default)
        }, 'Contact')
    }
}