import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {Grid, Row, Col} from 'react-bootstrap'
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import {FormattedMessage} from 'react-intl';
import Button from '@material-ui/core/Button';
const styles = theme => ({
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



class NotFoundPage extends Component {
  static propTypes={
    classes: PropTypes.object.isRequired
  }
  constructor(props) {
    super(props);
    this.state={wikiHtml:null}
  }


  componentDidMount(){

  }

  render() {
    const { classes } = this.props;
    return (
        <div>
          <style type="text/css">{`
    body{

    background-color: #37465d!important;

    }
    `}</style>
          <Grid>
            <Row>
              <Col xs={12}>
                <img src="/sourceImages/404.png" style={{width:'100%',maxWidth:'400px',margin:'0 auto',display:'block',marginTop:"40px"}}/>
                <h4 style={{color:"#ffffff",textAlign:"center",margin:"50px 0"}}><FormattedMessage id="404_ERROR"/></h4>
                
                <div style={{textAlign:"center"}}><Button component="a" href="/" variant="contained" className={classes.btn}><FormattedMessage id="BACK_TO_HOME"/></Button></div>
              </Col>
            </Row>
          </Grid>
        </div>
    );
  }

}
export default withStyles(styles)(NotFoundPage)
