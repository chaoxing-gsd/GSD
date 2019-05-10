/**
 * Created by Aaron on 2018/6/21.
 */
import React, {Component} from 'react'
import PropTypes from 'prop-types'

import {UserProfile, GearConfig} from '../sys'
import {Navbar, NavItem, Nav} from 'react-bootstrap';
import Drawer from '@material-ui/core/Drawer';
import {Glyphicon} from 'react-bootstrap';
import {injectIntl, intlShape, FormattedMessage} from 'react-intl';
import {connect} from 'react-redux'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

import {PreImage} from '../plugins'
import HistoryButtons from "./HistoryButtons";
import {getUserLanguageTag} from '../../utils/utils'
import {withStyles} from '@material-ui/core/styles';
import {setToolMode} from "../../actions"

import {browserHistory} from 'react-router'
import Button from '@material-ui/core/Button';

const styles = theme => ({
    toolBtn: {
        fontSize:'12px',
        backgroundColor: "#8c1515",
        '&:hover': {
            color: "#ffffff",
            backgroundColor: "#5f1212"
        },
        color: "#484848",
        backgroundColor: "#ffffff"
    },
    backBtn: {
       
        textAlign:"center",
        width: '35px',
        height: '35px',
        color:"#ffffff"
    }
});
class Header extends Component {
    static propTypes = {
        wrapperStyle: PropTypes.object,
        intl: intlShape.isRequired,
        hideSearchInput:PropTypes.bool

    }

    constructor(props) {
        super(props);
        this.state = {openDrawer: false,dialogOpen:false};

    }

    toggleToolMode(){
        console.log(this.props.location.pathname);
        const toolMode=this.props.userInfos.showToolsMode;
        this.props.setToolMode(!toolMode);
    }
    goBack(){
        history.go(-1);
    }

    render() {
        const locale=getUserLanguageTag();
        const {classes}=this.props;
        const altHolder = this.props.intl.formatMessage({id: 'PROJECT_NAME'});

        const pathName=this.props.location.pathname;
        const sideList = (
            <div>

                <List>
                    <ListItem >
                        <UserProfile onDialogToggle={(statu)=>this.setState({dialogOpen:statu})}/>
                    </ListItem>
                    <ListItem >
                        <GearConfig onDialogToggle={(statu)=>this.setState({dialogOpen:statu})}/>
                    </ListItem>
                    {this.props.userInfos.isLogined&&<ListItem >
                        <HistoryButtons drawerStyle onDialogToggle={(statu)=>this.setState({dialogOpen:statu})}/>
                    </ListItem>}
                    {(pathName == '/search') && <ListItem >
                        <Button variant="contained" size="small" color="default" onClick={()=>this.toggleToolMode()}
                                className={classes.toolBtn}>
                            {!this.props.userInfos.showToolsMode ? <FormattedMessage id="Show Tools"/> :
                                <FormattedMessage id="Hide Tools"/>}
                        </Button>
                    </ListItem>
                    }
                </List>
            </div>
        );

        return (
            <div>

                <Navbar collapseOnSelect  className="gsd-result-nav">
                    <Navbar.Header className="result-header">
                        <Navbar.Brand >
                            <a href="/"> <PreImage alt={altHolder} width="179px" wrapperStyle={{marginTop:'-8px'}} height="36px" src={locale=='en'?"/sourceImages/logo_en_white.png":"/sourceImages/logo.png"}/></a>
                        </Navbar.Brand>


                    </Navbar.Header>
                    <Nav>
                       
                        <NavItem className="toggleBtnNav">

                            {

                            //     <div className="search-area"> <span className="backBtnSpan"><IconButton className={classes.backBtn}  color="inherit" onClick={()=>this.goBack()} aria-label="Close">
                            //     <Glyphicon glyph="menu-left"/>
                            // </IconButton></span>{!this.props.hideSearchInput&&<SearchInput small location={this.props.location} initValue={this.props.location.query.searchValue||this.props.searchResult.searchTitle||""}/>}
                            //     {!this.props.hideSearchInput&&<HistoryButtons searchValue={this.props.location.query.searchValue||this.props.searchResult.searchTitle||""}/>}
                            //    </div>
                            }


                            <button onClick={()=>this.setState({openDrawer:true})} type="button" className="navbar-toggle result-page result-header-button"><span
                            ></span><span className="icon-bar"></span><span
                                className="icon-bar"></span><span className="icon-bar"></span></button>
                            </NavItem>

                        </Nav>
                    <Navbar.Collapse>
                        <Nav pullRight>
                            <NavItem>
                                <UserProfile reverse={true}/>
                            </NavItem>
                            <NavItem>
                                <GearConfig reverse={true}/>
                            </NavItem>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
                <Drawer anchor="right" variant={this.state.dialogOpen?"permanent":"temporary"}   open={this.state.openDrawer} onClose={()=>this.setState({openDrawer:false})}>
                    <div
                        tabIndex={0}
                        role="button"
                        onClick={()=>this.setState({openDrawer:false})}
                        onKeyDown={()=>this.setState({openDrawer:false})}
                    >
                        {sideList}
                    </div>
                </Drawer>
            </div>

        );
    }
}

const mapStateToProps = (state, props) => {

    return {
        userInfos:state.userInfos,
        searchResult:state.searchResult,
    }
}


const mapDispatchToProps = (dispatch, props) => {
    return {
        setToolMode:(mode)=>dispatch(setToolMode(mode))

    }
}



export default connect(mapStateToProps,mapDispatchToProps)(injectIntl(withStyles(styles)(Header)));
