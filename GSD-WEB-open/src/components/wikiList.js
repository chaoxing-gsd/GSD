import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {Grid, Row, Col,Glyphicon} from 'react-bootstrap'
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import {FormattedMessage} from 'react-intl';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import {Breadcrumb} from 'antd';
import {PreImage} from './plugins';
var JSONbig = require('json-bigint');
import {fetchUrlText, fetchUrl} from '../actions/fetchData';
import {INNER_SERVER_URL, UPLOAD_SERVER_URL, CHAOXING_PAN} from  "../config/constants";
import { Pagination } from 'antd';
import swal from 'sweetalert2'

const styles = theme => ({
  root: {
    width: '100%',
    marginTop:'20px',
    backgroundColor: theme.palette.background.paper,
  },
});

const wikiList=[

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


  {src:"/sourceImages/data_05.gif",label:<FormattedMessage
      id="CHAOXING_MAGAZINE"
  />,link:"http://gsd.chaoxing.com/index.php?title=%E8%B6%85%E6%98%9F%E6%9C%9F%E5%88%8A"},

  // {src:"/sourceImages/BK_icon.png",label:<FormattedMessage
  //     id="BK"
  // />,link:"/wiki/BK"},
  // {src:"/sourceImages/JN_icon.png",label:<FormattedMessage
  //     id="JN"
  // />,link:"/wiki/JN"},
  // {src:"/sourceImages/DT_icon.png",label:<FormattedMessage
  //     id="DT"
  // />,link:"/wiki/DT"},
  // {src:"/sourceImages/CP_icon.png",label:<FormattedMessage
  //     id="CP"
  // />,link:"/wiki/CP"},
  // {src:"/sourceImages/PT_icon.png",label:<FormattedMessage
  //     id="PT"
  // />,link:"/wiki/PT"},
  // {src:"/sourceImages/ST_icon.png",label:<FormattedMessage
  //     id="ST"
  // />,link:"/wiki/ST"},
  // {src:"/sourceImages/NP_icon.png",label:<FormattedMessage
  //     id="NP"
  // />,link:"/wiki/NP"},
  // {src:"/sourceImages/TR_icon.png",label:<FormattedMessage
  //     id="TR"
  // />,link:"/wiki/TR"},
  // {src:"/sourceImages/28_icon.png",label:<FormattedMessage
  //     id="28"
  // />,link:"/wiki/28"},
  // {src:"/sourceImages/46_icon.png",label:<FormattedMessage
  //     id="46"
  // />,link:"/wiki/46"},
  // {src:"/sourceImages/data_01.gif",label:<FormattedMessage
  //     id="47"
  // />,link:"/wiki/47"},
  // {src:"/sourceImages/48_icon.png",label:<FormattedMessage
  //     id="48"
  // />,link:"/wiki/48"},
  // {src:"/sourceImages/9_24_icon.png",label:<FormattedMessage
  //     id="9,24"
  // />,link:"/wiki/9,24"},

  {src:"/sourceImages/sanfrancisco_picture.png",label:<FormattedMessage
      id="sanfrancisco_picture"
  />,link:"http://gsd.chaoxing.com/index.php?title=%E6%97%A7%E9%87%91%E5%B1%B1%E5%9B%BE%E7%89%87%E5%BA%93"},
  {src:"/sourceImages/gsd_china_comp_gazetteers.png",label:<FormattedMessage
      id="gsd_china_comp_gazetteers"
  />,link:"http://gsd.chaoxing.com/index.php?title=%E4%B8%AD%E5%9B%BD%E7%BB%BC%E5%90%88%E6%96%B9%E5%BF%97%E5%BA%93"},
  {src:"/sourceImages/gsd_bksy1.png",label:<FormattedMessage
      id="gsd_bksy1"
  />,link:"http://gsd.chaoxing.com/index.php?title=%E5%85%A8%E5%9B%BD%E6%8A%A5%E5%88%8A%E7%B4%A2%E5%BC%95%EF%BC%88%E7%8E%B0%E4%BB%A3%EF%BC%89"},
  {src:"/sourceImages/gsd_bksy.png",label:<FormattedMessage
      id="gsd_bksy"
  />,link:"http://gsd.chaoxing.com/index.php?title=%E5%85%A8%E5%9B%BD%E6%8A%A5%E5%88%8A%E7%B4%A2%E5%BC%95%EF%BC%88%E8%BF%91%E4%BB%A3%EF%BC%89"},
  {src:"/sourceImages/gsd_hks.png",label:<FormattedMessage
      id="gsd_hks"
  />,link:"http://gsd.chaoxing.com/index.php?title=%E9%A6%99%E6%B8%AF%E5%A4%A7%E5%AD%A6%E5%AD%A6%E6%9C%AF%E5%BA%93"},



  {src:"/sourceImages/gsd_hkpu.png",label:<FormattedMessage
      id="gsd_hkpu"
  />,link:"http://gsd.chaoxing.com/index.php?title=%E9%A6%99%E6%B8%AF%E7%90%86%E5%B7%A5%E5%A4%A7%E5%AD%A6%E6%96%87%E7%8C%AE%E5%BA%93"},
  {src:"/sourceImages/gsd_national_natural_science.png",label:<FormattedMessage
      id="gsd_national_natural_science"
  />,link:"http://gsd.chaoxing.com/index.php?title=%E5%9B%BD%E5%AE%B6%E8%87%AA%E7%84%B6%E7%A7%91%E5%AD%A6%E5%9F%BA%E9%87%91%E5%9F%BA%E7%A1%80%E7%A0%94%E7%A9%B6%E7%9F%A5%E8%AF%86%E5%BA%93"},

  {src:"/sourceImages/gsd_kaggle.png",label:<FormattedMessage
      id="gsd_kaggle"
  />,link:"http://gsd.chaoxing.com/index.php?title=Kaggle%E6%95%B0%E6%8D%AE%E9%9B%86"},
  {src:"/sourceImages/gsd_nsf.png",label:<FormattedMessage
      id="gsd_nsf"
  />,link:"http://gsd.chaoxing.com/index.php?title=%E5%9B%BD%E5%AE%B6%E7%A7%91%E6%8A%80%E6%8A%A5%E5%91%8A%E6%9C%8D%E5%8A%A1%E7%B3%BB%E7%BB%9F"},
  {src:"/sourceImages/gsd_hkust_scholar.png",label:<FormattedMessage
      id="gsd_hkust_scholar"
  />,link:"http://gsd.chaoxing.com/index.php?title=%E9%A6%99%E6%B8%AF%E7%A7%91%E6%8A%80%E5%A4%A7%E5%AD%A6%E5%AD%A6%E8%80%85%E5%BA%93"},

  {src:"/sourceImages/gsd_hkpur.png",label:<FormattedMessage
      id="gsd_hkpur"
  />,link:"http://gsd.chaoxing.com/index.php?title=%E9%A6%99%E6%B8%AF%E7%90%86%E5%B7%A5%E5%A4%A7%E5%AD%A6%E5%AD%A6%E8%80%85%E5%BA%93"},

  {src:"/sourceImages/gsd_eduhk.png",label:<FormattedMessage
      id="gsd_eduhk"
  />,link:"http://gsd.chaoxing.com/index.php?title=%E9%A6%99%E6%B8%AF%E6%95%99%E8%82%B2%E5%A4%A7%E5%AD%A6%E5%AD%A6%E8%80%85%E5%BA%93"},
  {src:"/sourceImages/gsd_hongkongeducationuniversity.png",label:<FormattedMessage
      id="gsd_hongkongeducationuniversity"
  />,link:"http://gsd.chaoxing.com/index.php?title=%E9%A6%99%E6%B8%AF%E6%95%99%E8%82%B2%E5%A4%A7%E5%AD%A6%E5%AD%A6%E6%9C%AF%E6%96%87%E7%8C%AE%E5%BA%93"},


  {src:"/sourceImages/gsd_hkebd.png",label:<FormattedMessage
      id="gsd_hkebd"
  />,link:"http://gsd.chaoxing.com/index.php?title=%E9%A6%99%E6%B8%AF%E6%95%99%E8%82%B2%E4%B9%A6%E7%9B%AE%E6%95%B0%E6%8D%AE%E5%BA%93"},
  {src:"/sourceImages/gsd_quandashi.png",label:<FormattedMessage
      id="gsd_quandashi"
  />,link:"http://gsd.chaoxing.com/index.php?title=%E6%9D%83%E5%A4%A7%E5%B8%88%E5%95%86%E6%A0%87%E6%95%B0%E6%8D%AE%E5%BA%93"},
  {src:"/sourceImages/NP_icon.png",label:<FormattedMessage
      id="gsd_tpld"
  />,link:"http://gsd.chaoxing.com/index.php?title=%E5%8F%B0%E6%B9%BE%E6%9C%9F%E5%88%8A%E8%AE%BA%E6%96%87%E7%B4%A2%E5%BC%95"},
  {src:"/sourceImages/gsd_cnbksy.png",label:<FormattedMessage
      id="gsd_cnbksy"
  />,link:"http://gsd.chaoxing.com/index.php?title=%E5%85%A8%E5%9B%BD%E6%8A%A5%E5%88%8A%E7%B4%A2%E5%BC%95%EF%BC%88%E5%9B%BE%E7%89%87%EF%BC%89"},

  {src:"/sourceImages/gsd_nssfpd.png",label:<FormattedMessage
      id="gsd_nssfpd"
  />,link:"http://gsd.chaoxing.com/index.php?title=%E5%9B%BD%E5%AE%B6%E7%A4%BE%E7%A7%91%E5%9F%BA%E9%87%91%E9%A1%B9%E7%9B%AE%E6%95%B0%E6%8D%AE%E5%BA%93"},
  {src:"/sourceImages/gsd_aaa.png",label:<FormattedMessage
      id="gsd_aaa"
  />,link:"http://gsd.chaoxing.com/index.php?title=%E4%BA%9A%E6%B4%B2%E8%89%BA%E6%9C%AF%E6%96%87%E7%8C%AE%E5%BA%93"},

  {src:"/sourceImages/gsd_idp.png",label:<FormattedMessage
      id="gsd_idp"
  />,link:"http://gsd.chaoxing.com/index.php?title=%E6%95%A6%E7%85%8C%E5%9B%BD%E9%99%85%E9%A1%B9%E7%9B%AE"},

  {src:"/sourceImages/gsd_cmd.png",label:<FormattedMessage
      id="gsd_cmd"
  />,link:"http://gsd.chaoxing.com/index.php?title=%E4%B8%AD%E8%8D%AF%E5%9B%BE%E8%B0%B1%E8%B5%84%E6%BA%90%E5%BA%93"},
  {src:"/sourceImages/gsd_fcsd.png",label:<FormattedMessage
      id="gsd_fcsd"
  />,link:"http://gsd.chaoxing.com/index.php?title=%E5%9B%BD%E5%A4%96%E4%B8%AD%E5%9B%BD%E5%AD%A6%E5%AE%B6%E6%95%B0%E6%8D%AE%E5%BA%93"},
  {src:"/sourceImages/gsd_whtd.png",label:<FormattedMessage
      id="gsd_whtd"
  />,link:"http://gsd.chaoxing.com/index.php?title=%E8%A5%BF%E5%A4%8F%E8%AE%BA%E8%91%97%E8%B5%84%E6%BA%90%E5%BA%93"},

];

