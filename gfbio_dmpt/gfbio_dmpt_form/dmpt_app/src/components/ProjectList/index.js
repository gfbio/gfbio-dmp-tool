import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom';
import { Col, ListGroup, ListGroupItem, Row } from 'react-bootstrap';
import { SolarSystemLoading } from 'react-loadingg';
import {
    PROJECT_API_ROOT,
    URL_PREFIX
} from '../../constants/api/api_constants';
import RdmoContext from '../RdmoContext';
import { checkBackendParameters } from '../../utils/backend_context';

function useProjectList(token) {
    // console.log('-useProjectList Hook');
    const [projectList, setProjectList] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // console.log(' * use Effect hook');

        async function fetchProjectList() {
            // console.log('  ** async function');
            try {
                setLoading(true);
                // console.log('  ** try before await');
                const response = await axios.get(
                    // `${API_ROOT}projects/projects/`
                    `${PROJECT_API_ROOT}dmptprojects/`,
                    {
                        headers: {
                            'Authorization': `Token ${token}`
                            // 'X-CSRFToken': csrftoken
                        }
                    }
                );
                // console.log('  ** try after await');
                setProjectList(response.data);
                // console.log('  ** try aftert set project list');
            } catch (e) {
                ;
            } finally {
                // console.log('  ** finally set loadionf');
                setLoading(false);
            }
        }

        // console.log(' * call fetchProjectList');
        fetchProjectList();
    }, []);
    // console.log('-before return and end of useProjectList hook');
    return [loading, projectList];
}

function ProjectList() {
    const rdmoContext = useContext(RdmoContext);
    const backendContext = checkBackendParameters(rdmoContext);
    const [loading, projectList] = useProjectList(backendContext.token);
    // FIXME: user permissions, only projects for specific user (admin rights = all projects ?)
    // FIXME SOLVED: default django object level permissions take care of this, depending on user and/or group
    console.log('ProjectList');

    // const rdmoContext = useContext(RdmoContext);
    // console.log('baclend context');
    // console.log(backendContext);

    if (backendContext.isLoggedIn === 'false') {
        return (
            <Redirect
                push
                to={`${URL_PREFIX}`}
            />
        );
    }
    // const redirect = notLoggedInRedirect(backendContext.isLoggedIn);

    console.log(projectList);
    let projects = <></>;
    if (projectList.length) {
        projects = projectList.map((item, index) => {
            return (
                <ListGroupItem>
                    <Link id={index}
                        // TODO: 1. link to dmptproject instead
                        // to={`${URL_PREFIX}start/${item.rdmo_project}`}>{item.title}
                        to={`${URL_PREFIX}start/${item.id}`}>{item.title}
                    </Link>
                </ListGroupItem>
            );
        });
    }

    if (loading) {
        return (
            <div id='projectList'>
                <Row>
                    <Col lg={12}>
                        <SolarSystemLoading color='#81B248' size='large'
                            speed={8}>Loading</SolarSystemLoading>
                    </Col>
                </Row>
            </div>
        );
    }

    return (
        <div id='projectList'>

            <Row>
                <Col lg={12}>
                    <h3>Start a new Data Management Plan</h3>
                </Col>
            </Row>

            <Row className='mt-5'>
                <Col lg={12}>
                    <a href={`${URL_PREFIX}start`}>
                        <i className='mdi mdi-text-box-plus-outline' />
                        Create new DMP</a>
                </Col>
            </Row>

            <Row className='mt-5'>
                <Col lg={12}>
                    <h3>Your data management plans</h3>
                    <ListGroup variant='flush'>{projects}</ListGroup>
                </Col>
            </Row>

        </div>
    );

};

export default ProjectList;
