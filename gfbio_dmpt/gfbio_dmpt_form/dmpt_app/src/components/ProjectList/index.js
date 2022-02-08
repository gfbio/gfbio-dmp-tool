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
    const [projectList, setProjectList] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchProjectList() {
            try {
                setLoading(true);
                const response = await axios.get(
                    `${PROJECT_API_ROOT}dmptprojects/`,
                    {
                        headers: {
                            'Authorization': `Token ${token}`
                        }
                    }
                );
                setProjectList(response.data);
            } catch (e) {
                ;
            } finally {
                setLoading(false);
            }
        }

        fetchProjectList();
    }, []);
    return [loading, projectList];
}

function ProjectList() {
    const rdmoContext = useContext(RdmoContext);
    const backendContext = checkBackendParameters(rdmoContext);
    const [loading, projectList] = useProjectList(backendContext.token);

    if (backendContext.isLoggedIn === 'false') {
        return (
            <Redirect
                push
                to={`${URL_PREFIX}`}
            />
        );
    }

    let projects = <></>;
    if (projectList.length) {
        projects = projectList.map((item, index) => {
            return (
                <ListGroupItem>
                    <Link id={index}
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
