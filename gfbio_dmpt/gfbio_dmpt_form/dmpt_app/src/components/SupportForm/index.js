import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Col } from 'react-bootstrap';
import PropTypes from 'prop-types';

function SupportForm(props) {
    const {
        isLoggedIn
    } = props;

    console.log('SUPPORT FORM ', isLoggedIn);

    return (
        <Col lg={6} className='p-3' style={{"text-align": "left"}}>
            <form>
                <div className='row mb-3'>
                    <label htmlFor='email'
                        className='col-sm-3 col-form-label'>
                        Email
                    </label>
                    <div className='col-sm-9'>
                        <input type='email' className='form-control'
                            id='email'
                            placeholder='' />
                    </div>
                </div>

                <div className='row mb-3'>
                    <label htmlFor='message'
                        className='col-sm-3 col-form-label'>Message</label>
                    <textarea
                        className='col-sm-9'
                        rows='4'
                        id='message'
                        placeholder=''
                    />
                </div>

                <fieldset className="row mb-3">
                    <legend
                        className="col-form-label col-sm-5 pt-0">What services are you interested in ?
                    </legend>

                    <div className="col-sm-7">
                        <div className='form-check'>
                            <input className='form-check-input' type='checkbox'
                                value='Data collection and assurance'
                                id='interestedIn-1' />
                            <label className='form-check-label'
                                htmlFor='interestedIn-1'>Data Collection and
                                Assurance</label>
                        </div>

                        <div className='form-check'>
                            <input className='form-check-input' type='checkbox'
                                value='Data Curation' id='interestedIn-2' />
                            <label className='form-check-label'
                                htmlFor='interestedIn-2'>Data
                                Curation</label>
                        </div>

                        <div className='form-check'>
                            <input className='form-check-input' type='checkbox'
                                value='Data Archiving' id='interestedIn-3' />
                            <label className='form-check-label'
                                htmlFor='interestedIn-3'>Data
                                Archiving</label>
                        </div>

                        <div className='form-check'>
                            <input className='form-check-input' type='checkbox'
                                value='Data Visualization and Analysis'
                                id='interestedIn-4' />
                            <label className='form-check-label'
                                htmlFor='interestedIn-4'>Data Visualization
                                and Analysis</label>
                        </div>

                        <div className='form-check'>
                            <input className='form-check-input' type='checkbox'
                                value='Terminology Service'
                                id='interestedIn-5' />
                            <label className='form-check-label'
                                htmlFor='interestedIn-5'>Terminology
                                Service</label>
                        </div>

                        <div className='form-check'>
                            <input className='form-check-input' type='checkbox'
                                value='Data Publication'
                                id='interestedIn-6' />
                            <label className='form-check-label'
                                htmlFor='interestedIn-6'>Data
                                Publication</label>
                        </div>

                        <div className='form-check'>
                            <input className='form-check-input' type='checkbox'
                                value='Data Management Training'
                                id='interestedIn-7' />
                            <label className='form-check-label'
                                htmlFor='interestedIn-7'>Data Management
                                Training</label>
                        </div>
                    </div>

                </fieldset>

                <div className='form-group'>
                    <button type='button'
                        className='btn btn-outline-secondary'>Cancel
                    </button>
                    <button type='submit'
                        className='btn btn-secondary btn-green'>Submit
                    </button>
                </div>
            </form>
        </Col>
    );
}

SupportForm.propTypes = {
    isLoggedIn: PropTypes.bool.isRequired,
};

export default SupportForm;
