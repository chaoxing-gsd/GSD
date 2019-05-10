import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Link} from 'react-router';
import { withStyles } from '@material-ui/core/styles';
import fetch from 'isomorphic-fetch'
import {Grid, Row, Col, Modal, Button, Panel} from 'react-bootstrap';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import {injectIntl, intlShape, FormattedMessage} from 'react-intl';

import Paper from '@material-ui/core/Paper';

const styles = theme => ({
    root: {
        ...theme.mixins.gutters(),
        paddingTop: "20px",
        paddingBottom: "30px"
    },
});

const REPEAT_SKELETON=4;

class IframeContainer extends Component {
    static propTypes={
        classes: PropTypes.object.isRequired
    }

    constructor(props) {
        super(props);
        this.state = {
            iFrameHeight: '0px',
            loaded:false
        }

    }

    componentDidMount(){
        //this.fetchHtml();
    }


    fetchHtml(){
        return fetch("http://ss.chaoxing.com/search?sw=%E5%8D%97%E4%BA%AC&x=0_9324", { method: "get",credentials: 'include'})
            .then(response =>{
                if (!response.ok) {
                    return Promise.reject(response.status);
                }
                console.log(response.text);
            }).catch(error => {
                console.log(error);
                return Promise.reject("服务器异常，请稍后再试");
            })
    }

    renderSkeletons(){
        const { classes } = this.props;
        var skeletons=[];
        for(var i=0;i<REPEAT_SKELETON;i++){
            skeletons.push(<Paper className={classes.root} style={{marginTop:i>=0?"25px":""}} elevation={1}>
                <div style={{fontSize: 16, lineHeight: 2}}>
                    <SkeletonTheme  color="#e0e0e0" highlightColor="#edecec">
                        <div style={{width:"30%"}}> <h1> <Skeleton/></h1></div>
                        <Skeleton count={4}/>
                    </SkeletonTheme>
                </div>
            </Paper>);
        }
        return skeletons;
    }


    render() {


        return (
            <div>

                {!this.state.loaded&&<div>{this.renderSkeletons()}</div>  }

                <iframe
                    style={{width:'100%',visibility:this.state.loaded?'visible':'hidden', height:this.state.iFrameHeight, overflow:'visible'}}
                    onLoad={() => {
                    const obj = this.refs.iframe;
                    console.log(this.refs.iframe);
                    console.log(obj.contentWindow)
                    this.setState({
                        loaded:true,
                        "iFrameHeight":  obj.contentWindow.document.body.scrollHeight + 'px'
                    });
                }}
                    ref="iframe"
                    src={this.props.src}
                    width="100%"
                    height={this.state.iFrameHeight}
                    scrolling="no"
                    frameBorder="0"
                    className="iframeResultContainer"
                />

            </div>

        )
    }
}




export default withStyles(styles)(IframeContainer);
