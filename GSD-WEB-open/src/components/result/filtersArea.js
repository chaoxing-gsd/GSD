/**
 * Created by Aaron on 2018/8/8.
 */
import React, {Component} from 'react'
import {Glyphicon} from 'react-bootstrap';
import {connect} from 'react-redux'
import {injectIntl, intlShape, FormattedMessage} from 'react-intl';
import {browserHistory} from 'react-router'
import {withStyles} from '@material-ui/core/styles';
import FilterDropDown from "./filterDropDown"
const styles = theme => ({

});

const orderOptions = [
    {value:"0",label:<FormattedMessage
        id="Order by"
    />},
    {value:"1",label:<FormattedMessage
        id="DATA_COUNT_DESC"
    />},
    {value:"2",label:<FormattedMessage
        id="DATA_COUNT_ASC"
    />},

];


class FilterAreas extends Component {

    constructor(props) {
        super(props);
        this.state = {open:true};

    }


    render() {
        return <div className={this.state.open?"filter-area-box clearfix toggleDiv":"filter-area-box clearfix toggleDiv hideAll"}>
            {

            <div className={this.state.open?"toggleDiv":"toggleDiv hide"}>

                <FilterDropDown name={<FormattedMessage id="Order by"/>} options={orderOptions}/>
                <FilterDropDown name={<FormattedMessage id="Order by"/>} options={orderOptions}/>
                <FilterDropDown name={<FormattedMessage id="Order by"/>} options={orderOptions}/>
                <FilterDropDown name={<FormattedMessage id="Order by"/>} options={orderOptions}/>
                <FilterDropDown name={<FormattedMessage id="Order by"/>} options={orderOptions}/>
          </div>
          //       <span onClick={()=>this.setState({open:!this.state.open})} className={this.state.open?"filter-box-toggle-icon":"filter-box-toggle-icon hideIcon"}><i className={this.state.open?"glyphicon glyphicon-menu-up":"glyphicon glyphicon-menu-down"}></i>
          //  </span>
            }


        </div>
    }

}


const mapStateToProps = (state, props) => {

    return {
        userInfos: state.userInfos,
        routing: state.routing,
        ...props
    }
}





export default connect(mapStateToProps)(withStyles(styles)(injectIntl(FilterAreas)));


