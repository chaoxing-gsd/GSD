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
import {isMobile,isEmail,checkPassComplex} from "../../utils/utils";
import {isExistPhoe,toShowCode4Register,setRegisterInfos,refreshRandomImage,checkPhoneNum,userRegister} from "../../actions";
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


class Register extends Component {
    static propTypes = {
        fullScreen: PropTypes.bool.isRequired,
        intl: intlShape.isRequired,
    }


    constructor(props) {
        super(props);
        this.timeCountIntervalId=null;
        this.state = {timeCount:60,showQrcode: false,nameFormatError:false,passwordComplexError:false,passMatchError:false,rePasswordError:false,rePasswordValue:'',passwordError:false,passwordValue:'',personNameValueError:false,personNameValue:'',nameValueError:false,nameValue:'',codeValue:'',codeError:false,randomValue:'',randomError:false};

    }

    toRegister(){
        if(!this.state.nameValue){
            this.setState({nameValueError:true});
            return;
        }
        if(this.props.userInfos.registerInfos.isExistPhoe){
            return;
        }
        if(!isEmail(this.state.nameValue)&&!isMobile(this.state.nameValue)){
            this.setState({nameFormatError:true});
            return;
        }
        if(!this.state.codeValue){
            this.setState({codeError:true});
            return;
        }
        if(!this.state.personNameValue){
            this.setState({personNameValueError:true});
            return;
        }
        if(!this.state.passwordValue){
            this.setState({passwordError:true});
            return;
        }
        if(checkPassComplex(this.state.passwordValue)<2){
            this.setState({passwordComplexError:true});
            return;
        }
        if(!this.state.rePasswordValue){
            this.setState({rePasswordError:true});
            return;
        }
        if(this.state.passwordValue!=this.state.rePasswordValue){
            this.setState({passMatchError:true});
            return;
        }

        this.props.userRegister(this.state.nameValue,this.state.passwordValue,this.state.personNameValue,this.state.codeValue);

    }


    componentDidMount() {
        document.title=this.props.intl.formatMessage({id: 'REGISTER'})+"-"+this.props.intl.formatMessage({id: 'PROJECT_NAME'});
    }



    handlePasswordChange(e){//密码输入
        var complexFlag=false;
        if(checkPassComplex(e.target.value.trim())<2){
            complexFlag=true;
        }
        this.setState({ passwordValue: e.target.value.trim(),passwordError:!e.target.value.trim(),passwordComplexError:complexFlag });

    }
    handleRePasswordChange(e){//密码输入
        this.setState({ rePasswordValue: e.target.value.trim(),rePasswordError:!e.target.value.trim(),passMatchError:e.target.value.trim()!=this.state.passwordValue.trim() });
    }

    handleVCodeChange(e){//验证码输入
        this.setState({ codeValue: e.target.value.trim(),codeError:!e.target.value.trim() });
    }

