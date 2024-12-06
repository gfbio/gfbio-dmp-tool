import React from 'react';

export default function getMandatoryMessage(isOptional, lang) {
    if (isOptional) {
        return <span />;
    }
    if (lang?.shortCode === 'DE') {
        return (
            <span className="mandatory">(Dieses Feld ist erforderlich)</span>
        );
    }
    return <span className="mandatory">(This field is mandatory)</span>;
}
