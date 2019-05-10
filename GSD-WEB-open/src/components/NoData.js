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



class NoData extends Component {
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
        <div style={{textAlign:"center",width:'100%'}}>


                <img src="/sourceImages/no_data.png" style={{width:'300px',margin:'0 auto',display:'block',marginTop:"40px"}}/>
                <h4 style={{color:"rgb(107, 105, 105)",textAlign:"center",margin:"15px 0"}}>{!!this.props.msg?this.props.msg:<FormattedMessage id="NO_DATA"/>}</h4>

        
        </div>
    );
  }

}
export default withStyles(styles)(NoData)
