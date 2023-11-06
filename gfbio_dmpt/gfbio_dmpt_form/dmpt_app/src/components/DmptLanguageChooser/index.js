import React from 'react';
import PropTypes from 'prop-types';
import availableLanguages from "./availableLanguages";

function DmptLanguageChooser(props) {
    const { language, setLanguage} = props
    
    if (language.shortCode !== "en") {
        return <div className='language-chooser row mb-3'>
            <a className='click-link' onClick={() => {
                setLanguage(availableLanguages.english);
            }}>
            <i>Switch language to English</i>
            </a>
        </div>
    }
    if (language.shortCode !== "de") {
        return (
            <div className='language-chooser row mb-3'>
                <a className='click-link' onClick={() => {
                    setLanguage(availableLanguages.german);
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