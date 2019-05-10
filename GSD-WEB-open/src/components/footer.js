import React, { Component } from 'react'
import {FormattedMessage} from 'react-intl';

class Footer extends Component {
  


  render() {
    return (
        <div className="footer" style={{marginBottom:'0px',marginTop:'30px',paddingTop:"30px",paddingBottom:"30px",backgroundColor: "#37465d"}}>
          <div className="container" style={{textAlign:"center",color:'rgb(183, 183, 183)'}}>
            <a style={{color:'rgb(183, 183, 183)'}} href="/contact"><FormattedMessage id="Contact Us"/></a>
            &nbsp;|&nbsp;<p  style={{textAlign: 'center',color: "#b7b7b7",display:"inline-block"}}>©2018 京ICP备10040544 京公网安备 1101082021885号 网络视听许可证0110438</p>
            </div>

      </div>
    );
  }
}

export default Footer