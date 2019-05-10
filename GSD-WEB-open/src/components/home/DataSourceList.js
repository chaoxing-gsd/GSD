/**
 * Created by Aaron on 2018/6/22.
 */
import React, { Component } from 'react'

import {Grid, Row, Col, Modal, Button, Panel} from 'react-bootstrap';
import Slider from "react-slick";
import {FormattedMessage} from 'react-intl';
import {PreImage} from '../plugins'
import {withStyles} from '@material-ui/core/styles';
import {checkIsMobile} from "../../utils/utils"
import { browserHistory } from 'react-router'
import { Tooltip } from 'antd';

// const imageList=[
//     {src:"/sourceImages/data_01.gif",label:<FormattedMessage
//         id="CHAOXING_LIB"
//     />,link:"/wiki/2008001"},
//     {src:"/sourceImages/data_02.gif",label:<FormattedMessage
//         id="CBDB"
//         />,link:"/wiki/2008002"},
//     {src:"/sourceImages/data_03.gif",label:<FormattedMessage
//         id="CTEXT"
//     />,link:"/wiki/2008003"},
//     {src:"/sourceImages/data_09.gif",label:<FormattedMessage
//         id="DDBC"
//     />,link:"/wiki/2008004"},
//     {src:"/sourceImages/data_04.gif",label:<FormattedMessage
//         id="DACHENG"
//     />,link:"/wiki/2008005"},
//     {src:"/sourceImages/data_06.gif",label:<FormattedMessage
//         id="CBB"
//     />,link:"/wiki/2008006"},
//
//     {src:"/sourceImages/data_07.gif",label:<FormattedMessage
//         id="CHAOXING_MAGAZINE"
//     />,link:"/wiki/2008007"},
//     {src:"/sourceImages/data_05.gif",label:<FormattedMessage
//         id="NEWSPAPER_DATA"
//     />,link:"/wiki/2008008"},
//     {src:"/sourceImages/data_08.gif",label:<FormattedMessage
//         id="HISTORICAL_DATA"
//     />,link:"/wiki/2008009"},
//
//     {src:"/sourceImages/data_01.gif",label:<FormattedMessage
//         id="DNB"
//     />,link:"/wiki/2008020"},
//     {src:"/sourceImages/more_icon.gif",label:<FormattedMessage
//         id="MORE"
//     />,link:"/wikiList"}
// ];

const imageList=[
 
    {src:"/sourceImages/data_02.gif",label:<FormattedMessage
        id="biogref_cbdb"
    />,link:"http://gsd.chaoxing.com/index.php?title=%E4%B8%AD%E5%9B%BD%E5%8E%86%E4%BB%A3%E4%BA%BA%E7%89%A9%E4%BC%A0%E8%AE%B0%E8%B5%84%E6%96%99"},
    {src:"/sourceImages/dnb_icon.png",label:<FormattedMessage
        id="biogref_dnb"
    />,link:"http://gsd.chaoxing.com/index.php?title=%E4%BA%BA%E7%89%A9%E4%BC%A0%E8%AE%B0%E6%95%B0%E6%8D%AE%E5%BA%93"},
    {src:"/sourceImages/cbta_icon.png",label:<FormattedMessage
        id="textref_cbta"
    />,link:"http://gsd.chaoxing.com/index.php?title=%E4%B8%AD%E5%8D%8E%E7%94%B5%E5%AD%90%E4%BD%9B%E5%85%B8"},
    {src:"/sourceImages/data_03.gif",label:<FormattedMessage
        id="textref_ctext"
    />,link:"http://gsd.chaoxing.com/index.php?title=%E4%B8%AD%E5%9B%BD%E5%93%B2%E5%AD%A6%E4%B9%A6%E7%94%B5%E5%AD%90%E5%8C%96%E8%AE%A1%E5%88%92"},
    {src:"/sourceImages/data_09.gif",label:<FormattedMessage
        id="biogref_ddbc"
    />,link:"http://gsd.chaoxing.com/index.php?title=%E4%BD%9B%E5%AD%A6%E8%A7%84%E8%8C%83%E8%B5%84%E6%96%99%E5%BA%93"},
    {src:"/sourceImages/textref_kanripo_icon.png",label:<FormattedMessage
        id="textref_kanripo"
    />,link:"http://gsd.chaoxing.com/index.php?title=%E6%97%A5%E6%9C%AC%E6%89%80%E8%97%8F%E4%B8%AD%E6%96%87%E5%8F%A4%E7%B1%8D%E6%95%B0%E6%8D%AE%E5%BA%93"},
    {src:"/sourceImages/textref_zhonghuajingdian_logo.png",label:<FormattedMessage
        id="textref_zhonghuajingdian"
    />,link:"http://gsd.chaoxing.com/index.php?title=%E4%B8%AD%E5%8D%8E%E7%BB%8F%E5%85%B8%E5%8F%A4%E7%B1%8D%E5%BA%93"},
    
    // {src:"/sourceImages/data_05.gif",label:<FormattedMessage
    //     id="CHAOXING_MAGAZINE"
    // />,link:"http://gsd.chaoxing.com/index.php?title=%E8%B6%85%E6%98%9F%E6%9C%9F%E5%88%8A"},
    {src:"/sourceImages/more.png",label:<FormattedMessage
        id="MORE"
    />,link:"/wikiList"},
];

const styles = theme => ({

    popper:{

        display:"none",

    }

});


class DataSourceList extends Component {


    componentDidMount(){

    }


    render() {

        const {classes} = this.props;
        var settings = {
            arrows: true,
            dots: true,
            infinite: false,
            speed: 500,
            slidesToShow: checkIsMobile()?3:6,
            slidesToScroll: checkIsMobile()?3:6
        };

        return (


            <div className="whiteBg">
                <Grid>
                    <Row>
                        <Col xs={12} sm={12}>

                            <h4 className="home-title"><FormattedMessage
                                id="DATA_SOURCE"
                            /></h4>
                            <div style={{marginTop:'30px'}}>

                            <Slider {...settings}>
                                {imageList.map((item,index)=>checkIsMobile()?(<div   key={`key_${item.label}`}>

                                    <div className="data-icons">
                                        <a href={item.link} target="_blank"><PreImage  width="100%" height="100%" src={item.src}/></a>
                                        <div  className="dataLabel">    <a style={{color:"#666666",fontSize:"1rem"}} href={item.link} target="_blank"> <span>{item.label}</span>  </a></div>
                                    </div>

                                </div>):(
                                    <Tooltip  key={`tip_${item.label}`} classes={{popper:classes.popper}} id="tooltip-bottom" title={item.label}  placement="bottom">
                                    <div   key={`key_${item.label}`}>

                                        <div className="data-icons">
                                        <a href={item.link} target="_blank"><PreImage  width="100%" height="100%" src={item.src}/></a>
                                        <div  className="dataLabel">    <a style={{color:"#666666",fontSize:"1rem"}} href={item.link} target="_blank"> <span>{item.label}</span>  </a></div>
                                            </div>

                                    </div>
                                        </Tooltip>))
                                }


                            </Slider>
                                </div>



                        </Col>
                    </Row>

                </Grid>


            </div>

        );
    }
}

export default withStyles(styles)(DataSourceList)