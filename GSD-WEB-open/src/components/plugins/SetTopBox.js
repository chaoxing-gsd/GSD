/**
 * Created by Aaron on 2018/6/20.
 */
import React, { Component } from 'react'

class SetTopBox extends Component {

    constructor(props) {
        super(props);
        this.state = { visible:false };
        this.handleScroll = this.handleScroll.bind(this);
    }




    handleScroll(){
        var top = document.body.scrollTop || document.documentElement.scrollTop || window.pageYOffset;
        console.log(top);
        if(top>200){
            this.setState({visible:true});
        }else{
            this.setState({visible:false});
        }
    }
    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    
    render() {


        return (
            <div>

                
                <div style={{display:this.state.visible?"block":'none'}} className="static-icon-box" onClick={()=>{window.scrollTo(0, 0)}}>
                    <i className="glyphicon glyphicon-menu-up"> </i>
                </div>

                {
                    // <a className="static-icon-box contact" href="/contact" target="_blank">
                    //     <i className="glyphicon glyphicon-send"> </i>
                    // </a>
                }

                {
                    // <a className="static-icon-box plugins" href="/plugins" target="_blank">
                    //     <i className="fa fa-plug"> </i>
                    // </a>
                }

                </div>

        );
    }
}

export default SetTopBox