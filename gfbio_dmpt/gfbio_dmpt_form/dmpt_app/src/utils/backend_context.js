export default function checkBackendParameters(rdmoContext) {
    let backend = {};
    backend.isLoggedIn = 'false';
    if (window.props !== undefined) {
        backend = window.props;
    }
    rdmoContext.assignBackendContext(backend);
    return backend;
}
