/**
 * Created by Aaron on 2018/8/8.
 */
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Glyphicon} from 'react-bootstrap';
import {connect} from 'react-redux'
import {injectIntl, intlShape, FormattedMessage} from 'react-intl';
import {browserHistory} from 'react-router'
import {withStyles} from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';

const styles = theme => ({
    paper: {

    },
    menuItem: {
        fontSize: "12px",
        padding: '0.2rem 1rem',
        color: "#6b6b67",
        '&:hover': {

        },
    },
    buttonToggle:{
        display: "inline-block",
        color: "#a09d9d",
        border: "0",
        fontSize: "12px",
        minWidth:'25px',
        minHeight:'20px',
        textAlign:"center"
    }
});
const ITEM_HEIGHT=48;

class FilterDropDown extends Component {

    static propTypes = {
        name: PropTypes.object.isRequired,
        options:PropTypes.array,
        itemClick:PropTypes.func,
        hideCart:PropTypes.bool,
        hideIcon:PropTypes.bool,
        iconClass:PropTypes.string,
        hideSelectedLabel:PropTypes.bool,
        compomentStyle:PropTypes.string,
        disabled:PropTypes.bool


    }



    constructor(props) {
        super(props);
        this.state = {anchorEl: null,anchorElTop:0,currentValue:null};

    }

    handleDialogOpen(e){
        this.setState({ anchorEl: e.currentTarget ,anchorElTop:e.offsetTop+15});
    }

    setCurrentSelection(option){
        this.setState({ anchorEl: null,anchorElTop:0,currentValue:option });
        if(!!this.props.itemClick){
            this.props.itemClick(option);
        }
    }


    render() {
        const {name,classes,options}=this.props;
        const {anchorEl,currentValue}=this.state;
        var labelName=!!currentValue?currentValue.label:name;
        return <span style={{cursor:"pointer",color:"#797878",fontSize:"13px"}} className="filter-drop-btn">
            <Button
                disabled={this.props.disabled}
                className={!!this.props.compomentStyle?this.props.compomentStyle:classes.buttonToggle}
                variant="outlined" size="small"onClick={(e)=>this.handleDialogOpen(e)} >
            {!this.props.hideIcon&&<i className={this.props.iconClass}></i>} <span>{this.props.hideSelectedLabel?name:labelName}&nbsp;</span>{!this.props.hideCart&&<span className="caret"></span>}
            </Button>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={()=>{this.setState({ anchorEl: null });}}
                PaperProps={{
            style: {
              maxHeight: ITEM_HEIGHT * 4.5,
              width: 80,
            },
          }}
            >
                {options.map(option => (
                    <MenuItem  className={classes.menuItem} key={option.value} selected={!!currentValue&&(option.value === currentValue.value)}  onClick={()=>this.setCurrentSelection(option)}>
                        {option.label}
                    </MenuItem>
                ))}
            </Menu>
            </span>
    }

}


const mapStateToProps = (state, props) => {

    return {
        userInfos: state.userInfos,
        routing: state.routing,
        ...props
    }
}





export default connect(mapStateToProps)(withStyles(styles)(injectIntl(FilterDropDown)));


