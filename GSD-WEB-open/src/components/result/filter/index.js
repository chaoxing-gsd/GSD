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
import Typography from '@material-ui/core/Typography';
import {TreeSelect} from 'antd';
const TreeNode = TreeSelect.TreeNode;
import CircularProgress from '@material-ui/core/CircularProgress';
import {getResourceLink, buildBaseArgument, buildClusters, buildChannels,FILTER_LABELS} from "../../../utils/utils"
import FilterCharts from './filterCharts';

import { Tabs } from 'antd';
const TabPane = Tabs.TabPane;

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
        backgroundColor: "#d45f5f",
        textAlign:"center",
        display: "inline-block",
        fontSize:'12px',
        '&:hover': {
            color: "#ffffff",
            backgroundColor: "#b93939"
        },
        color: "#ffffff",
    },


});


class FilterComp extends Component {
    static propTypes = {
        intl: intlShape.isRequired,
        onFilterSelect: PropTypes.func
    }

    constructor(props) {
        super(props);
        this.initStatu = false;
        this.state = {filterOpenMode: false, filterData: {}, divHeight: 0,charMode:false,tabKey:"1",filterDataChart:{}};

    }

    showFilterDialog() {
        if (!this.initStatu) {
            this.initStatu = true;
            const argument = buildBaseArgument(this.props.location.query.searchValue, this.props.location.query.channel, this.props.location.query.type);
            this.props.getAllCluster(argument);

        }
        this.setState({filterOpenMode: true});
    }


    onTreeChange = (classes, value) => {
        var filterData = this.state.filterData;
        filterData[classes] = value;
        this.setState({filterData});
    }


    startFilter() {
        if(this.state.tabKey=="2"){
            this.setState({filterOpenMode:false});
            this.props.setSecondPageFilter(this.state.filterDataChart);
        }else{
            this.setState({filterOpenMode:false});
            this.props.setSecondPageFilter(this.state.filterData);
        }
       

    }


    renderFilterDialog() {
        //
        const {classes}=this.props;
   
    

        const clusterData = this.props.filter.clusters;
        const clusterKey = Object.keys(clusterData);
        var conditions = [];
        if (clusterKey.length > 0) {
            conditions = clusterKey.reduce((arr, key, index)=> {

               if(!FILTER_LABELS[key])return arr;
                var typeName = this.props.intl.formatMessage({id: "TYPE_NAME_"+key});
                var itemList = clusterData[key];
                if (itemList.length > 0)arr.push(<Col  key={key} xs={6} sm={6}><div style={{padding:'0.5em 0'}}><TreeSelect
                    showSearch
                    treeCheckable={true}
                    showCheckedStrategy={TreeSelect.SHOW_PARENT}
                    style={{ width: '100%' }}
                    value={this.state.filterData[key]}
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    placeholder={<FormattedMessage
            id='PLEASE_SELECT'
            values={{
        typeName: typeName
    }}
        />}
                    allowClear={true}
                    multiple

                    treeDefaultExpandAll={false}
                    onChange={(value)=>this.onTreeChange(key, value)}
                >{
                    (()=> {
                        return (itemList || []).reduce((farr, fitem, findex)=> {
                            var hasLeaf = !!fitem.secondmenu && fitem.secondmenu.length > 0;
                            farr.push(<TreeNode value={fitem.label} title={fitem.label+"("+fitem.count+")"}
                                                key={fitem.id}>

                                {hasLeaf && (()=> {
                                    return (fitem.secondmenu || []).reduce((sarr, sitem, sindex)=> {

                                        sarr.push(<TreeNode value={sitem.id} title={sitem.name+"("+sitem.count+")"}
                                                            key={sitem.id}/>)
                                        return sarr;
                                    }, []);

                                })()}

                            </TreeNode>)
                            return farr;

                        }, [])
                    })()
                }

                </TreeSelect></div></Col>);

                return arr;

            }, []);
        }

        var isAccessing=this.props.filter.pageInfos.isAccessing;
        console.log(isAccessing);
        //const clientHeight=this.filterArea?this.filterArea.clientHeight:0;
        return <div className={this.state.filterOpenMode?"filterDialog show":"filterDialog"} style={{margin:"20px 0"}} ref={(filterArea)=>this.filterArea=filterArea}>
            <div className={isAccessing?"filterLoading":"filterLoading hide"}><Card className={classes.card}>
                <CardContent><div style={{margin:"10px auto",textAlign:"center"}}><CircularProgress color="secondary" /></div>
                </CardContent>
            </Card>
            </div>
            
            <div className={isAccessing?"filterArea animateDiv":"filterArea animateDiv show"}>
            
            <Card
            className={classes.card}>
            <CardContent>
                <Tabs defaultActiveKey="1" onChange={(key)=>this.setState({tabKey:key})}>
                    <TabPane tab={<FormattedMessage
                    id="Conditions filter"/>} key="1">
                        <Row>
                            {conditions}
                        </Row>
                    </TabPane>
                    <TabPane tab={<FormattedMessage
                    id="Chart Filter"/>} key="2">
                        <FilterCharts onFilterChange={(filterDataChart)=>this.setState({filterDataChart})}/>
                    </TabPane>

                </Tabs>






            </CardContent>
            <CardActions className={classes.cardAction}>
                <Button variant="contained" className={classes.buttonOk} onClick={()=>this.startFilter()} size="small"><FormattedMessage
                    id="Ok"/></Button>
                <Button size="small" style={{textAlign:"center",display:'inline-block'}} onClick={()=>this.setState({filterOpenMode:false})}><FormattedMessage
                    id="CANCEL"/></Button>
            </CardActions>
        </Card>
                </div>
        </div>
        ;
    }


    render() {



        return (
            <div className="animateDiv">


                {this.renderFilterDialog()}

                {<div className={!this.state.filterOpenMode?"filterIcon show":"filterIcon"}><Button onClick={()=>this.showFilterDialog()}
                                                            style={{position: "absolute",right: "35px",top:"50px",textAlign:"center",display:"inline-block",boxShadow:'none'}}
                                                            variant="fab" mini color="secondary">
                    <Glyphicon glyph="filter"  style={{textAlign:'center'}}/>
                </Button></div>}
            </div>

        )
    }
}

const mapStateToProps = (state, props) => {

    return {
        routing: state.routing,
        userInfos: state.userInfos,
        filter: state.filter
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        getAllCluster: (argument)=>dispatch(getAllCluster(argument)),
        setSecondPageFilter: (data)=>dispatch(setSecondPageFilter(data))

    }
}


export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(withStyles(styles)(FilterComp)));
