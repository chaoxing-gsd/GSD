import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {Grid, Row, Col} from 'react-bootstrap'
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import {FormattedMessage} from 'react-intl';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import fetch from 'isomorphic-fetch'
import {PreImage} from './plugins'
import Header  from "./header"
const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: "20px",
    paddingBottom: "30px"
  },
});

const datasourceList={
  "2008001":{src:"/sourceImages/duxiu_logo.png",name:<FormattedMessage
      id="DU_XIU"
  />,url:"http://www.duxiu.com"},
  "2008002":{src:"/sourceImages/data_02.gif",name:<FormattedMessage
      id="CBDB"
  />,url:"https://projects.iq.harvard.edu/chinesecbdb"},
  "2008003":{src:"/sourceImages/data_03.gif",name:<FormattedMessage
      id="CTEXT"
  />,url:"https://ctext.org/zhs"},
  "2008004":{src:"/sourceImages/data_09.gif",name:<FormattedMessage
      id="BUDDHA_DATA"
  />,url:"http://authority.dila.edu.tw"},
  "2008005":{src:"/sourceImages/data_04.gif",name:<FormattedMessage
      id="DACHENG"
  />,url:"http://www.dachengdata.com/tuijian/"},
  "2008006":{src:"/sourceImages/data_06.png",name:<FormattedMessage
      id="CHAOXING_SS"
  />,url:"http://www.zhizhen.com"},
  "2008007":{src:"/sourceImages/data_07.gif",name:<FormattedMessage
      id="CHAOXING_LIB"
  />,url:"http://www.chaoxing.com"},
  "2008008":{src:"/sourceImages/data_05.gif",name:<FormattedMessage
      id="CHAOXING_MAGAZINE"
  />,url:"http://ss.zhizhen.com"},
  "2008009":{src:"/sourceImages/data_08.png",name:<FormattedMessage
      id="CHINESE_INDEX"
  />,url:"http://cssci.nju.edu.cn/"},
  "2008010":{src:"/sourceImages/data_010.png",name:<FormattedMessage
      id="PUB_MED"
  />,url:"https://www.ncbi.nlm.nih.gov/pubmed"},
  "2008011":{src:"/sourceImages/data_01.gif",name:<FormattedMessage
      id="CHAOXING_TEACHER"
  />,url:"https://ssvideo.superlib.com"},
  "BK":{src:"/sourceImages/data_01.gif",name:<FormattedMessage
      id="BK"
  />,url:"https://ss.chaoxing.com"},
  "JN":{src:"/sourceImages/data_01.gif",name:<FormattedMessage
      id="JN"
  />,url:"https://ss.chaoxing.com"},
  "DT":{src:"/sourceImages/data_01.gif",name:<FormattedMessage
      id="DT"
  />,url:"https://ss.chaoxing.com"},
  "CP":{src:"/sourceImages/data_01.gif",name:<FormattedMessage
      id="CP"
  />,url:"https://ss.chaoxing.com"},
  "PT":{src:"/sourceImages/data_01.gif",name:<FormattedMessage
      id="PT"
  />,url:"https://ss.chaoxing.com"},
  "ST":{src:"/sourceImages/data_01.gif",name:<FormattedMessage
      id="ST"
  />,url:"https://ss.chaoxing.com"},
  "NP":{src:"/sourceImages/data_01.gif",name:<FormattedMessage
      id="NP"
  />,url:"https://ss.chaoxing.com"},
  "TR":{src:"/sourceImages/data_01.gif",name:<FormattedMessage
      id="TR"
  />,url:"https://ss.chaoxing.com"},
  "28":{src:"/sourceImages/data_01.gif",name:<FormattedMessage
      id="28"
  />,url:"https://ss.chaoxing.com"},
  "46":{src:"/sourceImages/data_01.gif",name:<FormattedMessage
      id="46"
  />,url:"https://ss.chaoxing.com"},
  "47":{src:"/sourceImages/data_01.gif",name:<FormattedMessage
      id="47"
  />,url:"https://ss.chaoxing.com"},
  "9,24":{src:"/sourceImages/data_01.gif",name:<FormattedMessage
      id="9,24"
  />,url:"https://ss.chaoxing.com"},
  "48":{src:"/sourceImages/data_01.gif",name:<FormattedMessage
      id="48"
  />,url:"https://ss.chaoxing.com"},
  "textref_ctext":{reLink:"2008003"},
  // "textref_zhonghuajingdian":{reLink:"2008003"},
  // "textref_kanripo":{reLink:"2008003"},
  // "textref_cbta":{reLink:"2008003"},
  // "biogref_dnb":{reLink:"2008003"},
  "biogref_ddbc":{reLink:"2008004"},
  "biogref_cbdb":{reLink:"2008002"},
  "textref_cbta":{src:"/sourceImages/cbta_icon.png",name:<FormattedMessage
      id="textref_cbta"
  />,url:"http://www.cbeta.org/gongde.htm"},
  "textref_kanripo":{src:"/sourceImages/textref_kanripo_icon.png",name:<FormattedMessage
      id="textref_kanripo"
  />,url:"http://publish.ancientbooks.cn/docShuju/platformSublibIndex.jspx?libId=5"},
  "textref_zhonghuajingdian":{src:"/sourceImages/textref_zhonghuajingdian_logo.png",name:<FormattedMessage
      id="textref_zhonghuajingdian"
  />,url:"http://blog.kanripo.org/"},
  "biogref_dnb":{src:"/sourceImages/dnb_icon.png",name:<FormattedMessage
      id="biogref_dnb"
  />,url:"http://blog.kanripo.org/"},
  

};

