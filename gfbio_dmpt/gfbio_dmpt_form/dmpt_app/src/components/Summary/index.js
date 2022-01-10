import React from 'react';
import { Button, Col, Row } from 'react-bootstrap';

// eslint-disable-next-line no-unused-vars

function Summary(props) {
    console.log('Summary ', props);
    console.log('-----------------------------');
    console.log('');
    return (
        <div id='summary' className='text-center'>

            <Row>
                <div className='col-12'>
                    <h3>Summary</h3>
                </div>
            </Row>

            <Row className='mt-3'>
                <Col lg={12}>
                    <h5>Send a DMP support request to GFBio, download your DMP
                        or save it to your personal account</h5>
                </Col>
            </Row>

            <Row className='mt-5'>

                <Col lg={6} className='p-3'>
                    <i className='mdi mdi-email-send-outline' />
                    <h6>
                        Request Data Management Plan Support
                    </h6>
                    <div className='d-grid gap-2'>
                        <Button className='btn btn-secondary btn-green'>Send
                            Request
                        </Button>
                    </div>
                </Col>

                <Col lg={6} className='p-3'>
                    <i className='mdi mdi-download-circle-outline' />
                    <h6>
                        Dowload PDF file
                    </h6>
                    <div className='d-grid gap-2'>
                        <Button
                            className='btn btn-secondary btn-green'>Download
                        </Button>
                    </div>
                </Col>

            </Row>

            <Row className='mt-3'>
                <Col lg={6} className='p-3'>
                    <i className='mdi mdi-content-save-edit-outline' />
                    <h6>
                        Save Data Management Plan
                    </h6>
                    <div className='d-grid gap-2'>
                        <Button
                            className='btn btn-secondary btn-green'>Save
                        </Button>
                    </div>
                </Col>
                <Col lg={6} className='p-3'>
                    <i className='mdi mdi-location-exit' />
                    <h6>
                        Finish
                    </h6>
                    <div className='d-grid gap-2'>
                        <Button className='btn btn-secondary btn-green'>Discard
                            &
                            Exit
                        </Button>
                    </div>
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
