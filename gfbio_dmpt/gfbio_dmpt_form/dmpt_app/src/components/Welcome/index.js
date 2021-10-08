import React from 'react';
import { Link } from 'react-router-dom';

// TODO: admin like filters -> dedicated views
// TODO: pagination -> via DRF
// TODO: column sorting. data, type etc. -> dedicated view with triggers ?
// TODO: admin style search ? how does admin know what field to search ?
export default function Welcome() {
    console.info('Welcome render ....');
    return (
        <div>
            <h1>Welcome to GFBio DMPT</h1>
            <Link to={{
                pathname: 'catalogs'
            }}>
                Catalogs
            </Link>
            <Link to={{
                pathname: 'start'
            }}>
                Start DMPT
            </Link>
            <Link to={{
                pathname: 'projects'
            }}>
                Projects
            </Link>
        </div>
    );
};
