/**
 * Created by Aaron on 2018/6/20.
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Glyphicon} from 'react-bootstrap';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import {withStyles} from '@material-ui/core/styles';
import {setUserInfos} from '../../actions'
import {FormattedMessage} from 'react-intl';
import {setUserLanguage} from '../../utils/utils';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import {fetchUrl} from '../../actions/fetchData';
const options = [
    {value:"auto",label:<FormattedMessage
        id="AUTO"
    />},
    {value:"zh",label:<FormattedMessage
        id="CHINESE"
        />},
    {value:"en",label:<FormattedMessage
        id="ENGLISH"
    />},

];


const styles = theme => ({

    paper: {
        top: "36px!important",
        background:"#40403b"
    },
    menuItem: {
        fontSize: "1rem",
        padding: '0.5rem 1rem',
        color: "#cacac9",
        backgroundColor: "#40403b",
        '&:hover': {
            color: "#ffffff",
            backgroundColor: "#292828"
        },
        '&:focus': {
            color: "#ffffff",
            backgroundColor: "rgb(212, 95, 95)"
        },
        '&:selected': {
            color: "#ffffff",
            backgroundColor: "rgb(212, 95, 95)"
        },
    },
    menuSelected:{
        color: "#ffffff",
        backgroundColor: "rgb(212, 95, 95)"
    },

    buttonGear: {
        backgroundColor: "transparent",
        fontSize: '12px',
        '&:hover': {
            color: "#8c1515",
            backgroundColor: "transparent"
        },
        color: "#615858",
    },
    buttonGearReverse: {
        fontSize: '12px',
        backgroundColor: "transparent",
        '&:hover': {
            color: "#ffffff",
            backgroundColor: "transparent"
        },
        color: "#c3c3be",
    }
});


const ITEM_HEIGHT = 48;

class GearConfig extends Component {
    static propTypes = {
        style: PropTypes.object,
        width: PropTypes.number,
        background: PropTypes.string,
        reverse:PropTypes.bool

    }


    constructor(props) {
        super(props);
        this.state = {anchorEl: null};

    }

    selectLanguage(option){
        this.setState({ anchorEl: null,openLanguageDialog:false });
        this.props.setUserInfos({language:option.value});
        setUserLanguage(option.value);
        if(!!this.props.onDialogToggle)this.props.onDialogToggle(false);
        // this.getTranslateInfos(option.value);
    }

    getTranslateInfos(locale){//获取翻译信息
        var language=locale;
        setUserLanguage(locale);
        if(locale=='auto'){
            var lang=navigator.language;
            var locale = "en";
            if (lang === "zh" ||lang === "zh-CN"||lang==="zh-TW") {
                locale = "zh";
            }
        }
        return fetchUrl(`/languages/${locale}.json`).then(response => {
            console.log(response);
            this.props.setUserInfos({translations:response,language:language});



        }).catch(error => {


        })
    }

   handleDialogOpen(e){
       this.setState({ anchorEl: e.currentTarget });
       if(!!this.props.onDialogToggle)this.props.onDialogToggle(true);
   }

    renderCompoment(){
        const {style,width,background,userInfos,classes}=this.props;
        const { anchorEl } = this.state;
        const currentLanguage=options.find(v=>v.value==userInfos.language);
        return (<div style={style}> <div onClick={(e)=>this.handleDialogOpen(e)} variant="contained" className={!this.props.reverse?classes.buttonGear:classes.buttonGearReverse} size="small" color="default" >
            <Glyphicon glyph="cog" style={{fontSize:'1rem'}}/>&nbsp;<span>{currentLanguage.label}</span><span className="caret"></span>
        </div>
            <Menu
                id="config-menu"
                anchorEl={anchorEl}
                classes={{paper:classes.paper}}
                open={Boolean(anchorEl)}
                onClose={()=>{this.setState({ anchorEl: null }); if(!!this.props.onDialogToggle)this.props.onDialogToggle(false);}}
                PaperProps={{
            style: {
              maxHeight: ITEM_HEIGHT * 4.5,
              width: 150,
            },
          }}
            >
                {options.map(option => (
                    <MenuItem classes={{selected:classes.menuSelected}} className={classes.menuItem} key={option.value} selected={option.value === userInfos.language} onClick={()=>this.selectLanguage(option)}>
                        {option.label}
                    </MenuItem>
                ))}
            </Menu>
        </div>);
    }

    handleLanguageDialogClose(){
        this.setState({ openLanguageDialog: false });
    }

    renderMobileCompoment(){
        const {style,width,background,userInfos,classes}=this.props;
        const { anchorEl } = this.state;
        const currentLanguage=options.find(v=>v.value==userInfos.language);
        return (<div style={style}> <div onClick={(e)=>this.setState({ openLanguageDialog: true })} variant="contained" className={!this.props.reverse?classes.buttonGear:classes.buttonGearReverse} size="small" color="default" >
            <Glyphicon glyph="cog" style={{fontSize:'1rem!important'}}/>&nbsp;<span>{currentLanguage.label}</span><span className="caret"></span>
        </div>
            <Dialog onClose={()=>this.handleLanguageDialogClose()} a open={this.state.openLanguageDialog}>
                <div>
                    <List>
                        {options.map(option => (
                        <ListItem button key={option.value} selected={option.value === userInfos.language} onClick={()=>this.selectLanguage(option)}>
                            <ListItemText primary={option.label}/>
                        </ListItem>
                        ))}

                    </List>
                </div>
            </Dialog>
        </div>);
    }

    render() {

        return this.renderCompoment();

    }
}



const mapStateToProps = (state, props) => {
    
    return {
        userInfos:state.userInfos
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return { setUserInfos: (infos) => dispatch(setUserInfos(infos)),}
}


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(GearConfig));

