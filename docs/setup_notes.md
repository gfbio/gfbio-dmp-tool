# RDMO setup

- add apt install commands to local & production Dockerfile to install RDMO
  dependencies as described
  here: https://rdmo.readthedocs.io/en/latest/installation/index.html
  
- comment AUTH_USER_MODEL because of RMDO
- adapt requirements because of RMDO
  
## commands so far ...

- docker-compose -f local.yml build
- docker-compose -f local.yml run --rm django python manage.py migrate
- docker-compose -f local.yml run --rm django python manage.py setup_groups
- docker-compose -f local.yml run --rm django python manage.py createsuperuser

# GitLab CI 

## local

1. create .gitlab-ci.yml file in project root

5. content in .gitlab-ci.yml is default from cookie-cutter


    stages:
      - lint
      - test
    
    variables:
      POSTGRES_USER: 'gfbio_dmpt'
      POSTGRES_PASSWORD: ''
      POSTGRES_DB: 'test_gfbio_dmpt'
      POSTGRES_HOST_AUTH_METHOD: trust
      CELERY_BROKER_URL: 'redis://redis:6379/0'
    
    flake8:
      stage: lint
      image: python:3.9-alpine
      before_script:
        - pip install -q flake8
      script:
        - flake8
    
    pytest:
      stage: test
      image: docker/compose:latest
      tags:
        - docker
      services:
        - docker:dind
      before_script:
        - docker-compose -f local.yml build
        # Ensure celerybeat does not crash due to non-existent tables
        - docker-compose -f local.yml run --rm django python manage.py migrate
        - docker-compose -f local.yml up -d
      script:
        - docker-compose -f local.yml run django pytest


6. push branch with changes to start pipeline with this config

## in gitlab

2. enable ci/cd for project
 

## on remote host

- apt search gitlab-runner


    Sorting... Done
    Full Text Search... Done
    gitlab-runner/focal 11.2.0+dfsg-2ubuntu1 amd64
      GitLab Runner - runs continuous integration (CI) jobs

3. sudo apt install gitlab-runner

4. sudo gitlab-runner register


    ERRO[0000] Docker executor: prebuilt image helpers will be loaded from /var/lib/gitlab-runner. 
    Running in system-mode.                            
                                                       
    Please enter the gitlab-ci coordinator URL (e.g. https://gitlab.com/):
    https://gitlab.gwdg.de/
    Please enter the gitlab-ci token for this runner:
    (...)
    Please enter the gitlab-ci description for this runner:
    [qotsa]: gfbio_dmpt_runner
    Please enter the gitlab-ci tags for this runner (comma separated):
    gfbio, dmpt, rdmo 
    Registering runner... succeeded                     runner=8bpM8WiD
    Please enter the executor: docker+machine, kubernetes, parallels, ssh, virtualbox, docker-ssh+machine, docker, docker-ssh, shell:
    shell
    Runner registered successfully. Feel free to start it, but if it's running already the config should be automatically reloaded! 
