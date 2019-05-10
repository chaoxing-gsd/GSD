/**
 * Created by Aaron on 2018/6/20.
 */
import React, {Component} from 'react'
import PropTypes from 'prop-types'

import Autosuggest from 'react-autosuggest';
import {fetchJSONData} from '../../actions/fetchData';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import {withStyles} from '@material-ui/core/styles';
import {injectIntl, intlShape, FormattedMessage} from 'react-intl';
import {setSearchResultPageInfos} from "../../actions";
import {setSearchTitle} from "../../actions";
import {Glyphicon} from 'react-bootstrap';
import {browserHistory} from 'react-router'
import {connect} from 'react-redux'
const SUGGEST_URL = "http://relt1.duxiu.com/swjson.jsp?jsoncallback=_jsonpSuggest";
import Button from '@material-ui/core/Button';

const styles = {
    root: {
        pddingTop: '5px',
        paddingBottom: '5px'
    },
    searchBtn: {
        fontSize: '12px',
        display: 'inline-block',
        float: 'left',
        borderRadius: '0',
        boxShadow: 'none',
        height: '42px',
        width: "15%",
        minWidth: '15%',
        fontSize: "1.1rem",
        color: "#ffffff",
        backgroundColor: "#8c1515",
        '&:hover': {
            color: "#ffffff",
            backgroundColor: "#ef8181"
        },
        backgroundColor: "#d45f5f"
    },
};


class HomeSearchInput extends Component {
    static propTypes = {
        wrapperStyle: PropTypes.object,
        lineStyle: PropTypes.object,
        inputStyle: PropTypes.object,
        intl: intlShape.isRequired,
        classes: PropTypes.object.isRequired,
        small: PropTypes.bool,
        hideIcon: PropTypes.bool,
        showButton: PropTypes.bool,

    }

    constructor(props) {
        super(props);
        this.state = {active: false, suggestions: [], searchValue: this.props.initValue || ''};
    }

    renderSuggestionsContainer(options) {
        const {containerProps, children} = options;

        return (
            <Paper style={{position:'absolute',top:'auto',left:'0',width:'100%',zIndex:'10'}} {...containerProps}
                   square>
                {children}
            </Paper>
        );
    }

    componentDidMount() {

        this.props.setSearchTitle(this.state.searchValue || this.props.initValue || '');

    }


    getSuggestionDatas(search) {
        if (!!search && search.value) {
            var t = new Date().getTime();
            fetchJSONData(`${SUGGEST_URL}&sw=${search.value}&t=${t}`).then(response => {
                var result = unescape(response.values).split("|");
                this.setState({suggestions: result});
            }).catch(error => {


            })
        }

    }

    renderSuggestion(suggestion, {query, isHighlighted}) {
        const {classes, small} = this.props;
        const matches = match(suggestion, query);
        const parts = parse(suggestion, matches);

        return (
            <MenuItem selected={isHighlighted} component="div" classes={{
        root: classes.root

      }}>
                <div>
                    {parts.map((part, index) => {
                        return part.highlight ? (
                            <span key={String(index)}
                                  style={{ color:'#b53535',fontWeight: 'bold',fontSize:small?"inherit":"1.4rem"  }}>
              {part.text}
            </span>
                        ) : (
                            <strong key={String(index)} style={{ fontWeight: '300',fontSize:small?"inherit":"1.4rem" }}>
                                {part.text}
                            </strong>
                        );
                    })}
                </div>
            </MenuItem>
        );
    }

    renderInput(inputProps) {

        const {inputStyle}=this.props;
        const {...other} = inputProps;
        return (<input onKeyUp={(e)=>this.onKeyup(e)} style={{border:'none',outline:0,...inputStyle}}   {...other}/>);
    }


    onKeyup(e) {


        if (e.keyCode == 13) {
            this.toSearchPage();
        }
    }


