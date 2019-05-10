/**
 * Created by Aaron on 2018/7/19.
 */
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Link} from 'react-router';
import '../../../assets/styles/home.css'
import {Glyphicon, Row, Col} from 'react-bootstrap';
import {browserHistory} from 'react-router'
import {getAllCluster, setSecondPageFilter} from "../../../actions";
import {injectIntl, intlShape, FormattedMessage} from 'react-intl';
import {Breadcrumb} from 'antd';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import {withStyles} from '@material-ui/core/styles';
import {TreeSelect} from 'antd';
const TreeNode = TreeSelect.TreeNode;
import {checkIsMobile} from "../../../utils/utils"
import YearChannleChart from "../../charts/yearChannleChart"
import RankChart from "../../charts/rankChart"
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import { Tabs } from 'antd';
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
import { Tooltip } from 'antd';
const styles = theme => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
    cardAction:{
        textAlign:"right",
        display:"block"
    },
    buttonOk:{
        textAlign:"center",
        backgroundColor: "#d45f5f",
        fontSize:'12px',
        '&:hover': {
            color: "#ffffff",
            backgroundColor: "#b93939"
        },
        color: "#ffffff",
    },
    appBar:{
        backgroundColor: "#8c1515",
    },
    buttonConfig: {
        display: "inline-block",
        color: "#a09d9d",
        border: "1px solid rgb(232, 232, 232)",
        fontSize: "12px",
        minWidth:'45px',
        marginLeft:"15px"
    },


});

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class ClusterFilter extends Component {
    static propTypes = {
        intl: intlShape.isRequired,
        onFilterSelect: PropTypes.func
    }

    constructor(props) {
        super(props);
        this.initStatu = false;
        this.state = {filterOpenMode: false, filterData: {}, divHeight: 0,charMode:false,tabKey:"1",filterDataChart:{}};

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.filterOpenMode !=this.state.filterOpenMode) {
            this.setState({filterOpenMode: nextProps.filterOpenMode});
        }
    }

    showFilterDialog() {

        this.setState({filterOpenMode: true});
    }



    startFilter() {
        this.setState({filterOpenMode:false});
        if(this.props.onClose){
            this.props.onClose();
        }

    }


    renderFilterDialog() {
        
        const {classes} =this.props;
        return <div className={this.state.filterOpenMode?"filterDialog show":"filterDialog"} style={{margin:"0"}} >


            <div>

                <Card
                    className={classes.card}>
                    <CardContent>

                        <YearChannleChart searchValue={this.props.searchValue||''} filterOpenMode={this.state.filterOpenMode}/>

                        <RankChart searchValue={this.props.searchValue||''} filterOpenMode={this.state.filterOpenMode}/>



                    </CardContent>
                    <CardActions className={classes.cardAction}>
                        <Button variant="contained" className={classes.buttonOk} onClick={()=>this.startFilter()} size="small"><FormattedMessage
                            id="Ok"/></Button>
                        <Button size="small" style={{textAlign:"center"}} onClick={()=>this.startFilter()}><FormattedMessage
                            id="CANCEL"/></Button>
                    </CardActions>
                </Card>
            </div>
        </div>
            ;
    }

    handleDialogClose = () => {
        this.setState({ filterOpenMode: false });
        this.props.onClose();
    };

    onEntered(){
        //console.log("ddddd");
        //this.renderChar(this.props.chart.clustersData.yearchannelList);
    }

    renderFilterFullDialog(){
        const {classes} =this.props;
        return <Dialog
            onEntered={()=>this.onEntered()}
            fullScreen
            open={this.state.filterOpenMode}
            onClose={()=>this.handleDialogClose()}
            TransitionComponent={Transition}
        >
            <AppBar className={classes.appBar}>
                <Toolbar>
                    <IconButton style={{marginLeft: '-15px'}} color="inherit" onClick={()=>this.handleDialogClose()} aria-label="Close">
                      <Glyphicon glyph="menu-left"/>
                    </IconButton>
                    <div><FormattedMessage
                        id="Chart Data"/></div>
                </Toolbar>

            </AppBar>

                <div style={{marginTop:'70px',padding:"2rem 0.5rem"}}>
                    <YearChannleChart dialog searchValue={this.props.searchValue||''} filterOpenMode={this.state.filterOpenMode}/>

                    <br/>

                    <RankChart dialog searchValue={this.props.searchValue||''} filterOpenMode={this.state.filterOpenMode}/>
                </div>



        </Dialog>
            ;
    }


    render() {
        const {classes}=this.props;

        return (
            <div className="animateDiv">


                {checkIsMobile()?this.renderFilterFullDialog():this.renderFilterDialog()}

                {
                //     <div className={!this.state.filterOpenMode?"filterIcon show":"filterIcon"}>
                //     <div className="clearfix">
                //     <div style={{fontSize:'1rem',float:"right"}}><Button  onClick={()=>this.setState({filterOpenMode:true})}><Glyphicon style={{color:"#8c1515",fontSize:'1rem'}} glyph="stats"/>&nbsp;
                //         <span style={{color:"#8c1515",fontSize:'1rem'}}><FormattedMessage
                //         id="Chart Data"/></span></Button></div>
                //         </div>
                // </div>
                }
                {
                //     <div className={!this.state.filterOpenMode?"filterIcon show":"filterIcon"}><Tooltip title={<FormattedMessage id="Chart Data"/>} placement="bottom"> <Button
                //     className={classes.buttonConfig}
                //     onClick={()=>this.setState({filterOpenMode:true})}
                //     variant="outlined" size="small">
                //     <i className="glyphicon glyphicon-stats"> </i>
                // </Button>
                // </Tooltip>
                //     </div>
                }
            </div>

        )
    }
}

const mapStateToProps = (state, props) => {

    return {
        routing: state.routing,
        userInfos: state.userInfos,
        filter: state.filter,
        personality:state.personality,
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {


    }
}


export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(withStyles(styles)(ClusterFilter)));
