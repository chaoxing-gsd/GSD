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
import Button from '@material-ui/core/Button';


const styles = theme => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
    cardAction: {
        textAlign: "right",
        display: "block"
    },
    buttonOk: {
        backgroundColor: "#8c1515",
        fontSize: '12px',
        '&:hover': {
            color: "#ffffff",
            backgroundColor: "#b93939"
        },
        color: "#ffffff",
    },  buttonToggle:{
        display: "inline-block",
        color: "#a09d9d",
        border: "0",
        fontSize: "12px",
        minWidth:'25px',
        minHeight:'20px',
        textAlign:"center",
        marginTop:'-5px',
        float:'right'
    },buttonToggleShow:{
        display: "block",
        color: "#868585",
        border: "0",
        height: "50px",
        fontSize: "1.1rem",
        backgroundColor: "#ffffff",
        width:"100%",
        textAlign:"center"
    }


});


class FilterScatter extends Component {
    static propTypes = {
        intl: intlShape.isRequired,
        onFilterSelect: PropTypes.func,
        dialog:PropTypes.bool
    }

    constructor(props) {
        super(props);

        this.searchValue;
        this.state = {keywordList: [], initFlag: false,toggleState:false};

    }

    componentDidMount() {


    }

   createRandomItemStyle() {
    return {
        normal: {
            color: 'rgb(' + [
                Math.round(Math.random() * 160),
                Math.round(Math.random() * 160),
                Math.round(Math.random() * 160)
            ].join(',') + ')'
        }
    };
}
    componentWillReceiveProps(nextProps) {

    }




    render() {

        const {classes}=this.props;

        const keywordListChartAccessing = this.props.chart.pageInfos.keywordListChartAccessing;



        return (
            <div>
                <div><h4 style={{fontSize:"1.1rem",color:"rgb(135, 134, 134)"}}>{this.props.intl.formatMessage({id: 'Text_Tool'})}
                    <Button
                        className={classes.buttonToggle}
                        variant="outlined" size="small" onClick={()=>this.setState({toggleState:!this.state.toggleState})}>
                        <i className={this.state.toggleState?"glyphicon glyphicon-menu-down":"glyphicon glyphicon-menu-up"}></i>
                    </Button>


                </h4></div>

                <div className={this.state.toggleState?"toolDiv":"toolDiv visible"}>
                    <a href="/toolPages/wordCloud" target="_blank">
                    <img src="/sourceImages/word_cloud.png" style={{width:"100%"}}/>
                        </a>
                      </div>
            </div>

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


const mapDispatchToProps = (dispatch, props) => {
    return {
        getClusterData: (searchValue,clusterName="keywordList") => dispatch(getClusterData(searchValue,clusterName))


    }
}


export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(withStyles(styles)(FilterScatter)));
