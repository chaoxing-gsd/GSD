import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import request from 'superagent'
import {injectIntl} from 'react-intl';
const BMap = window.BMap;
var map;
class GeoMap extends Component {
    constructor(props) {
        super(props);  
    }

    componentDidMount () {
        document.title=this.props.intl.formatMessage({id: 'GEOMAP'})+"-"+this.props.intl.formatMessage({id: 'Data Visualization'})+"-"+this.props.intl.formatMessage({id: 'PROJECT_NAME'});

        map = new BMap.Map("geoMap"); // 创建Map实例
        map.centerAndZoom(new BMap.Point(116.404, 39.915), 11); // 初始化地图,设置中心点坐标和地图级别
        map.addControl(new BMap.MapTypeControl()); //添加地图类型控件
        map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
        var self = this;
        request.get("/templates/CESI.csv")
        .type('text')
        .set('Content-Type', 'text/plain;charset=UTF-8')
        .end((error, response) => {
                console.log(response);
                var infos = [];
                var items = response.text.split(/\r?\n|\r/);
                var titles = items[0].split(",");
                var len = titles.length;
                for (var i = 1; i < items.length; i++) {
                    var contents = items[i].split(",");
                    var obj = {};
                    for(var j=0;j<len;j++){
                        obj[titles[j].trim()] = contents[j].trim();
                    }
                    infos.push(obj);
                }       
                console.log(infos);
            // 定义marker
            for(var i=0; i<infos.length;i++) {
                var coordinates = infos[i][titles[len-1]].split('，');
                var x = parseFloat(coordinates[0]);
                var y = parseFloat(coordinates[1]);
                var point = new BMap.Point(x,y);
                var myIcon = new BMap.Icon("/sourceImages/school.png", new BMap.Size(32,32));
                var marker = new BMap.Marker(point,{icon:myIcon});  // 创建标注
                var opts = {
                  width : 200,     // 信息窗口宽度
                  height: 100,     // 信息窗口高度
                  overflow: "auto",
                  title : infos[i][titles[0]] , // 信息窗口标题
                }
                map.addOverlay(marker);     // 将标注添加到地图中 
                var content = "";
                for (var j=1; j<len; j++) {
                    content = content + titles[j] + "：" + infos[i][titles[j]] + "<br/>";
                }
                content = "<div style='overflow:auto;height:100px'>" + content + "</div>";
                self.addClickHandler(content, marker, opts);
            }
        });
    }

    addClickHandler(content, marker, opts) {
        var self = this;
        marker.addEventListener("click",(e)=>{
            self.openInfo(content,e, opts)}
        );
    }

    openInfo(content,e,opts){
        var p = e.target;
        var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
        var infoWindow = new BMap.InfoWindow(content,opts);  // 创建信息窗口对象 
        map.openInfoWindow(infoWindow,point); //开启信息窗口
    }

    render() {
        return (
        	<div style={{width:"100%",height:"100%",position:"absolute",top:0,bottom:0}}>
                <style type="text/css">{`#tool-menus a{color:#757575;}`}</style>
            	<div id="geoMap" style={{width:"100%",height:"100%"}}></div>
            </div>
        );
    }
}

export default injectIntl(GeoMap)