class Wiki extends Component {
  static propTypes={
    classes: PropTypes.object.isRequired
   }
  constructor(props) {
    super(props);
    this.state={wikiHtml:null}
  }


  componentDidMount(){
    console.log(this.props.params.wikiId)
    const wikiId=datasourceList[this.props.params.wikiId].reLink||this.props.params.wikiId;
    fetch(`/wikis/${wikiId}.html`, { method: "get",headers: { 'Accept': 'text/html', 'Content-Type': 'text/html', }})
        .then(response =>{
          if (response.ok) {
            return response.text();
          }
          return " "
        }).then(html=>{
      this.setState({wikiHtml:html});
    }).catch(error => {
      console.log(error);
      this.setState({wikiHtml:"暂无说明"});

    })
  }

  render() {
    const { classes } = this.props;
    const wikiId=datasourceList[this.props.params.wikiId].reLink||this.props.params.wikiId;
    return (
        <div>
          <Header/>
        <Grid style={{marginTop:"30px",minWidth:'1200px'}}>
          <Row style={{paddingBottom:"20px",margin:"0 auto"}}>
            <Col style={{display:'inline-block',float:'left'}}><PreImage  width="50px" height="50px" src={datasourceList[wikiId].src}/></Col>
            <Col  style={{display:'inline-block',fontSize:'1.5rem',marginTop:'10px',marginLeft:'12px',float:'left'}}>{datasourceList[wikiId].name}</Col>

            <Col style={{float:'right',marginTop:'12px'}}></Col>

            </Row>
        <Paper className={classes.root} elevation={1}>
          {!this.state.wikiHtml&&<div style={{fontSize: 18, lineHeight: 2}}>
            <SkeletonTheme  color="#e0e0e0" highlightColor="#edecec">
              <h1> <Skeleton/></h1>
              <Skeleton count={10}/>
            </SkeletonTheme>
          </div>}

          {!!this.state.wikiHtml&&<div>

            <div style={{fontSize:'14px'}} className="wiki_html" dangerouslySetInnerHTML={{__html: this.state.wikiHtml}}></div>
          </div>}
        </Paper>
      </Grid>
          </div>
    );
  }

}
export default withStyles(styles)(Wiki)
