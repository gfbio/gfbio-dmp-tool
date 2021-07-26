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
                    `${API_ROOT}questions/catalogs/`,
                    {
                        // token of super user (maweber)
                        headers: { 'Authorization': 'Token a801025296b509457327cac484513e62592167a8' }
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
            <h1>RequestLog Detail</h1>
            <p>loading: {`${loading}`}</p>
            {`${catalogs}`}
        </div>
    );
}

export default Catalogs;
