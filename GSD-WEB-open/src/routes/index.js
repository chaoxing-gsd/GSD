/**
 * Created by Aaron on 2018/6/20.
 */
import React from 'react'
import {Route, IndexRoute, Redirect} from 'react-router'
// import App from '../containers/app'
// import Home from '../components/home'
// import Login from '../components/sys/login'
// import Register from '../components/sys/register'
// import SearchResult from '../components/result'
// import SecondResult from '../components/secondResult'
// import IframeContainer from "../components/plugins/IframeContainer"
// import wiki from "../components/wiki"
// import wikiList from "../components/wikiList"
// import NotFoundPage from "../components/NotFoundPage"
// import HistoryPage from "../components/history"
// import AnalysePage from "../components/history/analyse"
// import AuthLoginSuccess from "../components/AuthLoginSuccess"
// import MyIndexs from "../components/myIndexs"
// import MyNotes from "../components/myNotes"
// import EditNotes from "../components/myNotes/edit"
// import MyProfile from "../components/MyProfile"
// import EditIndexs from "../components/myIndexs/edit"
// import GISMap from "../components/charts/GISMap"
//
// import requireAuthentication from "../components/sys/requireAuthentication"

// const history  = (location, cb) => {
//         require.ensure([], require => {
//                 cb(null, require('components/Index').default);
//         }, 'index');
// };


// const RouteConfig = (
//     <Route path="/" component={App}>
//         <IndexRoute component={Home}/>
//         <Route path="/login" component={Login}/>
//         <Route path="/register" component={Register}/>
//         <Route path="/search" component={SearchResult}/>
//         <Route path="/wiki/:wikiId" component={wiki}/>
//         <Route path="/wikiList" component={wikiList}/>
//         <Route path="/ssearch" component={SecondResult}/>
//         <Route path="/history" component={requireAuthentication(HistoryPage)}/>
//         <Route path="/analyse" component={requireAuthentication(AnalysePage)}/>
//         <Route path="/myNotes" component={requireAuthentication(MyNotes)}/>
//         <Route path="/editMyNotes" component={requireAuthentication(EditNotes)}/>
//         <Route path="/myIndexs" component={requireAuthentication(MyIndexs)}/>
//         <Route path="/editMyIndexs" component={requireAuthentication(EditIndexs)}/>
//             <Route path="/gisMap" component={requireAuthentication(GISMap)}/>
//
//         <Route path="/search" component={SearchResult}>
//         </Route>
//         <Route path='/404' component={NotFoundPage}/>
//         <Route path='/myProfile' component={MyProfile}/>
//         <Route path="/authLoginSuccess" component={AuthLoginSuccess}/>
//         <Redirect from='*' to='/404'/>
//
//     </Route>
//
// )

const RouteConfig = {
        path: '/',
        indexRoute: {
                getComponent(nextState, cb) {
                        require.ensure([], (require) => {
                                cb(null, require('../components/home').default)
                        }, 'Home')
                },
        },
        getComponent(nextState, cb) {
                require.ensure([], (require) => {
                        cb(null, require('../containers/app').default)
                }, 'App')
        },
        childRoutes: [
                require('./sys/login'),
                require('./sys/contact'),
                require('./sys/register'),
                require('./searchResult/search'),
                require('./wiki'),
                require('./toolPage'),
                require('./wikiList'),
                // require('./gsdTools'),
                require('./searchResult/ssearch'),
                require('./history'),
                require('./analyse'),
                require('./mySource/mySource'),
                require('./searchResult/compare'),
                require('./sys/myEmails'),
                require('./myIndex/myIndexs'),
                require('./myLiterature/myLiterature'),
                require('./myIndex/editMyIndex'),
                require('./notes/myNotes'),
                require('./notes/editMyNotes'),
                require('./sys/addNewDb'),
                // require('./tools/geoMap'),
                require('./tools/gisMap'),
                require('./sys/myProfile'),                
                require('./sys/authLoginSuccess'),
                require('./personal/personal'),
                require('./personal/personalEdit'),
                {path: '*', component: require('../components/NotFoundPage').default}

        ]
}



export default RouteConfig

