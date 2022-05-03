import React from 'react';
import { SolarSystemLoading } from 'react-loadingg';

function DmptLoading() {
    return (
        <div className="row">
            <div className="col-12">
                <SolarSystemLoading color="#345AA2" size="large" speed={8}>
                    Loading
                </SolarSystemLoading>
            </div>
        </div>
    );
}

export default DmptLoading;
