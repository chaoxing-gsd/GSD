import React from 'react'
import PropTypes from 'prop-types'
import {Provider} from 'react-redux'
import routes from '../routes'
import DevTools from './devTools'
import {connect} from 'react-redux'
import {Router} from 'react-router'
import {IntlProvider, addLocaleData} from 'react-intl';
import {getUserLanguage} from '../utils/utils';
import {setUserInfos} from '../actions'
import en from '../../public/languages/en.json'
import zh from '../../public/languages/zh.json'

const languages={
    en:en,
    zh:zh
};



//react-intl自带的配置文件
import enLocaleData from 'react-intl/locale-data/en'
import zhLocaleData from 'react-intl/locale-data/zh'
addLocaleData(enLocaleData) //注册区域设置数据
addLocaleData(zhLocaleData) //注册区域设置数据






const Root = ({store, history}) => {




    /**
     *language setting
     */
    var locale=store.getState().userInfos.language||'auto';
    if(locale=='auto'){
        var lang=navigator.language;
        var locale = "en";
        if (lang === "zh" ||lang === "zh-CN"||lang==="zh-TW") {
            locale = "zh";
        }
    }

    return (
    <IntlProvider locale={locale} messages={languages[locale]}>
        <Provider store={store}>
            <div>
                <Router history={history} routes={routes} onUpdate={() => window.scrollTo(0, 0)}/>
                {
                    //<DevTools />
                }
            </div>
        </Provider>
    </IntlProvider>
)}

Root.propTypes = {
    store: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
}


const mapStateToProps = (state, props) => {

    return {
        userInfos:state.userInfos
    }
}



export default connect(mapStateToProps)(Root);


