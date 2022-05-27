import React from 'react';
import { SolarSystemLoading } from 'react-loadingg';
import PropTypes from 'prop-types';

function DmptLoading(props) {
    const { text } = props;
    const paragraph = text !== '' ? <h6>{text}</h6> : <></>;
    return (
        <div className="row">
            <div className="col-12">
                <SolarSystemLoading color="#345AA2" size="large" speed={8}>
                    Loading
                </SolarSystemLoading>
                {paragraph}
            </div>
        </div>
    );
}

DmptLoading.defaultProps = {
    text: '',
};

DmptLoading.propTypes = {
    text: PropTypes.string,
};
export default DmptLoading;
