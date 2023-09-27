# GFBio Data Management Planning Tool


[![DOI](https://zenodo.org/badge/687193434.svg)](https://zenodo.org/badge/latestdoi/687193434)


## Description

The system requires a working connection to an [JIRA Service Management](https://www.atlassian.com/software/jira/service-management) (server/data center) instance, since all communication with the users is organised via JIRA issues. 

## Developer Guide

### Settings

Moved to [settings](http://cookiecutter-django.readthedocs.io/en/latest/settings.html)

### Basic Commands

#### Setting Up Your Users

* To create a **normal user account**, just go to Sign Up and fill out the form. Once you submit it, you'll see a "
  Verify Your E-mail Address" page. Go to your console to see a simulated email verification message. Copy the link into
  your browser. Now the user's email should be verified and ready to go.

* To create an **superuser account**, use this command::

    $ python manage.py createsuperuser

For convenience, you can keep your normal user logged in on Chrome and your superuser logged in on Firefox (or similar),
so that you can see how the site behaves for both kinds of users.

#### Type checks

Running type checks with mypy:

      $ mypy gfbio_dmpt

#### Test coverage

To run the tests, check your test coverage, and generate an HTML coverage report::

    $ coverage run -m pytest
    $ coverage html
    $ open htmlcov/index.html

#### Running tests with py.test

    $ pytest

### Live reloading and Sass CSS compilation

Moved
to [Live reloading and SASS compilation](http://cookiecutter-django.readthedocs.io/en/latest/live-reloading-and-sass-compilation.html).

#### Celery

This app comes with Celery.

To run a celery worker:

    cd gfbio_submissions
    celery -A config.celery_app worker -l info

Please note: For Celery's import magic to work, it is important *where* the celery commands are run. If you are in the
same folder with *manage.py*, you should be right.

## Contact Us

Please email any questions and comments to our [Service Helpdesk](mailto:info@gfbio.org) (<info@gfbio.org>).

## Acknowledgements
- This work was supported by the German Research Foundation (DFG) within the project “Establishment of the National Research Data Infrastructure (NFDI)” in the consortium NFDI4Biodiversity (project number [442032008](https://gepris.dfg.de/gepris/projekt/442032008)).
- This work was supported by the German Research Foundation (DFG) within the project "German Federation for Biological Data e.V.: Concept for a sustainable research data management of environmental data for Germany." (project number [408180549](https://gepris.dfg.de/gepris/projekt/408180549)).
