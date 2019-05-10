import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {Grid, Row, Col} from 'react-bootstrap'
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import {FormattedMessage} from 'react-intl';
import Button from '@material-ui/core/Button';
const styles = theme => ({
  root: {
    width: '100%',
    marginTop:"40px",
    backgroundColor: theme.palette.background.paper,
    padding: "15px 20px"
  },
  btn: {
    fontSize:"14px",
  backgroundColor:"#d75f46",
    color:"#ffffff",
    margin:"0 auto",
    '&:hover': {
      backgroundColor: "#ec836d",
      color:"#ffffff",
    },
  },
});



class AuthLoginSuccess extends Component {
  static propTypes={
    classes: PropTypes.object.isRequired
  }
  constructor(props) {
    super(props);
    this.state={wikiHtml:null}
  }

  closeWindow(){
    window.open("about:blank","_top").close()
  }
  componentDidMount(){

  }

  render() {
    const { classes } = this.props;
    return (
        <div>
          <style type="text/css">{`
    body,.footer{



    }
    `}</style>
          <Grid>
            <Row>
              <Col xs={12}>
                <Paper className={classes.root} elevation={1}>
                  <h2 style={{textAlign:"center",color:"#4CAF50"}}><i className="glyphicon glyphicon-ok-sign"></i></h2>
                <h4 style={{textAlign:"center"}}><FormattedMessage id="LOGIN_SUCCESS"/></h4>

                
                <div style={{textAlign:"center",marginTop:'20px'}}><Button onClick={()=>{this.closeWindow()}}  variant="contained" className={classes.btn}><FormattedMessage id="CLOSE_WINDOW"/></Button></div>
                  </Paper>
              </Col>
            </Row>
          </Grid>
        </div>
    );
  }

}
export default withStyles(styles)(AuthLoginSuccess)
