import React, {useEffect, useState} from 'react';
import axios from "axios";
import PropTypes from "prop-types";
import {SECTION_ROOT} from "../../constants/api/api_constants";

const useDmptSection = (catalogId, sectionIndex, token) => {
    const [section, setSection] = useState({});
    useEffect(() => {
        async function prepareDmptSection() {
            try {
                const result = await axios.get(
                    `${SECTION_ROOT}${catalogId}/${sectionIndex}`,
                    {
                        headers: {Authorization: `Token ${token}`},
                    },
                );
                setSection(result.data);
            } catch (error) {
                console.error(error);
            }
        }

        prepareDmptSection();
    }, []);
    return [section];
};

function DmptSection(props) {
    const {catalogId, token} = props;
    // TODO: as prop for this component when accessing section/tab wise
    const sectionIndex = 0;
    const [section] = useDmptSection(catalogId, sectionIndex, token);
    console.log('DmptSection | section: ', section);
    return (
        <h2>DmptSection</h2>
    );
}

DmptSection.propTypes = {
    token: PropTypes.string.isRequired,
    catalogId: PropTypes.number.isRequired,
};

export default DmptSection;
