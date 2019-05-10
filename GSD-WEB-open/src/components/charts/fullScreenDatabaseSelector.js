/**
 * Created by Aaron on 2018/7/18.
 */
/**
 * Created by Aaron on 2018/7/17.
 */
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Link} from 'react-router';

import {Glyphicon, Row, Col} from 'react-bootstrap';
import {browserHistory} from 'react-router'
import {getClusterData} from "../../actions";
import {injectIntl, intlShape, FormattedMessage} from 'react-intl';
import {withStyles} from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
import IconButton from '@material-ui/core/IconButton';
import {Tooltip} from 'antd';
import {PreImage} from '../plugins'
import Button from '@material-ui/core/Button';

const databaseList=[

    {src:"/sourceImages/data_02.gif",label:<FormattedMessage
        id="biogref_cbdb"
    />,link:"http://120.92.71.195/index.php?title=%E4%B8%AD%E5%9C%8B%E6%AD%B7%E4%BB%A3%E4%BA%BA%E7%89%A9%E5%82%B3%E8%A8%98%E8%B3%87%E6%96%99"},
    {src:"/sourceImages/dnb_icon.png",label:<FormattedMessage
        id="biogref_dnb"
    />,link:"http://120.92.71.195/index.php?title=%E4%BA%BA%E7%89%A9%E5%82%B3%E8%A8%98%E8%B3%87%E6%96%99%E5%BA%AB",enabled:true},
    {src:"/sourceImages/cbta_icon.png",label:<FormattedMessage
        id="textref_cbta"
    />,link:"http://120.92.71.195/index.php?title=%E4%B8%AD%E5%8D%8E%E7%94%B5%E5%AD%90%E4%BD%9B%E5%85%B8%E5%8D%8F%E4%BC%9A"},
    {src:"/sourceImages/data_03.gif",label:<FormattedMessage
        id="textref_ctext"
    />,link:"http://120.92.71.195/index.php?title=%E4%B8%AD%E5%9C%8B%E5%93%B2%E5%AD%B8%E6%9B%B8%E9%9B%BB%E5%AD%90%E5%8C%96%E8%A8%88%E5%8A%83"},
    {src:"/sourceImages/data_09.gif",label:<FormattedMessage
        id="biogref_ddbc"
    />,link:"http://120.92.71.195/index.php?title=%E4%BD%9B%E5%AD%B8%E8%B3%87%E6%96%99%E8%A6%8F%E7%AF%84%E5%BA%AB"},
    {src:"/sourceImages/textref_kanripo_icon.png",label:<FormattedMessage
        id="textref_kanripo"
    />,link:"http://120.92.71.195/index.php?title=Kanseki_Repository"},
    {src:"/sourceImages/textref_zhonghuajingdian_logo.png",label:<FormattedMessage
        id="textref_zhonghuajingdian"
    />,link:"http://120.92.71.195/index.php?title=%E4%B8%AD%E5%8D%8E%E7%BB%8F%E5%85%B8%E5%8F%A4%E7%B1%8D%E5%BA%93%E6%8C%87%E5%8D%97"},


    {src:"/sourceImages/data_07.gif",label:<FormattedMessage
        id="CHAOXING_LIB"
    />,link:"/wiki/2008007"},
    {src:"/sourceImages/data_05.gif",label:<FormattedMessage
        id="CHAOXING_MAGAZINE"
    />,link:"http://120.92.71.195/index.php?title=%E8%B6%85%E6%98%9F%E6%9C%9F%E5%88%8A"},
];
const styles = theme => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
    cardAction: {
        textAlign: "right",
        display: "block"
    },
    buttonFullScreen: {
        display: "inline-block",
        color: "#a09d9d",
        border: "0",
        fontSize: "12px",
        minWidth: '25px',
        minHeight: '20px',
        textAlign: "center"
    },
    appBar: {
        position: 'relative',
        background: "#ffffff",
        minHeight: "50px",
        boxShadow: "none",
        boxShadow: "0 3px 6px rgba(6,0,1,.05)"
    },
    appBarRoot: {
        minHeight: "50px!important"
    },
    dialogBg: {
        backgroundColor: "#f2f2f5"
    },
    closeBtn: {
        width: "35px",
        height: "35px",
        marginTop: "6px",
        "&:hover": {}
    },
    menuBtn: {
        width: "35px",
        height: "35px",
        marginTop: "6px",
        "&:hover": {}
    }, allDataBtn: {

        fontSize: '13px',
        textAlign: "center",
        display: "inline-block",
        width:"90%",
        margin: "0 auto",
        border:"solid 1px #ffcbcb",
        marginTop:'30px',
        color:"#b93939",
        backgroundColor: "#ffffff",
        '&:hover': {
            backgroundColor: "#b93939",
            color:"#ffffff",
            border:"solid 1px #d45f5f",
        },
    }, partDataBtn: {
        width:"90%",
        margin: "0 auto",
        fontSize: '13px',
        marginTop:'15px',
        textAlign: "center",
        display: "inline-block",
        border:"solid 1px #d45f5f",
        color:"#b93939",
        backgroundColor: "#ffffff",
        '&:hover': {
            backgroundColor: "#b93939",
            color:"#ffffff",
            border:"solid 1px #d45f5f",
        },
    }


});


