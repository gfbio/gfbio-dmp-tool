import React from 'react';
import { Col, Row } from 'react-bootstrap';

// eslint-disable-next-line no-unused-vars
import PropTypes from 'prop-types';

function Summary(props) {
    console.log('Summary ', props);
    console.log('-----------------------------');
    console.log('');
    return (
        <div id='summary'>
            <Row>
                <Col lg={12}>
                    <h3>Summary</h3>
                </Col>
            </Row>
            <Row className='mt-3'>
                <Col lg={12}>
                    <p>TEST</p>
                </Col>
            </Row>
        </div>
    );
}

Summary.propTypes = {
    // isLoggedIn: PropTypes.bool.isRequired,
    // userToken: PropTypes.string.isRequired
};

export default Summary;
