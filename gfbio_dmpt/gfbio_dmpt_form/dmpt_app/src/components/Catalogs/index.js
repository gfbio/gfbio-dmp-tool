import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_ROOT } from '../../constants/api/api_constants';

function useCatalogs() {
    const [catalogs, setCatalogs] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchCatalogs() {
            try {
                setLoading(true);
                const response = await axios.get(
                    `${API_ROOT}projects/projects/4/overview/`,   // gfbio catalog
                    {
                        headers: { 'Authorization': 'Token 329ced1de6ee34b19bd24c9b22ee73b64311ffc3' }
                    }
                );
                console.log('response');
                console.log(response.data);
                setCatalogs(response.data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }

        fetchCatalogs();
    }, []);

    return [catalogs, loading];
}

function Catalogs(props) {
    // const bsi = props.bsi || '';
    console.log('CATALOGS');
    console.log(props)
    const [catalogs, loading] = useCatalogs();
    return (
        <div>
            <h1>Catalogs</h1>
            <p>loading: {`${loading}`}</p>
            {`${catalogs}`}
        </div>
    );
}

export default Catalogs;
