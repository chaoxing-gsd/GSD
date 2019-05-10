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

});
const TEXT_TOOL_MENUS=[
    {id:'menu-txt-06',name:'WORD_CLOUD',href:'wordCloud'},
    {id:'menu-txt-07',name:'N-gram',href:'ngRam'},
    {id:'menu-txt-01',name:'Text_Similar',href:'similarText'},
    {id:'menu-txt-02',name:'Thesaurus Words',href:'similarWord'},
    {id:'menu-txt-03',name:'KeyWords Picker',href:'keyWords'},
    {id:'menu-txt-04',name:'Part of speech',href:'wordTag'},
    // {id:'menu-txt-05',name:'Reg Text',href:'#'},

];

class RunCmdBtn extends Component {
    static propTypes = {
        intl: intlShape.isRequired,
        onFilterSelect: PropTypes.func
    }

    constructor(props) {
        super(props);

        this.state = {};

    }

    componentDidMount() {
    }

    componentWillReceiveProps(nextProps) {
    }



    changeTool(href){
        browserHistory.push("/toolPages/"+href)
    }

    render() {


        return (
            <div className="btn-group">
                <button type="button" className="btn btn-danger" disabled={this.props.disable} onClick={()=>this.props.onClick()}><FormattedMessage
                    id="Run"/></button>
                <button type="button" className="btn btn-danger dropdown-toggle"  onClick={()=>this.setState({showToggleMenu:true})}>
                    <span className="caret"></span>
                    <span className="sr-only">Toggle Dropdown</span>
                </button>
                <div>
                    <div className="gsd-menu-mask" onClick={()=>this.setState({showToggleMenu:false})} style={{display:this.state.showToggleMenu?"block":"none"}}></div>
                    <ul className="dropdown-menu gsd-drop-menu" style={{display:this.state.showToggleMenu?"block":"none"}}>
                        <li className="ant-select-dropdown-menu-item-group-title"><span>切换文本工具</span></li>
                        {
                            TEXT_TOOL_MENUS.map(item=> <li key={item.id}><a onClick={()=>this.changeTool(item.href)}><FormattedMessage id={item.name}/></a></li>)

                        }

                    </ul>
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
        getBaiKeData: (searchValue) => dispatch(getBaiKeData(searchValue))


    }
}


export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(withStyles(styles)(RunCmdBtn)));
