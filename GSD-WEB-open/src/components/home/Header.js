/**
 * Created by Aaron on 2018/6/21.
 */
import React, {Component} from 'react'
import PropTypes from 'prop-types'

import {UserProfile, GearConfig} from '../sys'
import {Navbar, NavItem, Nav} from 'react-bootstrap';
import Drawer from '@material-ui/core/Drawer';
import {connect} from 'react-redux'
import {injectIntl, intlShape, FormattedMessage} from 'react-intl';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import HistoryButtons from "../result/HistoryButtons";
import {withStyles} from '@material-ui/core/styles';
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
    }
});


class Header extends Component {
    static propTypes = {
        wrapperStyle: PropTypes.object

    }

    constructor(props) {
        super(props);
        this.state = {openDrawer: false,dialogOpen:false};

    }


    render() {
        const {classes}=this.props;
        const sideList = (
            <div>

                <List>
                    <ListItem >
                        <UserProfile onDialogToggle={(statu)=>this.setState({dialogOpen:statu})}/>
                    </ListItem>
                    <ListItem >
                        <GearConfig onDialogToggle={(statu)=>this.setState({dialogOpen:statu})}/>
                    </ListItem>
                    <ListItem >
                        <HistoryButtons drawerStyle onDialogToggle={(statu)=>this.setState({dialogOpen:statu})}/>
                    </ListItem>
                </List>
            </div>
        );

        return (
            <div>
                <style type="text/css">{`
    .nav > li > a:hover{
            color: #8c1515 !important;
    background-color: transparent !important;
    padding-bottom:15px!important;
    }
    `}</style>
                <Navbar collapseOnSelect style={{background:'transparent',border:'none'}}>
                    <Navbar.Header>
                        <button onClick={()=>this.setState({openDrawer:true})} type="button" className="navbar-toggle"><span
                        ></span><span className="icon-bar"></span><span
                            className="icon-bar"></span><span className="icon-bar"></span></button>

                    </Navbar.Header>
                    <Navbar.Collapse>
                        <Nav pullRight>
                            <NavItem>
                                <UserProfile/>
                            </NavItem>
                            <NavItem>
                                <GearConfig/>
                            </NavItem>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
                <Drawer variant="temporary" anchor="right" open={this.state.openDrawer} onClose={()=>this.setState({openDrawer:false})}>
                    <div
                        tabIndex={0}
                        role="button"
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
        userInfos:state.userInfos
    }
}




export default connect(mapStateToProps)(withStyles(styles)(Header));
