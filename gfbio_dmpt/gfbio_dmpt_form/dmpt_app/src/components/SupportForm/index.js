import React from 'react';
import { Col } from 'react-bootstrap';
import PropTypes from 'prop-types';

import useSupportForm from './formHooks';

function SupportForm(props) {
    const {
        isLoggedIn
    } = props;

    // TODO: send actula reuqest to server
    // TODO: create endpoint and succesive tasks in django
    // TODO: add cancel function for this form
    const submitRequest = () => {
        console.log('SUBMIT REQUEST (callback)');
        console.log(inputs);
        // alert(`support!
        //  Email: ${inputs.email}`);
    };

    const {
        inputs,
        handleInputChange,
        handleSubmit
    } = useSupportForm(submitRequest);

    console.log('SUPPORT FORM ', isLoggedIn);

    return (
        <Col lg={6} className='p-3' style={{ 'text-align': 'left' }}>
            <form onSubmit={handleSubmit}>
                <div className='row mb-3'>
                    <label htmlFor='email'
                        className='col-sm-3 col-form-label'>
                        Email
                    </label>
                    <div className='col-sm-9'>
                        <input type='email' className='form-control'
                            id='email'
                            name='email'
                            placeholder=''
                            onChange={handleInputChange} value={inputs.email}
                        />
                    </div>
                </div>

                <div className='row mb-3'>
                    <label htmlFor='message'
                        className='col-sm-3 col-form-label'>Message</label>
                    <textarea
                        className='col-sm-9'
                        rows='4'
                        id='message'
                        name='message'
                        placeholder=''
                        onChange={handleInputChange} value={inputs.message}
                        required
                    />
                </div>

                <fieldset className='row mb-3'>
                    <legend
                        className='col-form-label col-sm-5 pt-0'>What services
                        are you interested in ?
                    </legend>

                    <div className='col-sm-7'>
                        <div className='form-check'>
                            <input className='form-check-input' type='checkbox'
                                // value='Data collection and assurance'
                                id='dataCollectionAndAssurance'
                                name='dataCollectionAndAssurance'
                                onChange={handleInputChange}
                                // value={inputs.dataCollectionAndAssurance}
                            />
                            <label className='form-check-label'
                                htmlFor='dataCollectionAndAssurance'>Data
                                Collection and
                                Assurance</label>
                        </div>

                        <div className='form-check'>
                            <input className='form-check-input' type='checkbox'
                                // value='Data Curation'
                                id='dataCuration'
                                name='dataCuration'
                                onChange={handleInputChange}
                                // value={inputs.interestedTwo}
                            />
                            <label className='form-check-label'
                                htmlFor='dataCuration'>Data
                                Curation</label>
                        </div>

                        <div className='form-check'>
                            <input className='form-check-input' type='checkbox'
                                // value='Data Archiving'
                                id='dataArchiving'
                                name='dataArchiving'
                                onChange={handleInputChange}
                                // value={inputs.interestedThree}
                            />
                            <label className='form-check-label'
                                htmlFor='dataArchiving'>Data
                                Archiving</label>
                        </div>

                        <div className='form-check'>
                            <input className='form-check-input' type='checkbox'
                                // value='Data Visualization and Analysis'
                                id='dataVisualizationAndAnalysis'
                                name='dataVisualizationAndAnalysis'
                                onChange={handleInputChange}
                                // value={inputs.interestedInFour}
                            />
                            <label className='form-check-label'
                                htmlFor='dataVisualizationAndAnalysis'>Data
                                Visualization
                                and Analysis</label>
                        </div>

                        <div className='form-check'>
                            <input className='form-check-input' type='checkbox'
                                // value='Terminology Service'
                                id='terminologyService'
                                name='interestedInFive'
                                onChange={handleInputChange}
                                // value={inputs.interestedInFive}
                            />
                            <label className='form-check-label'
                                htmlFor='terminologyService'>Terminology
                                Service</label>
                        </div>

                        <div className='form-check'>
                            <input className='form-check-input' type='checkbox'
                                value='Data Publication'
                                id='dataPublication'
                                name='dataPublication'
                                onChange={handleInputChange}
                                // value={inputs.interestedInSix}
                            />
                            <label className='form-check-label'
                                htmlFor='dataPublication'>Data
                                Publication</label>
                        </div>

                        <div className='form-check'>
                            <input className='form-check-input' type='checkbox'
                                // value='Data Management Training'
                                id='dataManagementTraining'
                                name='interestedInSeven'
                                onChange={handleInputChange}
                                // value={inputs.interestedInSeven}
                            />
                            <label className='form-check-label'
                                htmlFor='dataManagementTraining'>Data
                                Management
                                Training</label>
                        </div>
                    </div>

                </fieldset>

                <div className='form-group'>
                    <button type='submit'>Submit</button>
                    {/* <button type='button' */}
                    {/*    className='btn btn-outline-secondary'>Cancel */}
                    {/* </button> */}
                    {/* <button type='submit' */}
                    {/*    className='btn btn-secondary btn-green'>Submit */}
                    {/* </button> */}
                </div>
            </form>
        </Col>
    );
}

SupportForm.propTypes = {
    isLoggedIn: PropTypes.bool.isRequired
};

export default SupportForm;
