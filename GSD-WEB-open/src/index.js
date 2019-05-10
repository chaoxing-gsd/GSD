
import React from 'react'
import { render } from 'react-dom'
import { browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import Root from './containers/root'
import configureStore from './store/configureStore'
import {addPrototype} from './config/array';
import './assets/styles/home.css'
import './assets/styles/app.css'
import './assets/styles/plugins.css'
import 'antd/dist/antd.css'
global.Intl = require('react-intl');
const store = configureStore()
const history = syncHistoryWithStore(browserHistory, store)
addPrototype()



const documentListener = ()=>{
    render(
        <Root store={store} history={history} />,
        document.getElementById('root')
    )
    // if (document.readyState == 'complete') { // 资源加载完成
    //     render(
    //         <Root store={store} history={history} />,
    //         document.getElementById('root')
    //     )
    // }else{
    //     render(
    //         <div>加载中</div>,
    //         document.getElementById('root')
    //     )
    // }

}

document.onreadystatechange = documentListener