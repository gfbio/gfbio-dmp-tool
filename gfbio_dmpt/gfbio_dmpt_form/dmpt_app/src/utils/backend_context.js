export function checkBackendParameters(rdmoContext) {
    let backend = {};
    backend.isLoggedIn = 'false';
    if (window.props !== undefined) {
        backend = window.props;
    }
    rdmoContext.assignBackendContext(backend);
    return backend;
};

// TODO: also delete rdmo project immediatly ?
export function resetContext(rdmoContext) {
    rdmoContext.assignFormData({});
    rdmoContext.assignProjectId(-1);
    rdmoContext.assignProjectValues({});
    rdmoContext.assignDmptProjectId(-1);
};
