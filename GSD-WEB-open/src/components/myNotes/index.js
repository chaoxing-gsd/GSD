import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Grid, Row, Col} from 'react-bootstrap'
import Paper from '@material-ui/core/Paper';
import {withStyles} from '@material-ui/core/styles';
import {FormattedMessage} from 'react-intl';
import Skeleton, {SkeletonTheme} from 'react-loading-skeleton'
import {Glyphicon} from 'react-bootstrap';
import {Breadcrumb} from 'antd';
import Header  from "../header"
import {getMyNotesData,deleteMyNotesData} from "../../actions"
import {connect} from 'react-redux'
import {injectIntl} from 'react-intl';
import {browserHistory} from 'react-router'
import {Table} from 'antd';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import swal from 'sweetalert2'
const styles = theme => ({
    root: {
        ...theme.mixins.gutters(),
        paddingTop: "20px",
        paddingBottom: "30px",
        marginTop: "30px"
    },
    buttonRemove:{
        marginLeft:"15px",
        marginRight:"15px",
        display:'inline-block',
        textAlign:'center',
        fontSize:'12px',
        '&:hover': {
            color: "#ffffff",
            backgroundColor: "#b53737"
        },
        color: "#ffffff",
        backgroundColor: "#cc4141"
    },
    buttonExport:{

        display:'inline-block',
        textAlign:'center',
        fontSize:'12px',
        '&:hover': {
            color: "#ffffff",
            backgroundColor: "#068074"
        },
        color: "#ffffff",
        backgroundColor: "#009688"
    },
    buttonEdit:{

        display:'inline-block',
        textAlign:'center',
        fontSize:'12px',
        '&:hover': {
            color: "#ffffff",
            backgroundColor: "#21729a"
        },
        color: "#ffffff",
        backgroundColor: "#3399cc"
    },
    removeProgress:{
        color:"#7f818a",
        position:'absolute',
        top: '50%',
        left: '50%',
        marginTop: -9,
        marginLeft: -9,


    }
});





class MyNotes extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired
    }

    constructor(props) {
        super(props);
        this.state = {selectedRowKeys: []}
        this.cxId;
    }


    componentDidMount() {
        if (!!this.props.userInfos.responseUserInfo.userid) {
            this.cxId = this.props.userInfos.responseUserInfo.userid;
            this.props.getMyNotesData(this.cxId);
        }

    }


    componentWillReceiveProps(nextProps) {

        if (nextProps.userInfos.responseUserInfo.userid!=""&&nextProps.userInfos.responseUserInfo.userid != this.cxId) {
            this.cxId = nextProps.userInfos.responseUserInfo.userid;
            this.props.getMyNotesData(this.cxId);
        }
    }

    onSelectChange = (selectedRowKeys) => {
        this.setState({selectedRowKeys});
    }


    removeNotes(){
        swal({
            title: this.props.intl.formatMessage({id: 'TIP'}),
            text: this.props.intl.formatMessage({id: 'CONFIRM OPERATION'}),
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: this.props.intl.formatMessage({id: 'CANCEL'}),
            confirmButtonText: this.props.intl.formatMessage({id: 'Ok'})
        }).then((result) => {
            if (result.value) {
                var selectedRowKeys=this.state.selectedRowKeys;
                this.props.deleteMyNotesData(this.cxId,selectedRowKeys);
                this.setState({selectedRowKeys:[]})
            }
        })

    }

    editMyNote(){
        browserHistory.push("/editMyNotes?noteId="+this.state.selectedRowKeys[0]);
    }


    renderToolBar(){
        const {classes} = this.props;
        return <div>
            <Button disabled={this.state.selectedRowKeys.length!=1} onClick={()=>this.editMyNote()}  variant="contained" className={classes.buttonEdit} size="small" ><Glyphicon glyph="pencil" style={{fontSize:'1rem',top:'0px'}}/>&nbsp;<span><FormattedMessage id="EDIT"/></span></Button>
            <Button onClick={()=>this.removeNotes()} disabled={this.state.selectedRowKeys.length==0} variant="contained" className={classes.buttonRemove} size="small" >

                {this.props.myNotes.pageInfos.isDeleting&&<CircularProgress
                className={classes.removeProgress}
                size={18}
            />}<Glyphicon glyph="trash" style={{fontSize:'1rem',top:'0px'}}/>&nbsp;<span><FormattedMessage id="DELETE"/></span></Button>
            <Button disabled={this.state.selectedRowKeys.length==0} variant="contained" className={classes.buttonExport} size="small" ><Glyphicon glyph="download-alt" style={{fontSize:'1rem',top:'0px'}}/>&nbsp;<span><FormattedMessage id="EXPORT"/></span></Button>

        </div>

    }

    render() {
        const {classes} = this.props;
        const { selectedRowKeys } = this.state;

        const columns = [{
            title: this.props.intl.formatMessage({id: 'TITLE'}),
            dataIndex: 'title',
            width: 100,
            render(text, record, index){
               return text;
            }
        }, {
            title: this.props.intl.formatMessage({id: 'ORIGINAL_URL'}),
            dataIndex: 'url',
            width: 40,
            render(text, record, index){
                return <a target="_blank" href={text}><FormattedMessage id="ORIGINAL_URL"/></a>
            }
        }, {
            title: this.props.intl.formatMessage({id: 'CONTENT'}),
            width: 260,
            dataIndex: 'content',
            render(text, record, index){
                if(!!text&&text.length>50){
                    return text.substring(0,50)+"...."
                }
                return text;
            }
        }, {
            width:150,
            title: this.props.intl.formatMessage({id: 'REFERENCE'}),
            dataIndex: 'gbt_7714',
            render(text, record, index){
                return <div>GB/T 7714:{record["gbt_7714"]}<br/>MLA:{record["mla"]}<br/>APA:{record["apa"]}</div>
            }
        }];

        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
            hideDefaultSelections: true,
            onSelection: this.onSelection,
        };




        return (
            <div>
                <Header/>
                <Grid style={{marginTop:"30px"}}>
                    <Breadcrumb separator=">">
                        <Breadcrumb.Item href="/"><FormattedMessage id="HOME"/></Breadcrumb.Item>
                        <Breadcrumb.Item><strong></strong><FormattedMessage
                            id="MY_NOTE"/></Breadcrumb.Item>
                    </Breadcrumb>
                    <Paper className={classes.root} elevation={1}>
                                             <Table rowKey={(record)=>record.id}  title={() => this.renderToolBar()} rowSelection={rowSelection} columns={columns} dataSource={this.props.myNotes.myNotesData}/>
                    </Paper>
                </Grid>
            </div>
        );
    }

}

const mapStateToProps = (state, props) => {

    return {
        routing: state.routing,
        userInfos: state.userInfos,
        myNotes:state.myNotes
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        getMyNotesData: (userId) => dispatch(getMyNotesData(userId)),
        deleteMyNotesData: (userId,noteIds) => dispatch(deleteMyNotesData(userId,noteIds)),

    }
}


export default connect(mapStateToProps,mapDispatchToProps)(withStyles(styles)(injectIntl(MyNotes)))