class FullScreenDatabaseSelector extends Component {
    static propTypes = {
        intl: intlShape.isRequired,
        open: PropTypes.bool

    }

    constructor(props) {
        super(props);

        this.searchValue;
        this.state = {yearchannelList: [],selectedItem:[], initFlag: false, fullScreenState: false,listMode:false, drawerOpen: false, noData: false};

    }

    componentDidMount() {
        if(window.history && window.history.pushState){
            window.addEventListener("popstate", function(){
              
            })
        }

    }

    handleClose = () => {
        if (!!this.props.handleClose) {
            this.props.handleClose()
        }
    };



    onEntered() {

    }

    showDataList(){

    }
    setAllData(item){
        if(!!this.props.setAllData){
            this.props.setAllData(item);
        }
    }

    Transition(props) {
        return <Slide direction="up" {...props} />;
    }

    render() {

        const {classes}=this.props;

        return (
            <Dialog
                fullScreen
                disableEscapeKeyDown={true}
                open={this.props.open}
                onClose={this.handleClose}
                className={classes.dialogBg}
                onEntered={()=>this.onEntered()}
                TransitionComponent={this.Transition}
            >

                <div>
                    <nav className="navbar navbar-default"
                         style={{backgroundColor:"#ffffff",boxShadow: "0 3px 6px rgba(6,0,1,.05)"}}>
                        <div style={{width:"100%",padding:"0 20px"}}>

                            <IconButton className={classes.closeBtn} onClick={this.handleClose} aria-label="Close">
                                <i className="glyphicon glyphicon-resize-small"></i>
                            </IconButton>

                        </div>
                    </nav>
                    


                    <div style={{padding:"40px",textAlign:"center"}}>
                        <h4 style={{textAlign:'left'}}><i className="fa fa-folder"></i>&nbsp;<FormattedMessage id="Select Db"/></h4>
                        <div className="row">
                            {databaseList.map((item,index)=><Tooltip  key={`tip_${index}`} title={item.label}  placement="bottom">
                                <div    key={`key_${item.label}`} className="col-sm-2" style={{margin:"1rem 0"}}>
                                    
                                    {!item.enabled&&<div className="disable-mask"><div className="disable-mask-wrapper"><span className="text"><FormattedMessage id="GIS NOT SUPPORT"/></span></div></div>}

                                    <div  className={item.enabled?"data-icons db-disabled":"data-icons"} style={{cursor:'pointer'}}>

                                        <div className="hover-mask"><div className="hover-mask-wrapper">
                                            <Button onClick={()=>this.setAllData(item)} variant="contained"
                                                    color="primary" className={classes.allDataBtn}>
                                                <FormattedMessage id="Select All Data"/>
                                            </Button>


                                            <Button disabled  variant="contained"
                                                    color="primary" className={classes.partDataBtn}>
                                                <FormattedMessage id="Part Data"/>
                                            </Button>



                                        </div></div>


                                        <Tooltip  title="wiki"  placement="bottom"><a className="wikiLink" href={item.link} target="_blank"><i className="fa fa-question-circle"></i></a>
                                            </Tooltip>
                                        <div ><PreImage  width="100%" height="100%" src={item.src}/></div>
                                        <div  className="dataLabel">    <a style={{color:"#666666",fontSize:"1rem"}} href={item.link} target="_blank"> <span>{item.label}</span>  </a></div>
                                    </div>

                                </div>
                            </Tooltip>)}
                        </div>



                    </div>

                </div>

            </Dialog>

        )
    }
}

const mapStateToProps = (state, props) => {

    return {
        routing: state.routing,
        userInfos: state.userInfos,
        chart: state.chart
    }
}


export default connect(mapStateToProps)(injectIntl(withStyles(styles)(FullScreenDatabaseSelector)));
