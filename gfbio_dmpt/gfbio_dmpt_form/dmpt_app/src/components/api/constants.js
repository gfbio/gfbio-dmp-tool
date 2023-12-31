// TODO: for production system
export const API_ROOT = '/api/v1/';

// TODO: for local/ development
// export const API_ROOT = 'http://0.0.0.0:8000/api/v1/';

export const PROJECT_API_ROOT = '/dmp/';

// TODO: to work when served in django template this prefix has to match
//  the urls.py + global urls.py entry -> currently (...) regex=r'submissions/ui/', (...)
// TODO: use this prefix when development with django (-->  url('app/', views.DmptFrontendView.as_view()))
// eslint-disable-next-line no-unused-vars

// for updateview:
// const urlPrefix = '/curation/submissions/form/';

// TODO: use this prefix when developing with npm start
// eslint-disable-next-line no-unused-vars
// export const URL_PREFIX = '/';

// TODO: use this prefix when using  the from django views.
//  this applies to production and local environments.
export const URL_PREFIX = '/dmp/create/';

// ---------------------------------------------------------------------
// CONSTANTS USED BY REFACTORED CODE BELOW:
export const SECTION_ROOT = `${PROJECT_API_ROOT}section/`;
export const SECTIONS_ROOT = `${PROJECT_API_ROOT}sections/`;

export const HELPDESK_ROOT = 'https://helpdesk.gfbio.org/browse/';
