/**
 * Created by Aaron on 2018/8/8.
 */
import React, {Component} from 'react'
import {Glyphicon} from 'react-bootstrap';
import {connect} from 'react-redux'
import SearchInput from '../home/SearchInput'
import {injectIntl, intlShape, FormattedMessage} from 'react-intl';
import {browserHistory} from 'react-router'
import {withStyles} from '@material-ui/core/styles';
import FilterAreas from './filtersArea';
const styles = theme => ({
    paper: {
        top: "36px!important",
        background: "#40403b"
    },
});

class Search extends Component {

    constructor(props) {
        super(props);
        this.state = {};

    }


    render() {
        return <div className="filter-box">
            <div className="container">
                <SearchInput showHistoryIcon showAdvanceIcon small location={this.props.location}
                             initValue={this.props.location.query.searchValue||this.props.searchResult.searchTitle||""}
                             hideIcon showButton inputStyle={{height: "40px",fontSize: "1rem",lineHeight: "1rem"}}
                             wrapperStyle={{margin:"20px 0",float:'left'}}
                             lineStyle={{float:"left",width:"85%",border:"1px solid rgb(212, 95, 95)"}}/>



                {
                    // <FilterAreas></FilterAreas> 
                }

            </div>

        </div>
    }

}


const mapStateToProps = (state, props) => {

    return {
        userInfos: state.userInfos,
        routing: state.routing,
        searchResult:state.searchResult,
        ...props
    }
}





export default connect(mapStateToProps)(withStyles(styles)(injectIntl(Search)));


