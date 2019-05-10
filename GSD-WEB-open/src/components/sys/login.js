/**
 * Created by Aaron on 2018/6/25.
 */
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import '../../assets/styles/login.css'
import {Glyphicon} from 'react-bootstrap';
import {Grid, Row, Col} from 'react-bootstrap';
import {connect} from 'react-redux'
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import CardActions from '@material-ui/core/CardActions';
import FormControl from '@material-ui/core/FormControl';
import {injectIntl, intlShape, FormattedMessage} from 'react-intl';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import {withStyles} from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';
import {PreImage} from '../plugins'
import FormHelperText from '@material-ui/core/FormHelperText';
import { browserHistory } from 'react-router'
import InputAdornment from '@material-ui/core/InputAdornment';
import {isMobile,isEmail} from "../../utils/utils";
import {toShowCode,setLoginInfos,refreshRandomImage,checkPhoneNum,userLogin} from "../../actions";
import LinearProgress from '@material-ui/core/LinearProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Zoom from '@material-ui/core/Zoom';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import swal from 'sweetalert2'

const styles = theme => ({

    buttonOk:{
        fontSize:'14px',
        backgroundColor: green[500],
        '&:hover': {
            backgroundColor: green[700],
        },
    },
    buttonCode:{
        fontSize:'12px',
        backgroundColor: "#8c1515",
        '&:hover': {
            backgroundColor: "#ca3030",
        },
        color:"#ffffff",
        top:'-5px'
    },
    buttonCancel:{
        fontSize:'14px',
        color: "#777777",

    },
    card: {
        minWidth: 300,
        margin: '0 auto',
        marginTop: '40px',
        paddingBottom:'30px'
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    cssInput: {
        fontSize: "16px"
    },
    cssLabel: {
        fontSize: "14px",
        '&$cssFocused': {
            color: '#8c1515',
        }
    },
    cssLabelError:{
        color:"#3399cc"
    },
    cssFocused: {},
    cssUnderline: {
        '&:after': {
            borderBottomColor: '#8c1515',
        },
    },
    cssFocused: {},
    cssUnderline: {
        '&:after': {
            borderBottomColor: '#8c1515',
        },
    }
});


class Login extends Component {
    static propTypes = {
        fullScreen: PropTypes.bool.isRequired,
        intl: intlShape.isRequired,

    }


    constructor(props) {
        super(props);
        this.timeCountIntervalId=null;
        this.state = {timeCount:60,showQrcode: false,passwordError:false,passwordValue:'',nameValueError:false,nameValue:'',codeValue:'',codeError:false,passwordMode:true,randomValue:'',randomError:false};

    }

    toLogin(){
        if(!this.state.nameValue){
            this.setState({nameValueError:true});
            return;
        }
        if(this.state.passwordMode){
            if(!this.state.passwordValue){
                this.setState({passwordError:true});
                return;
            }
        }else{
            if(!this.state.codeValue){
                this.setState({codeError:true});
                return;
            }
        }
        var origianlUrl=this.props.location.query.originalUrl;
        this.props.userLogin(this.state.nameValue,this.state.passwordValue,this.state.codeValue,this.state.passwordMode,this.props.location.query.chromeExtension,origianlUrl);

    }



    toRegister(){
        browserHistory.push('/register');
    }

    handlePasswordChange(e){//密码输入
        this.setState({ passwordValue: e.target.value.trim(),passwordError:!e.target.value.trim() });
    }

    handleVCodeChange(e){//验证码输入

        this.setState({ codeValue: e.target.value.trim(),codeError:!e.target.value.trim() });
    }

    handleNameChange(e){//用户名输入
        this.setState({ nameValue: e.target.value.trim(),nameValueError:!e.target.value.trim() });
    }

    handleRandomChange(e){//随机码输入
        this.setState({ randomValue: e.target.value.trim(),randomError:!e.target.value.trim() });
    }

    timeCount(){

        this.timeCountIntervalId=setInterval(()=>{
            if(this.state.timeCount>0){
                var timeCount=this.state.timeCount-1;
                this.setState({timeCount});
            }else{
                this.props.setLoginInfos({watingForCode:false,accessCodeStatu:false});
                this.setState({timeCount:60});
                if(!!this.timeCountIntervalId)clearInterval(this.timeCountIntervalId);
                this.timeCountIntervalId=null;
            }
        },1000);

    }

    renderTimeCount(){

        if(!this.timeCountIntervalId)this.timeCount();
        return (<FormattedMessage
            id='WATING_FOR_CODE'
            values={{
        timeCount: this.state.timeCount
    }}
        />);
    }

    onKeyup(e) {

        if (e.keyCode == 13) {
            this.toLogin();
        }
    }


    getIdentifyCode(){//获取手机验证码
        if(!!this.state.nameValue){
            if(isMobile(this.state.nameValue)||isEmail(this.state.nameValue)){//为手机号或者邮箱
                this.props.toShowCode(this.state.nameValue);

            }else {
                swal(
                    `${this.props.intl.formatMessage({id: 'USERNAME/EMAIL/PHONE Error'})}`
                    ,
                    '',
                    'error'
                )
            }

        }else{
            this.setState({nameValueError:true})
        }
    }

    accessPhoneCode(){//获取手机验证码
        var randomValue=this.state.randomValue;
        if(!randomValue){
            this.setState({randomError:true});
            return;
        }
        this.setState({randomValue:''});
        this.props.checkPhoneNum(this.state.nameValue,randomValue)
    }
    showQrcode(){
        this.setState({showQrcode:true})
    }

    componentDidMount() {
        document.title=this.props.intl.formatMessage({id: 'LOGIN'})+"-"+this.props.intl.formatMessage({id: 'PROJECT_NAME'});
    }


    render() {
        const {classes} = this.props;

        return (
            <div className={this.state.showQrcode?"":"hideQrcode"} style={{marginBottom:"50px"}}>
        <Grid >
            <Row>
                <Col className="login-dialog" xs={12} sm={5} smPush={1}>

                    <Card className={classes.card}>
                        <LinearProgress style={{visibility:this.props.userInfos.loginInfos.isAccessing?"visible":"hidden"}} />
                        <CardContent>
                            <h1 className="login-logo">个人索引库</h1>
                            <h1 className="login-title"><FormattedMessage
                                id="LOGIN"
                            /></h1>
                            <div className="desc">
                                <content><FormattedMessage
                                    id="LOGIN_TIP01"
                                /></content>
                            </div>

                            <div className="login-form">

                                <div className="wrapper">

                                    <div>

                                        <FormControl className={classes.margin} fullWidth>
                                            <InputLabel
                                                FormLabelClasses={{
            root: classes.cssLabel,
            focused: classes.cssFocused,
          }}
                                                htmlFor="username"
                                            >
                                                <FormattedMessage
                                                    id="USERNAME/EMAIL/PHONE"
                                                />
                                            </InputLabel>
                                            <Input  onKeyUp={(e)=>this.onKeyup(e)} value={this.state.nameValue} onChange={(e)=>this.handleNameChange(e)} error={this.state.nameValueError}
                                                classes={{
                                             root: classes.cssInput,
            underline: classes.cssUnderline,
          }}
                                                id="username"
                                            />
                                            {this.state.nameValueError&&(<FormHelperText error={this.state.nameValueError} id="name-error-text"><FormattedMessage
                                                id="NAME NOT NULL"
                                            /></FormHelperText>)}
                                        </FormControl>

                                    </div>

                                    {this.state.passwordMode&&<div style={{marginTop:'25px'}}>
                                        <FormControl className={classes.margin} fullWidth>
                                            <InputLabel
                                                FormLabelClasses={{
            root: classes.cssLabel,
            focused: classes.cssFocused,
            error:classes.cssLabelError
          }}
                                                htmlFor="password"
                                            >
                                                <FormattedMessage
                                                    id="PASSWORD"
                                                />
                                            </InputLabel>
                                            <Input onKeyUp={(e)=>this.onKeyup(e)}  value={this.state.passwordValue} onChange={(e)=>this.handlePasswordChange(e)} error={this.state.passwordError} type="password"
                                                   classes={{
            underline: classes.cssUnderline,
          }}
                                                   id="password"
                                            />
                                            {this.state.passwordError&&(<FormHelperText error={this.state.passwordError} id="password-error-text"><FormattedMessage
                                                id="PASSWORD NOT NULL"
                                            /></FormHelperText>)}
                                        </FormControl>



                                    </div>}

                                    {!this.state.passwordMode&&<div  style={{marginTop:'25px'}}>
                                        <FormControl className={classes.margin} fullWidth>
                                            <InputLabel
                                                FormLabelClasses={{
            root: classes.cssLabel,
            focused: classes.cssFocused,
            error:classes.cssLabelError
          }}
                                                htmlFor="Verification_Code"
                                            >
                                                <FormattedMessage
                                                    id="Verification_Code"
                                                />
                                            </InputLabel>
                                            <Input onKeyUp={(e)=>this.onKeyup(e)}  value={this.state.codeValue} onChange={(e)=>this.handleVCodeChange(e)} error={this.state.codeError} type="password"
                                                   classes={{
            underline: classes.cssUnderline,
          }}
                                                   id="Verification_Code"
                                                   endAdornment={
              <InputAdornment position="end">
                <Button color="primary" size="small" onClick={()=>this.getIdentifyCode()} disabled={this.props.userInfos.loginInfos.accessCodeStatu||this.props.userInfos.loginInfos.watingForCode} variant="contained" className={classes.buttonCode} >
                <small>{!this.props.userInfos.loginInfos.watingForCode?<FormattedMessage
                                                id="Get_Verification_Code"
                                            />:this.renderTimeCount()}</small>
                </Button>
              </InputAdornment>
            }
                                            />
                                            {this.state.codeError&&(<FormHelperText error={this.state.codeError} id="vcode-error-text"><FormattedMessage
                                                id="Verification_Code_Not_Null"
                                            /></FormHelperText>)}
                                        </FormControl>
                                    </div>}
                                </div>
                            </div>
                            {this.state.passwordMode&&<a onClick={()=>this.setState({passwordMode:false})} className="link register-link " >
                                <FormattedMessage
                                    id="Login with mobile"
                                />
                            </a>}
                            {!this.state.passwordMode&&<a onClick={()=>this.setState({passwordMode:true})} className="link register-link " >
                                <FormattedMessage
                                    id="Login with password"
                                />
                            </a>}
                            <a className="link forget-link"
                                                onClick={()=>this.toRegister()}>
                                            <FormattedMessage
                                                id="CREATE ACCOUNT"
                                            />
                                        </a>
                            {
                                // <a className="link forget-link">
                                //     <FormattedMessage
                                //         id="FORGET PASSWORD"
                                //     />
                                // </a>
                            }

                        </CardContent>
                        <CardActions>

                            <div style={{width:'100%',display:'block',marginTop:'15px'}}>

                                <Button disabled={this.props.userInfos.loginInfos.isAccessing} onClick={()=>this.toLogin()}   variant="contained" fullWidth size="large" color="primary" className={classes.buttonOk}>
                                    <FormattedMessage
                                        id="LOGIN"
                                    />
                                </Button>

                                <Button onClick={()=>window.history.go(-1)}  style={{marginTop:'15px'}} variant="outlined" fullWidth size="large" color="primary" className={classes.buttonCancel}>
                                    <FormattedMessage
                                        id="CANCEL"
                                    />
                                </Button>


                            </div>

                        </CardActions>
                    </Card>
                </Col>
                {
                //     <Col className="qrcode-dialog" xs={12} sm={5} smPush={1}>
                //
                //     <div className="qrcode">
                //         <div className="qrcode-tip"><h4><FormattedMessage
                //             id="LOGIN_TIP02"
                //         /></h4></div>
                //         <div className="qrcode-wrapper"><PreImage onLoaded={()=>this.showQrcode()} width="100%"
                //                                                   height="100%"
                //                                                   src="http://passport2.chaoxing.com/createqr?uuid=329ae9a1ed97428fa32c25cd6adf6a44"/>
                //         </div>
                //         <div><a style={{marginLeft:"15%",marginTop:"15px"}} className="register-link"
                //                 onClick={()=>this.toRegister()}>
                //             <FormattedMessage
                //                 id="CREATE ACCOUNT"
                //             />
                //         </a></div>
                //
                //
                //     </div>
                // </Col>
                }
            </Row>


        </Grid>

                <Dialog
                    fullWidth={this.props.fullScreen}
                    TransitionComponent={Zoom}
                    open={this.props.userInfos.loginInfos.safetyCodeStatu}
                    onClose={()=>this.props.setLoginInfos({safetyCodeStatu:false})}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title"><FormattedMessage
                        id="Please type the random code"
                    /></DialogTitle>
                    <DialogContent>
                        <div className="dialog-content">
<Row>
                            <Col  xs={7} sm={7}>
                                <FormControl className={classes.margin} fullWidth>
                                    <InputLabel
                                        FormLabelClasses={{
            root: classes.cssLabel,
            focused: classes.cssFocused,
          }}
                                        htmlFor="username"
                                    >
                                        <FormattedMessage
                                            id="Random Code"
                                        />
                                    </InputLabel>
                                    <Input value={this.state.randomValue} onChange={(e)=>this.handleRandomChange(e)} error={this.state.randomError}
                                           classes={{
                                             root: classes.cssInput,
            underline: classes.cssUnderline,
          }}
                                           id="username"
                                    />
                                    {this.state.randomError&&(<FormHelperText error={this.state.randomError} id="random-error-text"><FormattedMessage
                                        id="RANDOM NOT NULL"
                                    /></FormHelperText>)}
                                </FormControl>

                            </Col>
                            <Col  xs={5} sm={5}>
                                <img onClick={()=>this.props.refreshRandomImage()} style={{width:'100%'}} src={this.props.userInfos.loginInfos.safetyCodeImg}/>

                            </Col>

</Row>
                            </div>

                    </DialogContent>
                    <DialogActions>
                        <Button size="small" onClick={()=>{this.setState({randomError:false,randomValue:''});this.props.setLoginInfos({safetyCodeStatu:false})}} color="primary">
                            <FormattedMessage
                                id="CANCEL"
                            />
                        </Button>
                        <Button size="small" variant="contained" onClick={()=>this.accessPhoneCode()} color="primary">
                            <FormattedMessage
                                id="Ok"
                            />
                        </Button>
                    </DialogActions>
                </Dialog>
                </div>

        );
    }

}

const mapStateToProps = (state, props) => {

    return {
        userInfos: state.userInfos
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        toShowCode:(value) => dispatch(toShowCode(value)),
        setLoginInfos:(infos)=>dispatch(setLoginInfos(infos)),
        refreshRandomImage:()=>dispatch(refreshRandomImage()),
        checkPhoneNum:(phone,randomCode)=>dispatch(checkPhoneNum(phone,randomCode)),
        userLogin:(name,password,vcode,mode,isAuthLogin=false,origianlUrl)=>dispatch(userLogin(name,password,vcode,mode,isAuthLogin,origianlUrl)),
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withMobileDialog()(injectIntl(Login))));