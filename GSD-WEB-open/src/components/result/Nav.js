/**
 * Created by Aaron on 2018/7/2.
 */
import React, {Component} from 'react'
import PropTypes from 'prop-types'

import {Navbar, NavItem, Nav} from 'react-bootstrap';
import { withStyles } from '@material-ui/core/styles';
import SwipeableViews from 'react-swipeable-views';
import {injectIntl, intlShape, FormattedMessage} from 'react-intl';
import {connect} from 'react-redux'
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Personality from "../personality";
import ResultList from './ResultList';
import TopTools from './topTools'
import Button from '@material-ui/core/Button';
import {getUserResultTabIndex,setUserResultTabIndex} from "../../utils/utils"
import green from '@material-ui/core/colors/green';
const menus=[
    {name:<FormattedMessage
        id="MENU_ALL"
    />},
    {name:<FormattedMessage
        id="MENU_02"
    />},
    // {name:<FormattedMessage
    //     id="MENU_03"
    // />},
    // {name:<FormattedMessage
    //     id="MyIndex"
    // />},
    // {name:<FormattedMessage
    //     id="Search Library"
    // />}
];

const styles = theme => ({
    tabsRoot: {
        borderBottom: '1px solid #e8e8e8',
    },
    tabsIndicator: {
        backgroundColor: 'rgb(212, 95, 95)',
        height: '2px'
    },
    root: {
        backgroundColor: theme.palette.background.paper,
        width: 500,
    },
    buttonToLogin:{
        fontSize:'14px',
        color:"#ffffff",
        display:"inline-block",
        margin:"0 auto",
        backgroundColor: '#d45f5f',
        '&:hover': {
            backgroundColor: "#d44b4b",
            color:"#ffffff"
        },
    },
    flexContainer:{
      paddingLeft:'20px'
    },
    // tabRoot:{
    //
    //     '&$tabSelected': {
    //         color: 'rgb(140, 21, 21)',
    //         fontWeight: 'bold',
    //     },
    // },
    tabLabel:{
        fontSize:'14px',
    },
    // tabSelected:{
    //
    //     color:"rgb(140, 21, 21)"
    // },
    // root: {
    //     flexGrow: 1,
    //     backgroundColor: theme.palette.background.paper,
    // },
    // tabsRoot: {
    //     borderBottom: '1px solid #e8e8e8',
    // },
    // tabsIndicator: {
    //     backgroundColor: '#1890ff',
    // },
    tabRoot: {
        textTransform: 'initial',
        minWidth: 72,
        fontWeight: theme.typography.fontWeightRegular,
        marginRight: theme.spacing.unit * 4,
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        '&:hover': {
            color: 'rgb(212, 95, 95)',
            opacity: 1,
        },
        '&$tabSelected': {
            color: 'rgb(212, 95, 95)',
            fontWeight: theme.typography.fontWeightMedium,
        },
        '&:focus': {
            color: 'rgb(212, 95, 95)',
        },
    },
    tabSelected: {color:"rgb(140, 21, 21)"},
    typography: {
        padding: theme.spacing.unit * 3,
    },
});


class TabContainer extends Component {
    static propTypes = {
        children: PropTypes.node.isRequired,
        dir: PropTypes.string.isRequired,
    }
    render() {
        const { dir, children } = this.props;
        return (
            <Typography component="div" dir={dir} style={{ padding: 0,marginTop:'15px' }}>
                {children}
            </Typography>
        );
    }
}

class NavTab extends Component {
    static propTypes = {
        wrapperStyle: PropTypes.object,
        intl: intlShape.isRequired,
        classes: PropTypes.object.isRequired,
        theme: PropTypes.object.isRequired,
        onChange:PropTypes.func

    }



    componentDidMount() {
        if(!!this.props.userInfos.responseUserInfo&&!!this.props.userInfos.responseUserInfo.userid){
            this.setState({isLogined:true});
        }
    }

    componentWillReceiveProps(nextProps) {

       if(!!nextProps.userInfos.responseUserInfo&&!!nextProps.userInfos.responseUserInfo.userid){
           this.setState({isLogined:true});
       }
    }

