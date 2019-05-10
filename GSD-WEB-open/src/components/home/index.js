import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Link} from 'react-router';

import {Grid, Row, Col, Modal, Button, Panel} from 'react-bootstrap';

import {injectIntl, intlShape, FormattedMessage} from 'react-intl';
import {PreImage} from '../plugins'
import HomeSearchInput from './SearchInput'
import Header from './Header'
import DataSourceList from './DataSourceList'
import SupportList from './SupportList'
import {getUserLanguageTag} from '../../utils/utils'

class Home extends Component {
    static propTypes = {
        intl: intlShape.isRequired
    }

    constructor(props) {
        super(props);
        this.state = {};

    }

    componentDidMount() {
        document.title=this.props.intl.formatMessage({id: 'HOME'})+"-"+this.props.intl.formatMessage({id: 'PROJECT_NAME'});
    }

    render() {

        const locale=getUserLanguageTag();
        const altHolder = this.props.intl.formatMessage({id: 'PROJECT_NAME'});
        return (
            <div>
                <div className="earthBg">
                    <Header/>
                    <Grid >
                        <Row>
                            <Col xs={12} sm={12} style={{textAlign:'center'}}>
                                <div className="cx-home-wrapper">
                                    <PreImage fullPage alt={altHolder} width="350" height="69" src={locale=='en'?"/sourceImages/logo_en.png":"/sourceImages/logo.gif"}/>
                                    <HomeSearchInput/>
                                </div>

                            </Col>
                        </Row>
                    </Grid>
                </div>
                    <DataSourceList/>

                <SupportList/>

            </div>

        )
    }
}

const mapStateToProps = (state, props) => {
    console.log(props);
    return {
        routing: state.routing,
        userInfos: state.userInfos
    }
}


export default connect(mapStateToProps)(injectIntl(Home));
