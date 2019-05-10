/**
 * Created by Aaron on 2018/7/5.
 */
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Grid, Row, Col, Glyphicon} from 'react-bootstrap'
import Paper from '@material-ui/core/Paper';
import {injectIntl, intlShape, FormattedMessage} from 'react-intl';
import {withStyles} from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import {connect} from 'react-redux'
import {INNER_SERVER_URL} from  "../../config/constants";
import {fetchUrl} from '../../actions/fetchData';
import Button from '@material-ui/core/Button';
import swal from 'sweetalert2'
import {browserHistory} from 'react-router'
const styles = theme => ({
    chip: {
        fontSize: "0.9rem",
        margin: theme.spacing.unit,
        backgroundColor: "#ffffff",
        color: "#d45f5f",
        border: "solid 1px #d45f5f",
        '&:hover': {
            fontSize: "0.9rem",
            color: '#ffffff',
            border: 'solid 1px #d45f5f00',
            backgroundColor: '#e88a8a',
            textDecoration: 'none'
        },
        '&:focus': {
            fontSize: "0.9rem",
            backgroundColor: "#ffffff",
            color: "#d45f5f",
            border: "solid 1px #d45f5f",
            textDecoration: 'none'
        },
    },
    chipSelected: {
        fontSize: "0.9rem",
        margin: theme.spacing.unit,
        backgroundColor: "#d45f5f",
        color: "#ffffff",
        border: "solid 1px #d45f5f",
        '&:hover': {
            fontSize: "0.9rem",
            color: '#ffffff',
            border: 'solid 1px #d45f5f00',
            backgroundColor: '#e88a8a',
            textDecoration: 'none'
        },
        '&:focus': {
            fontSize: "0.9rem",
            backgroundColor: "#d45f5f",
            color: "#ffffff",
            border: "solid 1px #d45f5f",
            textDecoration: 'none'
        },
    },
    buttonOk:{
        backgroundColor: "#f1f1f1",
        textAlign:"center",
        display: "inline-block",
        fontSize:'12px',
        '&:hover': {

            backgroundColor: "#ccc"
        },
        color: "#696565",
    },
});


class ChooseFiledsDialog extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        intl: intlShape.isRequired
    }

    constructor(props) {
        super(props);
        this.cxId = null;
        this.isAdding = false
        this.selectedTagList=[];
        this.state = {snakeOpen: false, filedSetting: null,selectTagId:"",dialogOpenMode:true}
    }


    componentDidMount() {
        this.setState({filedSetting:this.props.filedSetting});
    }

    componentWillReceiveProps(nextProps) {
        console.log(nextProps.filedSetting);
        if(nextProps.filedSetting!=null){
            this.setState({filedSetting:nextProps.filedSetting});
        }

    }

    isSelectedItems(){

        if (!!this.state.filedSetting && !!this.state.filedSetting.filedsnamecn) {
            var tagList = this.state.filedSetting.filedsnamecn.split("|");
            var isSelectedList=tagList.filter(item=>{
                var arr=item.split(",");
                return arr[3]==1;
            })||[];
            return isSelectedList.length;
        }
        return 0;

    }


    selectChip(index,selected){
        if (!!this.state.filedSetting && !!this.state.filedSetting.filedsnamecn) {
            var tagList = this.state.filedSetting.filedsnamecn.split("|");
            var items=tagList[index];
            var arr=items.split(",");
            if(selected==1){
                arr[3]=0;
            }else{

                if(this.isSelectedItems()>=5){
                    swal({
                        title: this.props.intl.formatMessage({id: 'Too Much Items'}),
                        type: 'info',
                        showCancelButton: false,
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: this.props.intl.formatMessage({id: 'Ok'})
                    });
                    return;
                }
                arr[3]=1;
            }
            tagList[index]=arr.join(",");
            this.setState({filedSetting:{...this.state.filedSetting,filedsnamecn:tagList.join("|")}});
            this.saveFileds({...this.state.filedSetting,filedsnamecn:tagList.join("|")});



        }
    }

    

    saveFileds(filedSetting=this.state.filedSetting){//保存用户设置信息


        if (!!filedSetting && !!filedSetting.filedsnamecn&&!!filedSetting.filedids) {
            var fieldsArr=filedSetting.filedids.split("|");
            var fields=filedSetting.filedsnamecn.split("|").map((item,index)=>{

                var arr=item.split(",");

                return {chname:arr[0],filed:fieldsArr[index],enname: arr[1],percent:arr[2],show:arr[3]};

            });

             this.props.setSelectedFileds(fields,filedSetting);
             
        }

    }

    renderChips() {
        const {classes} = this.props;
        var componentArr = [];
        if (!!this.state.filedSetting && !!this.state.filedSetting.filedsnamecn) {


            var tagList = this.state.filedSetting.filedsnamecn.split("|");
            componentArr = tagList.map((item, index)=> {
                    var arr=item.split(",")
                     return <Chip
                        key={index}
                        label={`${arr[0]}(${arr[2]})`}
                        onClick={()=>this.selectChip(index,arr[3])}
                        className={arr[3]==1?classes.chipSelected:classes.chip}
                        component="span"
                        clickable
                    />
                }) || [];

            return componentArr;
        }else{
            return <h4><small> <FormattedMessage id="NO_DATA"/></small></h4>
        }


    }


    render() {
        const {classes}=this.props;

        return (
            <div className="animateDiv" style={{marginTop:'20px'}}>

                <h4><FormattedMessage
                    id="Compare Fields"
                /> &nbsp;
                    {!this.state.dialogOpenMode&&<a style={{fontSize:'1rem'}} onClick={()=>this.setState({dialogOpenMode:true})}><FormattedMessage id="Expand" /></a>}
                    {this.state.dialogOpenMode&&<a style={{fontSize:'1rem'}} onClick={()=>this.setState({dialogOpenMode:false})}><FormattedMessage id="Collapse"/></a>}
                </h4>
                <div className={this.state.dialogOpenMode?"filterDialog show":"filterDialog"}>
                    <h4><small><FormattedMessage id="Compare Fields Tip"/></small></h4>
                {this.renderChips()}

                <div style={{marginTop:"20px",textAlign:"right"}}>
                    {
                    //     <Button variant="contained" className={classes.buttonOk} onClick={()=>this.saveFileds()}
                    //           size="small"><FormattedMessage
                    //     id="Ok"/></Button>
                    // & nbsp;
                    }

                    {
                        <Button size="small" className={classes.buttonOk} style={{textAlign:"center",display:'inline-block'}}
                              onClick={()=>this.setState({dialogOpenMode:false})}><FormattedMessage
                        id="Collapse"/></Button>
                    }

                    </div>
                </div>
            </div>
        );
    }

}


const mapStateToProps = (state, props) => {

    return {
        routing: state.routing,
        userInfos: state.userInfos
    }
}


export default connect(mapStateToProps)(withStyles(styles)(injectIntl(ChooseFiledsDialog)));

