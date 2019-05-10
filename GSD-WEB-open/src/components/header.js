/**
 * Created by Aaron on 2018/6/21.
 */
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import '../assets/styles/plugins.css'
import {UserProfile, GearConfig} from './sys'
import {Navbar, NavItem, Nav} from 'react-bootstrap';
import Drawer from '@material-ui/core/Drawer';
import {injectIntl, intlShape, FormattedMessage} from 'react-intl';
import {connect} from 'react-redux'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

import {PreImage} from './plugins'
class Header extends Component {
  static propTypes = {
    wrapperStyle: PropTypes.object,
    intl: intlShape.isRequired

  }

  constructor(props) {
    super(props);
    this.state = {openDrawer: false,dialogOpen:false};

  }


  render() {
    const altHolder = this.props.intl.formatMessage({id: 'PROJECT_NAME'});
    const sideList = (
        <div>

          <List>
            <ListItem >
              <UserProfile onDialogToggle={(statu)=>this.setState({dialogOpen:statu})}/>
            </ListItem>
            <ListItem >
              <GearConfig onDialogToggle={(statu)=>this.setState({dialogOpen:statu})}/>
            </ListItem>
          </List>
        </div>
    );

    return (
        <div>
          <Navbar collapseOnSelect  className="gsd-result-nav">
            <Navbar.Header className="result-header">
              <Navbar.Brand >
                <a href="/"> <PreImage alt={altHolder} width="179px" wrapperStyle={{marginTop:'-8px'}} height="36px" src="/sourceImages/logo.png"/></a>
              </Navbar.Brand>


            </Navbar.Header>
            <Nav>
              <NavItem className="toggleBtnNav">

                <button onClick={()=>this.setState({openDrawer:true})} type="button" className="navbar-toggle result-page"><span
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
    userInfos:state.userInfos
  }
}




export default connect(mapStateToProps)(injectIntl(Header));
