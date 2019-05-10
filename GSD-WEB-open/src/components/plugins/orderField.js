/**
 * Created by Aaron on 2018/6/20.
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'



class OrderField extends Component {

    constructor(props) {
        super(props);
        this.state = { orderType:-1 };
    }



    static propTypes = {
        orderType:PropTypes.number,
        handleOrderChange:PropTypes.func,

    }
    componentWillReceiveProps(nextProps) {

        if (nextProps.activityOrderType!=this.state.orderType) {
           this.setState({orderType:nextProps.activityOrderType})
        }
    }


    handleOrder(orderType){
        this.setState({orderType:orderType});
        if(!!this.props.handleOrderChange)this.props.handleOrderChange(orderType);
    }
    
    render() {


        return (
            <div style={{display:'inline-block',verticalAlign:"middle"}}>
                
               <div className="headerTr clearfix" >
                   <span style={{float:'left'}}>{this.props.children}</span>
                   <span style={{display:'inline-block',float:'left',marginLeft:"1px",marginTop:'-2px'}}>
                   <i onClick={()=>this.handleOrder(0)} className={this.state.orderType==0?"glyphicon glyphicon-triangle-top order-icon active":"glyphicon glyphicon-triangle-top order-icon"}></i>
                   <i onClick={()=>this.handleOrder(1)} className={this.state.orderType==1?"glyphicon glyphicon-triangle-bottom order-icon active":"glyphicon glyphicon-triangle-bottom order-icon"}></i></span></div>
                
                </div>

        );
    }
}

export default OrderField