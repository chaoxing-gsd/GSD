import React, { Component } from 'react'
import FooterComponent from '../components/footer'
import SetTopBox from '../components/plugins/SetTopBox'


class App extends Component {

    constructor(props) {
        super(props);

        this.timer=null;
        this.state = {
            completed: 0,
            showProgress:false
        };
    }

    componentWillReceiveProps(nextProps) {

        window.startProgress();
        
    }


    shouldComponentUpdate(nextProps, nextState) {

        window.doneProgress();

        return nextProps
    }

    render(){
        const {children}=this.props;
        return (
            <div>

                {children}
                <SetTopBox/>
                <FooterComponent />
            </div>
        );
    }
}
// let App = ({ children }) => {
//
// }


export default App