class Wiki extends Component {
  static propTypes={
    classes: PropTypes.object.isRequired
   }
  constructor(props) {
    super(props);
    this.state={
        wikiData:[],
        total:50
    }
    this.pageSize = 20;
    this.pagenum = 1;
  }


  componentDidMount(){
      this.getWikiData();
  }

  getWikiData = async(pageNum = 1 , pageSize = 20) => {
    //wikiname=zhongguo  ---wiki名称模糊查询【选填】
    //orderby=time  ---依据什么排序，可选值：time，name【选填】
    //sorttype=asc  ---asc正序，desc倒叙 【选填】
    var url = `querywikiinfo?pagenum=${pageNum}&size=${pageSize}`;
    var responseData = await fetchUrlText(INNER_SERVER_URL + url, "post", null, {});
    var response = JSONbig.parse(responseData);
    if (response && response.statu) {
        this.setState({
            wikiData:response.data.infos,
            total:response.data.total
        });
    }
  }

  downloadWiki(item){
    swal({
        title: "是否下载资源",
        type: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        confirmButtonText: "下载",
        cancelButtonText: "取消"
    }).then((result) => {
        if(result.dismiss != "cancel"){
            window.open(item.download);
        }
    })      
  }

  render() {
    const { classes } = this.props;
    return (
        <Grid style={{marginTop:"30px"}}>
          <Row style={{paddingBottom:"20px",margin:"0 auto"}}>
            <Col style={{display:'inline-block',float:'left'}}><a href="/"><PreImage  width="246px" height="50px" src="/sourceImages/logo.gif"/></a></Col>




            </Row>

          <Breadcrumb separator=">">
            <Breadcrumb.Item href="/"><FormattedMessage id="HOME"/></Breadcrumb.Item>
            <Breadcrumb.Item><FormattedMessage id="DATA_SOURCE1"/></Breadcrumb.Item>
          </Breadcrumb>


          <Paper className={classes.root} elevation={1}>

            <List component="nav" id="wikiListItem">
                {
                    this.state.wikiData.map((item,index)=>{
                        item.imagea = item.imagea || '/sourceImages/default.png';
                        return (
                            <ListItem button component="a" key={`wiki_${index}`} href={item.link}>
                                <ListItemIcon>
                                <PreImage  width="50px" height="50px" src={item.imagea}/>
                                </ListItemIcon>

                                <ListItemText primary={<span  style={{fontSize:'16px'}}>{item.name}</span>} />
                                <ListItemSecondaryAction>
                                {/* <Glyphicon style={{color:"#b3b3b3",marginRight:'20px'}} glyph="chevron-right"/> */}
                                <a href="#">
                                    <Glyphicon style={{color:"#b3b3b3",marginRight:'20px'}} onClick={()=>this.downloadWiki(item)} glyph="download-alt"/>
                                </a>
                                </ListItemSecondaryAction>
                            </ListItem>
                        )
                    })
                }
            </List>
            <Pagination defaultCurrent={1} 
             showQuickJumper 
             showSizeChanger 
             onShowSizeChange={(n,s)=>this.getWikiData(n,s)}
             onChange={(n,s)=>this.getWikiData(n,s)} 
             pageSizeOptions={[20,30,40,50]}
             defaultPageSize={20}
             total={this.state.total} 
             style={{textAlign:"center",padding:"10px 0px 20px 0px"}}/>
            
          </Paper>
      </Grid>
    );
  }

}
export default withStyles(styles)(Wiki)