    toSearchPage(suggestion = "" ,index = 0) {
        window.localStorage.setItem("chaoxing_result_tab_index",index);
        if (this.props.onSearchCallBack) {
            var searchValue = suggestion != "" ? suggestion : this.state.searchValue;
            this.props.onSearchCallBack(searchValue);
            return;

        }
        // if(!!this.state.searchValue){
        var searchValue = suggestion != "" ? suggestion : this.state.searchValue;
        document.title=this.props.intl.formatMessage({id: 'Search Result'})+"-"+this.props.intl.formatMessage({id: 'ALL'})+"-"+searchValue+"-GSD";
        this.props.setSearchTitle(searchValue);
            this.props.setSearchResultPageInfos({selectedMyIndex:[]});

        browserHistory.push("/search?searchValue=" + searchValue + "&random=" + Math.random() * 100000);
        // }

    }

    onSuggestionSelected(event, {suggestion, suggestionValue, suggestionIndex, sectionIndex, method}) {
        this.toSearchPage(suggestion);
    }

    render() {
        const {wrapperStyle, lineStyle, intl, hideIcon, showButton, classes} = this.props;
        return (

            <div className="clearfix">
                <div style={wrapperStyle}
                     className={this.state.active?"searchInputContainer active clearfix":"searchInputContainer clearfix"}>

                    <div style={lineStyle} className="searchInputWrapper">
                        <Autosuggest
                            renderInputComponent={(inputProps)=> this.renderInput(inputProps)}
                            suggestions={this.state.suggestions}
                            onSuggestionsFetchRequested={(value)=>this.getSuggestionDatas(value)}
                            onSuggestionsClearRequested={(value)=>this.getSuggestionDatas(value)}
                            onSuggestionSelected={(e,{ suggestion, suggestionValue, suggestionIndex, sectionIndex, method })=>this.onSuggestionSelected(e, { suggestion, suggestionValue, suggestionIndex, sectionIndex, method })}
                            renderSuggestionsContainer={(options)=>this.renderSuggestionsContainer(options)}
                            getSuggestionValue={(value)=>{ return value}}
                            renderSuggestion={(suggestion, { query, isHighlighted })=>this.renderSuggestion(suggestion, { query, isHighlighted })}
                            inputProps={{

          className:"searchInput",
          placeholder: `${intl.formatMessage({id: 'SEARCH_TIP'})}`,
          value: this.state.searchValue,
          onBlur:()=>{this.setState({active:false})},
 onChange:  (e, {newValue}) => { this.setState({active:true,searchValue:newValue})},
        }}
                        />
                        {

                            // <input className="searchInput" onFocus={()=>this.setState({active:true})}
                            //        onBlur={()=>this.setState({active:false})}/>
                        }
                        {!hideIcon && <span className="searchBtn" onClick={()=>this.toSearchPage()}>
                    <Glyphicon glyph="search"/>
                        </span>
                        }                        
                    </div>

                    {showButton &&
                    <Button onClick={()=>this.toSearchPage()} variant="contained" size="small" color="default"
                            className={classes.searchBtn}>
                        <Glyphicon glyph="search"/>
                    </Button>
                    }
                    {
                        !hideIcon && <div className="searchDetail" onClick={()=>this.toSearchPage("",1)}>
                            定向检索
                        </div>
                    }
                </div>

                {this.props.showHistoryIcon && this.props.userInfos.isLogined &&
                <a className="hisotry-li" href="/history" target="_blank">
                    <FormattedMessage id="Search History"/>
                </a>
                }
                {

                //     this.props.showAdvanceIcon && <a className="hisotry-li">
                //     <FormattedMessage id="Advance Search"/>
                // </a>
                }

            </div>

        );
    }
}

const mapStateToProps = (state, props) => {

    return {
        userInfos: state.userInfos
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        setSearchTitle: (title)=>dispatch(setSearchTitle(title)),
        setSearchResultPageInfos:(pageInfos)=>dispatch(setSearchResultPageInfos(pageInfos)),


    }
}


export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(withStyles(styles)(HomeSearchInput)))