    handleChange = (event, tabIndex) => {
        var obj=this.state.tabInit;
        obj[tabIndex+""]=true;
        setUserResultTabIndex(tabIndex);
        this.setState({ tabIndex ,tabInit:obj});
        if(!!this.props.onChange)this.props.onChange(tabIndex,menus[tabIndex]);
        console.log(this.state);
    };

    handleChangeIndex = tabIndex => {
        //this.setState({ tabIndex: tabIndex,tabInit:{...this.state.tabInit,tabIndex:true} });
        var obj=this.state.tabInit;
        obj[tabIndex+""]=true;
        setUserResultTabIndex(tabIndex);
        this.setState({ tabIndex ,tabInit:obj});
        if(!!this.props.onChange)this.props.onChange(tabIndex,menus[tabIndex]);
        console.log(this.state);
    };

    constructor(props) {
        super(props);
        var currentIndex=getUserResultTabIndex();
        var obj={};
        obj[currentIndex+""]=true;
        this.state = {tabIndex: currentIndex,tabInit:obj,isLogined:false};

    }


    render() {


        const { classes, theme } = this.props;
        var b = new Buffer(window.location.href);
        var s = b.toString('base64');

        return (
            <div className="main-page">

                <Tabs
                    classes={{ root: classes.tabsRoot, indicator: classes.tabsIndicator,flexContainer:classes.flexContainer }}
                    value={this.state.tabIndex}
                    onChange={(e,value)=>this.handleChange(e,value)}
                    indicatorColor="primary"
                    textColor="primary"
                >
                    {
                        menus.map((item,i)=>{
                        return    <Tab key={i} classes={{root: classes.tabRoot, selected: classes.tabSelected,label:classes.tabLabel }} label={item.name} />
                    })
                    }

                </Tabs>
                <TopTools location={this.props.location} tabIndex={this.state.tabIndex} style={{marginTop:"20px"}}/>
                <SwipeableViews
                    axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                    index={this.state.tabIndex}
                    onChangeIndex={(i)=>this.handleChangeIndex(i)}
                >
                    <TabContainer dir={theme.direction}>
                        {
                            //<ClusterFilter searchValue={this.props.location.query.searchValue||''}/>
                        }
                        {

                        !!this.state.tabInit["0"]&&<div style={{background: "#f2f2f5"}}><ResultList clusterMode={true} /></div>

                          //<IframeContainer src={`http://ss.chaoxing.com/search?sw=${this.props.location.query.searchValue||''}&x=0_9324`}/>
                    }</TabContainer>
                    <TabContainer dir={theme.direction}>
                        <div style={{background:"#f2f2f5"}}>{!!this.state.tabInit["1"]&&<Personality/>}</div></TabContainer>


                    {

                    // <TabContainer dir={theme.direction}><div style={{padding:"0 30px 30px 30px"}}>  {
                    //
                    //     !!this.state.tabInit["2"]&&this.state.isLogined&&<ResultList clusterMode={false} queryType={3} libIds={[{id:"webpage",type:"3"}]}/>
                    //
                    // }
                    //     {
                    //         !!this.state.tabInit["2"]&&!this.state.isLogined&&<div>
                    //             <h4 style={{textAlign:'center'}}><FormattedMessage id="NEED_LOGIN"/></h4>
                    //            <div style={{textAlign:"center"}}> <Button  className={classes.buttonToLogin} variant="contained" component="a" href={`/login?originalUrl=${s}`}
                    //                                                                         size="small"><FormattedMessage id="LOGIN"/></Button></div></div>
                    //     }
                    // </div></TabContainer>
                    }
                    {
                        // <TabContainer dir={theme.direction}>
                        //     <div>
                        //         {
                        //
                        //             //!!this.state.tabInit["3"]&&<ResultList clusterMode={false} queryType={4} libIds={[{id:"BK",type:"0"}]}/>
                        //             !!this.state.tabInit["3"] &&
                        //             <h4 style={{textAlign:"center",padding:"40px 0"}}><FormattedMessage
                        //                 id="IsDeveloping"/></h4>
                        //         }</div>
                        // </TabContainer>
                    }
                </SwipeableViews>
            </div>

        );
    }
}

const mapStateToProps = (state, props) => {

    return {
        userInfos:state.userInfos
    }
}




export default connect(mapStateToProps)(injectIntl(withStyles(styles, { withTheme: true })(NavTab)));
