/**
 * Created by Aaron on 2018/6/22.
 */
import React, { Component } from 'react'
import {FormattedMessage} from 'react-intl';

import {Grid, Row, Col, Modal, Button, Panel} from 'react-bootstrap';


const SupportListData=[
    {name:<FormattedMessage
        id="Harvard University"
    />,icon:"/sourceImages/group_icon01.gif",link:"https://www.harvard.edu"},
    {name:<FormattedMessage
        id="Standford University"
    />,icon:"/sourceImages/group_icon02.gif",link:"https://www.stanford.edu"},
    {name:<FormattedMessage
        id="National Library of China"
    />,icon:"/sourceImages/group_icon05.gif",link:"http://mylib.nlc.cn"},
    {name:<FormattedMessage
        id="National Taiwan University"
    />,icon:"/sourceImages/group_icon10.gif",link:"https://www.ntu.edu.tw/"},
    {name:<FormattedMessage
        id="National Library"
    />,icon:"/sourceImages/group_icon07.gif",link:"https://www.lib.ncu.edu.tw"},
    {name:<FormattedMessage
        id="Peking University Library"
    />,icon:"/sourceImages/group_icon08.gif",link:"http://www.lib.pku.edu.cn/portal/"},

    {name:<FormattedMessage
        id="ZheJiang University Library"
    />,icon:"/sourceImages/group_icon09.gif",link:"http://libweb.zju.edu.cn/libweb/"},

    {name:<FormattedMessage
        id="The University of Tokyo"
    />,icon:"/sourceImages/group_icon04.gif",link:"https://www.u-tokyo.ac.jp/ja/index.html"},

    {name:<FormattedMessage
        id="Kyoto University"
    />,icon:"/sourceImages/group_icon03.gif",link:"https://www.kyoto-u.ac.jp/en/"},


    {name:<FormattedMessage
        id="MPG"
    />,icon:"/sourceImages/mpg_icon.gif",link:"https://www.mpg.de/de"},

    {name:<FormattedMessage
        id="Shanghai Library"
    />,icon:"/sourceImages/group_icon06.gif",link:"http://www.library.sh.cn"}



];

class SupportList extends Component {



    render() {
        return (
            <div className="grayBg">
                <Grid>

                    <Row>
                        <Col xs={12} sm={12}>

                            <h4 className="home-title"><FormattedMessage
                                id="CO_ORGANIZER"
                            /></h4>
                        </Col>
                    </Row>

                    <Row style={{marginTop:'15px'}}>

                        {SupportListData.map((item,index)=>{
                            return (<Col xs={6} sm={4} md={3} key={index}>
                                <div className="co-item">
                                    <img src={item.icon}/>
                                <span className="desc"> <a href={item.link} target="_blank">{item.name}</a></span>
                                </div>

                            </Col>)

                        })}



                    </Row>

                </Grid>
            </div>

        );
    }
}

export default SupportList