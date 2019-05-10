/**
 * Created by Aaron on 2018/6/20.
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import {checkIsMobile} from "../../utils/utils"

class PreImage extends Component {

    constructor(props) {
        super(props);
        this.state = { imageStatuCode: 0 };
    }

    static propTypes = {
        height: PropTypes.string,
        width: PropTypes.string,
        color: PropTypes.string,
        src: PropTypes.string,
        alt:PropTypes.string,
        wrapperStyle:PropTypes.object,
        onLoaded:PropTypes.func,
        onError:PropTypes.func,
        fullPage:PropTypes.bool

    }


    onLoaded(){
        this.setState({imageStatuCode:1})
        if(!!this.props.onLoaded){
            this.props.onLoaded();
        }
    }

    onError(){
        this.setState({imageStatuCode:-1})
        if(!!this.props.onError){
            this.props.onError();
        }
    }


    render() {
        let {height,width,color,src,alt,wrapperStyle,fullPage}=this.props;
        if(!!fullPage&&checkIsMobile()){
            height='auto';
            width="100%";
        }
       

        return (
            <div  height={height} width={width} style={{height:height,width:width,position:"relative",margin:'0 auto',...wrapperStyle}}>
                {this.state.imageStatuCode==0&&
                <div  height={height} width={width} style={{height:height,width:width,position:"absolute",top:0,left:0,display:'block'}}>
                <SkeletonTheme  color="#e0e0e0" highlightColor="#edecec">
                    {/* <p>
                        <Skeleton  height={height} width={width}/>
                    </p> */}
                </SkeletonTheme>
               </div>}
                {
                    //this.state.imageStatuCode==-1&&<div  height={height} width={width} style={{height:height,width:width,position:"absolute",top:0,left:0,backgroundColor:color||"#e0e0e0",display:'block'}}>{alt}</div>
                }
                {
                     (this.state.imageStatuCode!=-1)&&<img
                        className="wikiImg"
                        height={height}
                        width={width}
                        // style={{background:`url(${src})`}}
                        src={src}
                        alt={alt}
                        onLoad={()=>this.onLoaded()}
                        onError={()=>this.onError()}
                    />
                }
                {
                    (this.state.imageStatuCode==-1)&&<img
                        className="wikiImg"
                        height={height}
                        width={width}
                        src='/sourceImages/default.png'
                    />
                }
                </div>

        );
    }
}

export default PreImage