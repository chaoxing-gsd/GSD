/**
 * Created by Aaron on 2018/8/30.
 */
module.exports = {
    path: '/wikiList',

    getComponent(nextState, cb) {
        require.ensure([], (require) => {
            cb(null, require('../components/wikiList').default)
        }, 'WikiList')
    }
}