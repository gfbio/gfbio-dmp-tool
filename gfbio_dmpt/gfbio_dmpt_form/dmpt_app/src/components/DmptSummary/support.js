import React from 'react';
import useSupportForm from '../DmptHooks/supportFormHooks';

const submitRequest = (inputs) => {
    console.log('DmptSummary | support.js | submit | inputs ', inputs);
};

function SupportRequest() {
    const { inputs, handleInputChange, handleSubmit } =
        useSupportForm(submitRequest);
    return (
        <div>
            <h6 className="sidebar-list-item">
                <i className="mdi mdi-account-voice align-middle" />
                Request Support
            </h6>

            <form
                id="supportForm"
                onSubmit={handleSubmit}
                className="text-start"
            >
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                        Email address
                    </label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        aria-describedby="emailHelp"
                        onChange={handleInputChange}
                        value={inputs.email}
                        required
                    />
                    {/* <div id="emailHelp" className="form-text"> */}
                    {/*     We will never share your email with anyone else. */}
                    {/* </div> */}
                </div>

                <div className="mb-3">
                    <label
                        htmlFor="message"
                        className="col-sm-3 col-form-label"
                    >
                        Message
                    </label>
                    <textarea
                        className="form-control"
                        rows="4"
                        id="message"
                        name="message"
                        placeholder=""
                        onChange={handleInputChange}
                        value={inputs.message}
                        required
                    />
                </div>

                <fieldset className="mb-3">
                    <legend className="col-form-label col-sm-5 pt-0">
                        What services are you interested in ?
                    </legend>

                    <div className="col-sm-7">
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="data_collection_and_assurance"
                                name="data_collection_and_assurance"
                                onChange={handleInputChange}
                            />
                            <label
                                className="form-check-label"
                                htmlFor="data_collection_and_assurance"
                            >
                                Data Collection and Assurance
                            </label>
                        </div>

                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="data_curation"
                                name="data_curation"
                                onChange={handleInputChange}
                            />
                            <label
                                className="form-check-label"
                                htmlFor="data_curation"
                            >
                                Data Curation
                            </label>
                        </div>

                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="data_archiving"
                                name="data_archiving"
                                onChange={handleInputChange}
                            />
                            <label
                                className="form-check-label"
                                htmlFor="data_archiving"
                            >
                                Data Archiving
                            </label>
                        </div>

                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="data_visualization_and_analysis"
                                name="data_visualization_and_analysis"
                                onChange={handleInputChange}
                            />
                            <label
                                className="form-check-label"
                                htmlFor="data_visualization_and_analysis"
                            >
                                Data Visualization and Analysis
                            </label>
                        </div>

                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="terminology_service"
                                name="terminology_service"
                                onChange={handleInputChange}
                            />
                            <label
                                className="form-check-label"
                                htmlFor="terminology_service"
                            >
                                Terminology Service
                            </label>
                        </div>

                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="data_publication"
                                name="data_publication"
                                onChange={handleInputChange}
                            />
                            <label
                                className="form-check-label"
                                htmlFor="data_publication"
                            >
                                Data Publication
                            </label>
                        </div>

                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="data_management_training"
                                name="data_management_training"
                                onChange={handleInputChange}
                            />
                            <label
                                className="form-check-label"
                                htmlFor="data_management_training"
                            >
                                Data Management Training
                            </label>
                        </div>
                    </div>
                </fieldset>
                <div className="d-grid gap-2">
                    <button
                        type="submit"
                        className="btn btn-secondary btn-green"
                    >
                        Send
                    </button>
                </div>
            </form>
        </div>
    );
}

export default SupportRequest;
