/**
 * Created by Aaron on 2018/8/30.
 */
module.exports = {
    path: '/wiki/:wikiId',

    getComponent(nextState, cb) {
        require.ensure([], (require) => {
            cb(null, require('../components/wiki').default)
        }, 'Wiki')
    }
}