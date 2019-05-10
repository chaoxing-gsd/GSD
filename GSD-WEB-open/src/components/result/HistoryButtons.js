/**
 * Created by Aaron on 2018/7/22.
 */
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Link} from 'react-router';

import {browserHistory} from 'react-router'
import {getSearchResult,ifSearched} from "../../actions";
import {injectIntl, intlShape, FormattedMessage} from 'react-intl';
import {withStyles} from '@material-ui/core/styles';


import Button from '@material-ui/core/Button';


const styles = theme => ({
    historyBtn: {
        color: "#ffffff",
        fontSize: '0.9rem'
    },
    historyDrawerBtn: {
        fontSize:'12px',
        backgroundColor: "#8c1515",
        '&:hover': {
            color: "#ffffff",
            backgroundColor: "#5f1212"
        },
        color: "#484848",
        backgroundColor: "#ffffff"
    },
});

class HistoryButtons extends Component {
    static propTypes = {
        intl: intlShape.isRequired,
        classes: PropTypes.object.isRequired,
        drawerStyle:PropTypes.boolean
    }

    constructor(props) {
        super(props);
        this.state = {};
        this.searchValue;
        this.userId;

    }

    toHistoryPage() {
        browserHistory.push("/myProfile?tabIndex=4");
    }

    toAnalysizePage(){
        browserHistory.push("/analyse?searchValue="+this.searchValue);
    }

    renderHistroyComponent() {
        const {classes}=this.props;
        if(!!this.props.drawerStyle){
            return <div><Button variant="contained" size="small" color="default" onClick={()=>this.toHistoryPage()}
                                                              className={classes.historyDrawerBtn}>
                <FormattedMessage id="Search History"/>
            </Button>
            </div>;
        }else{
            return <div  className="search-area-btns"><Button onClick={()=>this.toHistoryPage()}
                                                              className={classes.historyBtn}>
                <FormattedMessage id="Search History"/>
            </Button>
            </div>;
        }

    }

    componentWillReceiveProps(nextProps) {

        //
        // if(nextProps.searchValue!=this.searchValue||nextProps.userInfos.responseUserInfo.userid!=this.userId){
        //
        //     this.searchValue=nextProps.searchValue;
        //     this.userId=nextProps.userInfos.responseUserInfo.userid;
        //     this.props.ifSearched(nextProps.userInfos.responseUserInfo.userid, nextProps.searchValue);
        //
        // }
    }

    componentDidMount() {

        // if (this.props.userInfos.isLogined) {
        //     this.searchValue=this.props.searchValue;
        //     this.userId=this.props.userInfos.responseUserInfo.userid;
        //     this.props.ifSearched(this.props.userInfos.responseUserInfo.userid, this.props.searchValue);
        // }
    }


    render() {

        return this.props.userInfos.isLogined ? this.renderHistroyComponent() : null;
    }
}

const mapStateToProps = (state, props) => {

    return {
        routing: state.routing,
        userInfos: state.userInfos,
        historyData:state.historyData
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        getSearchResult: (searchTitle, ids) => dispatch(getSearchResult(searchTitle, ids)),
        ifSearched: (userId, searchValue)=>dispatch(ifSearched(userId, searchValue)),


    }
}


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(injectIntl(HistoryButtons)));
