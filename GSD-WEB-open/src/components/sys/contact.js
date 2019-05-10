import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {Grid, Row, Col} from 'react-bootstrap'
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import {FormattedMessage,injectIntl} from 'react-intl';
import swal from 'sweetalert2'
import {fetchUrl} from '../../actions/fetchData';
import {INNER_SERVER_URL, UPLOAD_SERVER_URL} from  "../../config/constants";
import {isEmail} from '../../utils/utils';
import Header  from "../header"
const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: "20px",
    paddingBottom: "30px"
  },
});


class Contact extends Component {
  static propTypes={
    classes: PropTypes.object.isRequired
  }
  constructor(props) {
    super(props);
    this.state={contactEmail:"",adviceInfo:""}
  }


  componentDidMount(){
      document.title=this.props.intl.formatMessage({id: 'Contact Us'})+"-GSD";
  }

  submitAdvice=async()=>{
      if(!this.state.contactEmail){
          swal({
              title: this.props.intl.formatMessage({id: 'EMAIL_IS_EMPTY'}),
              type: 'info',
              showCancelButton: false,
              confirmButtonColor: '#3085d6',
              confirmButtonText: this.props.intl.formatMessage({id: 'Ok'})
          })
          return;
      }
      if(!isEmail(this.state.contactEmail)){
          swal({
              title: this.props.intl.formatMessage({id: 'Email Error'}),
              type: 'info',
              showCancelButton: false,
              confirmButtonColor: '#3085d6',
              confirmButtonText: this.props.intl.formatMessage({id: 'Ok'})
          })
          return;
      }
      var postParam={};
      postParam["userid"]="";
      postParam["username"]="";
      postParam["type"]="1";
      postParam["level"]="1";
      postParam["fromwhere"]="1";
      postParam["title"]="";
      postParam["message"]=this.state.adviceInfo;
      postParam["email"]=this.state.contactEmail;
      postParam["qq"]="";
      var header = {"Content-Type":"application/json"};
      var response = await fetchUrl(INNER_SERVER_URL + "addLeavingMessage", "post", JSON.stringify(postParam), header);
      if(!!response&&response.statu){
          swal({
              title: this.props.intl.formatMessage({id: 'SUCCESS'}),
              type: 'success',
              showCancelButton: false,
              timer:2000,
              confirmButtonColor: '#3085d6',
              confirmButtonText: this.props.intl.formatMessage({id: 'Ok'})
          }).then(()=>{
              if (navigator.userAgent.indexOf("MSIE") > 0) {//close IE
                  if (navigator.userAgent.indexOf("MSIE 6.0") > 0) {
                      window.opener = null;
                      window.close();
                  } else {
                      window.open('', '_top');
                      window.top.close();
                  }
              }
              else if (navigator.userAgent.indexOf("Firefox") > 0) {//close firefox
                  window.location.href = 'about:blank ';
              } else {//close chrome;It is effective when it is only one.
                  window.opener = null;
                  window.open('', '_self');
                  window.close();

              }
          })
      }else{
          swal({
              title: this.props.intl.formatMessage({id: 'SUCCESS'}),
              type: 'error',
              showCancelButton: false,
              confirmButtonColor: '#3085d6',
              confirmButtonText: this.props.intl.formatMessage({id: 'Ok'})
          })
      }

  }

  render() {
    const { classes } = this.props;

    return (
        <div>
          <Header/>

          <div className="jumbotron" style={{position:"relative",minHeight:'600px'}}>
              <div style={{background:`url('/sourceImages/contact_bg.png') no-repeat`,position: 'absolute',left: '0',right: '0',height: '300px',top: '0',zIndex: '1'}}></div>

              <div style={{position: 'absolute',left: '0',right:'0',zIndex: '10'}}>
          <Grid >
            <h3 style={{color:"#676464",color:"#ffffff"}}><i className="fa fa-user-circle-o"></i>&nbsp;<FormattedMessage id="Contact Us"/></h3>
            <p style={{fontSize:'1rem',color:"#ffffff"}}> <FormattedMessage id="Contact Us Info"/></p>

            <div style={{marginTop:"30px"}}>
              <Paper className={classes.root} elevation={1}>
                <div>
                 <h5 style={{color:"#b92626"}}><FormattedMessage id="Advice"/></h5>
                  <div className="form-group" style={{marginTop:"15px"}}>
                    <input value={this.state.contactEmail} onChange={(e)=>this.setState({contactEmail:e.target.value})} type="text" className="form-control" placeholder="请写下你的联系方式"/>
                  </div>

                  <div className="form-group" style={{marginTop:"15px"}}>
                    <textarea value={this.state.adviceInfo} onChange={(e)=>this.setState({adviceInfo:e.target.value})} rows="8" className="form-control" placeholder="请写下你的意见和建议"/>
                  </div>

                  <div style={{textAlign:"right"}}>
                    <a className="btn btn-danger" onClick={()=>this.submitAdvice()}>提交</a>
                  </div>

                </div>
                  </Paper>
            </div>

            <div style={{marginTop:"30px"}}>
              <h3 style={{color:"#676464"}}><i className="glyphicon glyphicon-phone-alt"></i>&nbsp;<FormattedMessage id="Contact Us"/></h3>
              <p style={{paddingLeft:'2rem',color: "#8c1515"}}><i className="fa fa-envelope"></i>&nbsp;&nbsp;&nbsp;<FormattedMessage id="Email"/>:gsd-inquiry@chaoxing.com</p>
            </div>
          </Grid>
                  </div>

            </div>
        </div>
    );
  }

}
export default withStyles(styles)(injectIntl(Contact))
