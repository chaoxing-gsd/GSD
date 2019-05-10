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
import {getBaiKeData} from "../../actions";
import {injectIntl, intlShape, FormattedMessage} from 'react-intl';
import {withStyles} from '@material-ui/core/styles';

import CircularProgress from '@material-ui/core/CircularProgress';



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
    },


});


class BaiKe extends Component {
    static propTypes = {
        intl: intlShape.isRequired,
        onFilterSelect: PropTypes.func
    }

    constructor(props) {
        super(props);

        this.state = {yearchannelList: [], initFlag: false};

    }

    componentDidMount() {
       // this.props.getBaiKeData("南京");
    }

    componentWillReceiveProps(nextProps) {

    }




    render() {

        const {classes}=this.props;

        const isAccessing = this.props.chart.pageInfos.isAccessing;

        console.log(isAccessing);

        return (
            <div>
                {isAccessing &&
                <div style={{margin:"10px auto",textAlign:"center"}}><CircularProgress color="secondary"/></div>}
                {<div style={{height:isAccessing?"0":"auto",overflow:isAccessing?"hidden":"auto"}}><h4>{this.props.intl.formatMessage({id: 'DATAS_LINE'})}</h4> <div id="yearChannel" style={{ width: "100%", minHeight: 340,margin:'0 auto'}}></div></div>}
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
        getBaiKeData: (searchValue) => dispatch(getBaiKeData(searchValue))


    }
}


export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(withStyles(styles)(BaiKe)));
