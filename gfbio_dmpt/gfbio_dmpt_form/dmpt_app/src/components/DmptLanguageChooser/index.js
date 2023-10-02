import React from 'react';
import PropTypes from 'prop-types';

function DmptLanguageChooser(props) {
    const { language, setLanguage} = props
    
    if (language.shortCode != "EN") {
        return <div className='language-chooser row mb-3'>
            <a className='click-link' onClick={() => {
                    setLanguage(
                        {
                            name:"english",
                            shortCode:"EN",
                            acceptLanguageString: "en-US;"
                        }
                    ); 
                }}>
                <i>Switch language to English</i>
            </a>
        </div>
    }
    if (language.shortCode != "DE") {
        return (
            <div className='language-chooser row mb-3'>
                <a className='click-link' onClick={() => {
                    setLanguage(
                        {
                            name:"deutsch",
                            shortCode:"DE",
                            acceptLanguageString: "de-DE"
                        }
                    );
                }}>
                    <i>Switch language to German</i>
                </a>
            </div>
        );
    }
}

DmptLanguageChooser.propTypes = {
    language: PropTypes.object,
    setLanguage: PropTypes.func,
};

export default DmptLanguageChooser;