    handleNameChange(e){//用户名输入
        var formatError=false;
        if(!!e.target.value.trim()&&!isEmail(this.state.nameValue)&&!isMobile(this.state.nameValue)){
            formatError=true;
        }
        this.setState({ nameValue: e.target.value.trim(),nameValueError:!e.target.value.trim(),nameFormatError:formatError });

    }
    onUnfocus(){
        var formatError=false;
        if(!!this.state.nameValue.trim()&&!isEmail(this.state.nameValue)&&!isMobile(this.state.nameValue)){
            formatError=true;
        }
        this.setState({ nameFormatError:formatError });
        if(!!this.state.nameValue.trim()&&(isEmail(this.state.nameValue)||isMobile(this.state.nameValue)))this.props.isExistPhoe(this.state.nameValue);
    }
    handlePersonNameChange(e){//用户名输入
        this.setState({ personNameValue: e.target.value.trim(),personNameValueError:!e.target.value.trim() });
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
                this.props.setRegisterInfos({watingForCode:false,accessCodeStatu:false});
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

    getIdentifyCode(){//获取手机验证码
        if(!!this.state.nameValue){
            if(isMobile(this.state.nameValue)){//为手机号
                this.props.toShowCode4Register(this.state.nameValue);

            }else if(isEmail(this.state.nameValue)){
                this.props.isExistPhoe(this.state.nameValue,null,true);
            }else{
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
        this.setState({randomValue:''});
        this.props.checkPhoneNum(this.state.nameValue,randomValue)
    }
    showQrcode(){
        this.setState({showQrcode:true})
    }
    render() {
        const {classes} = this.props;

        return (
            <div className={this.state.showQrcode?"":"hideQrcode"}>
                <Grid >
                    <Row>
                        <Col className="login-dialog" xs={12} sm={5} smPush={1}>

                            <Card className={classes.card}>
                                <LinearProgress style={{visibility:this.props.userInfos.registerInfos.isAccessing?"visible":"hidden"}} />
                                <CardContent>
                                    <h1 className="login-logo">GSD</h1>
                                    <h1 className="login-title"><FormattedMessage
                                        id="REGISTER"
                                    /></h1>

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
                                                            id="EMAIL/PHONE"
                                                        />
                                                    </InputLabel>
                                                    <Input value={this.state.nameValue} onBlur={()=>this.onUnfocus()} onFocus={()=>this.onUnfocus()} onChange={(e)=>this.handleNameChange(e)} error={this.state.nameValueError||this.props.userInfos.registerInfos.isExistPhoe||this.state.nameFormatError}
                                                           classes={{
                                             root: classes.cssInput,
            underline: classes.cssUnderline,
          }}
                                                           id="username"
                                                    />
                                                    {this.state.nameValueError&&(<FormHelperText error={this.state.nameValueError} id="name-error-text"><FormattedMessage
                                                        id="NAME NOT NULL"
                                                    /></FormHelperText>)}
                                                    {this.props.userInfos.registerInfos.isExistPhoe&&(<FormHelperText error={this.props.userInfos.registerInfos.isExistPhoe} id="vcode-error-text1"><FormattedMessage
                                                        id="PHONE_EXIST"
                                                    /></FormHelperText>)}
                                                    {this.state.nameFormatError&&(<FormHelperText error={this.state.nameFormatError} id="name-error-text"><FormattedMessage
                                                        id="USERNAME/EMAIL/PHONE Error"
                                                    /></FormHelperText>)}
                                                </FormControl>

                                            </div>

                                            <div  style={{marginTop:'25px'}}>
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
                                                    <Input value={this.state.codeValue} onChange={(e)=>this.handleVCodeChange(e)} error={this.state.codeError} type="password"
                                                           classes={{
            underline: classes.cssUnderline,
          }}
                                                           id="Verification_Code"
                                                           endAdornment={
              <InputAdornment position="end">
                <Button color="primary" size="small" onClick={()=>this.getIdentifyCode()} disabled={this.props.userInfos.registerInfos.accessCodeStatu||this.props.userInfos.registerInfos.watingForCode} variant="contained" className={classes.buttonCode} >
                <small>{!this.props.userInfos.registerInfos.watingForCode?<FormattedMessage
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
                                            </div>




                                            <div style={{marginTop:'25px'}}>

                                                <FormControl className={classes.margin} fullWidth>
                                                    <InputLabel
                                                        FormLabelClasses={{
            root: classes.cssLabel,
            focused: classes.cssFocused,
          }}
                                                        htmlFor="realname"
                                                    >
                                                        <FormattedMessage
                                                            id="PERSON_NAME"
                                                        />
                                                    </InputLabel>
                                                    <Input value={this.state.personNameValue} onChange={(e)=>this.handlePersonNameChange(e)} error={this.state.personNameValueError}
                                                           classes={{
                                             root: classes.cssInput,
            underline: classes.cssUnderline,
          }}
                                                           id="realname"
                                                    />
                                                    {this.state.personNameValueError&&(<FormHelperText error={this.state.personNameValueError} id="name-error-text"><FormattedMessage
                                                        id="NAME NOT NULL"
                                                    /></FormHelperText>)}

                                                </FormControl>

                                            </div>

                                            {<div style={{marginTop:'25px'}}>
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
                                                    <Input value={this.state.passwordValue} onChange={(e)=>this.handlePasswordChange(e)} error={this.state.passwordError||this.state.passwordComplexError} type="password"
                                                           classes={{
            underline: classes.cssUnderline,
          }}
                                                           id="password"
                                                    />
                                                    {this.state.passwordError&&(<FormHelperText error={this.state.passwordError} id="password-error-text"><FormattedMessage
                                                        id="PASSWORD NOT NULL"
                                                    /></FormHelperText>)}
                                                    {this.state.passwordComplexError&&(<FormHelperText error={this.state.passwordComplexError} id="password-error-complex-text"><FormattedMessage
                                                        id="PASSWORD COMPLEX ERROR"
                                                    /></FormHelperText>)}
                                                </FormControl>



                                            </div>}


                                            {<div style={{marginTop:'25px'}}>
                                                <FormControl className={classes.margin} fullWidth>
                                                    <InputLabel
                                                        FormLabelClasses={{
            root: classes.cssLabel,
            focused: classes.cssFocused,
            error:classes.cssLabelError
          }}
                                                        htmlFor="repassword"
                                                    >
                                                        <FormattedMessage
                                                            id="RE_PASSWORD"
                                                        />
                                                    </InputLabel>
                                                    <Input value={this.state.rePasswordValue} onChange={(e)=>this.handleRePasswordChange(e)} error={this.state.rePasswordError} type="password"
                                                           classes={{
            underline: classes.cssUnderline,
          }}
                                                           id="repassword"
                                                    />
                                                    {this.state.rePasswordError&&(<FormHelperText error={this.state.rePasswordError} id="repassword-error-text"><FormattedMessage
                                                        id="RE_PASSWORD NOT NULL"
                                                    /></FormHelperText>)}
                                                    {this.state.passMatchError&&(<FormHelperText error={this.state.passMatchError} id="repassword-match-error-text"><FormattedMessage
                                                        id="RE_PASSWORD NOT MATCH"
                                                    /></FormHelperText>)}
                                                    
                                                </FormControl>



                                            </div>}

                                        </div>
                                    </div>



                                </CardContent>
                                <CardActions>

                                    <div style={{width:'100%',display:'block',marginTop:'15px'}}>

                                        <Button disabled={this.props.userInfos.registerInfos.isAccessing} onClick={()=>this.toRegister()}  variant="contained" fullWidth size="large" color="primary" className={classes.buttonOk}>
                                            <FormattedMessage
                                                id="REGISTER"
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
                    </Row>


                </Grid>

                <Dialog
                    fullWidth={this.props.fullScreen}
                    TransitionComponent={Zoom}
                    open={this.props.userInfos.registerInfos.safetyCodeStatu}
                    onClose={()=>this.props.setRegisterInfos({safetyCodeStatu:false})}
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
                                    <img onClick={()=>this.props.refreshRandomImage()} style={{width:'100%'}} src={this.props.userInfos.registerInfos.safetyCodeImg}/>

                                </Col>

                            </Row>
                        </div>

                    </DialogContent>
                    <DialogActions>
                        <Button size="small" onClick={()=>this.props.setRegisterInfos({safetyCodeStatu:false,watingForCode:false})} color="primary">
                            <FormattedMessage
                                id="CANCEL"
                            />
                        </Button>
                        <Button size="small" variant="contained" onClick={()=>this.props.isExistPhoe(this.state.nameValue,this.state.randomValue,true)} color="primary">
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
        isExistPhoe:(value,randomeCode,getCodeFlag) => dispatch(isExistPhoe(value,randomeCode,getCodeFlag)),
        toShowCode4Register:(value) => dispatch(toShowCode4Register(value)),
        setRegisterInfos:(infos)=>dispatch(setRegisterInfos(infos)),
        refreshRandomImage:()=>dispatch(refreshRandomImage()),
        checkPhoneNum:(phone,randomCode)=>dispatch(checkPhoneNum(phone,randomCode)),
        userRegister:(username,password,realName,vcode)=>dispatch(userRegister(username,password,realName,vcode)),
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withMobileDialog()(injectIntl(Register))));