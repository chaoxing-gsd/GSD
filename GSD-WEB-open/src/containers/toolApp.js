import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Glyphicon} from 'react-bootstrap';
import {connect} from 'react-redux';
import {browserHistory} from 'react-router'
import { Drawer,Menu, } from 'antd';
import {FormattedMessage} from 'react-intl';
import {setTextToolInfo} from '../actions';
import {UPLOAD_SERVER_URL} from  "../config/constants";
import {fetchUrl} from '../actions/fetchData';
const CHART_TOOL_MENUS=[
    {id:'menu-01',name:'GISMAP',href:'gisMap'},
    {id:'menu-02',name:'GEOMAP',href:'geoMap'},
    {id:'menu-04',name:'3DFILTERCHART',href:'threedFilterChart'}

];

const TEXT_TOOL_MENUS=[
    {id:'menu-txt-06',name:'WORD_CLOUD',href:'wordCloud'},
    {id:'menu-txt-07',name:'N-gram',href:'ngRam'},
    {id:'menu-txt-01',name:'Text_Similar',href:'similarText'},
    {id:'menu-txt-02',name:'Thesaurus Words',href:'similarWord'},
    {id:'menu-txt-03',name:'KeyWords Picker',href:'keyWords'},
    {id:'menu-txt-04',name:'Part of speech',href:'wordTag'},
    // {id:'menu-txt-05',name:'Reg Text',href:'#'},


];
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

export default function ToolApp(Component) {

    class ToolAppComponent extends React.Component {
        constructor(props) {
            super(props);
            this.state={openList:false}
        }

        uploadTextFile = async(contents)=> {
            if(!!contents&&contents.length>0){
                var fileList=[];
                for(var i=0;i<contents.length;i++){
                    console.log(contents[i]);
                    var formdata = new FormData();
                    var blob = new Blob([JSON.stringify(contents[i])], {type: "text/plain;charset=utf-8"});
                    //var wordStream = URL.createObjectURL(blob);
                    var timestamp = (new Date()).getTime();
                    var fileName = timestamp + ".txt";

                    formdata.append('file', blob, fileName);
                    var response = await fetchUrl(UPLOAD_SERVER_URL + `upload`, "post", formdata, {});
                    if (!!response) {
                        console.log(response);
                        if (response.status == 'success' || response.status == 'exist') {
                            var url = "http://cs.ananas.chaoxing.com/download/" + response.objectid;

                            fileList.push({name:fileName,url:url});


                        }
                    }
                }
                this.props.setTextToolInfo({fileList:fileList});


            }

        }


        componentDidMount() {
            if(!!this.props.location.query&&!!this.props.location.query.t){

                try{
                    var b = new Buffer(decodeURIComponent(this.props.location.query.t), 'base64')
                    var s = b.toString('utf8');
                    var json=JSON.parse(s);
                    if(json.length>1){
                        this.uploadTextFile(json);
                    }else{
                        this.props.setTextToolInfo({content:JSON.stringify(json[0])});
                    }
                }catch(e){

                }
                console.log(s);

            }
        }


        handleClick(e) {
        console.log('click', e);
        }



        render() {
            return (
                <div>
                    <style type="text/css">{`.footer{display:none}`}</style>
                    <Drawer
                        title={<FormattedMessage id="Tool Menus"/>}
                        placement="left"
                        closable={false}
                        onClose={()=>{this.setState({openList:false})}}
                        visible={this.state.openList}
                    >
                        <div>
                            <Menu
                                onClick={this.handleClick}
                                style={{ width: '100%',    borderRight: 'none'}}
                                mode="inline"
                            >
                                <SubMenu key="sub1" title={<span><i className="fa fa-bar-chart" />&nbsp;<span><FormattedMessage id="Chart_Tool"/></span></span>}>
                                    {
                                        CHART_TOOL_MENUS.map(item=>  <Menu.Item key={item.id}><a href={item.href}><FormattedMessage id={item.name}/></a></Menu.Item>)

                                    }



                                </SubMenu>
                                <SubMenu key="sub2" title={<span><i className="fa fa-text-height"></i>&nbsp;<span><FormattedMessage id="Text_Tool"/></span></span>}>
                                    {
                                        TEXT_TOOL_MENUS.map(item=>  <Menu.Item key={item.id}><a onClick={()=>{browserHistory.push("/toolPages/"+item.href)}}><FormattedMessage id={item.name}/></a></Menu.Item>)

                                    }
                                </SubMenu>
                            </Menu>


                            </div>
                    </Drawer>
                    <div id="tool-menus" onClick={()=>this.setState({openList:true})}><a><i
                        className="glyphicon glyphicon-th-list"></i></a></div>
                    <Component {...this.props}/>
                </div>
            )

        }
    }

    const mapStateToProps = (state) => {


        return {
            routing: state.routing,
            userInfos: state.userInfos
        }
    };

    const mapDispatchToProps = (dispatch, props) => {

        return { setTextToolInfo: (data)=>dispatch(setTextToolInfo(data))}
    }

    return connect(mapStateToProps, mapDispatchToProps)(ToolAppComponent);

}