/**
 * Created by Aaron on 2018/8/30.
 */

module.exports = {
    path: 'toolPages',

    indexRoute: {
        getComponent(nextState, cb) {
            require.ensure([], (require) => {
                cb(null, require('../components/toolPages').default)
            }, 'toolPages')
        },
    },
    childRoutes: [
        require('./tools/geoMap'),
        require('./tools/gisMap'),
        require('./tools/3dFilter'),
        require('./tools/wordCloud'),
        require('./tools/similarText'),
        require('./tools/similarWord'),
        require('./tools/keyWords'),
        require('./tools/wordTag'),
        require('./tools/ngram')


    ]
}