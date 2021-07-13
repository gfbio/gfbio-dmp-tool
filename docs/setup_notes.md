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




--------------------------------------------------------------------------------



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

  - UPDATE: not the latest version here ...  
  - sudo apt purge gitlab-runner
  - sudo userdel gitlab-runner -r 

follow instructions on https://gitlab.gwdg.de/gfbio/gfbio_portal_update/-/settings/ci_cd
as described in "Runner" section under link "Show runner installation instructions"

  - sudo curl -L --output /usr/local/bin/gitlab-runner https://gitlab-runner-downloads.s3.amazonaws.com/latest/binaries/gitlab-runner-linux-amd64
  - sudo chmod +x /usr/local/bin/gitlab-runner
  - sudo useradd --comment 'GitLab Runner' --create-home gitlab-runner --shell /bin/bash
  - sudo gitlab-runner install --user=gitlab-runner --working-directory=/home/gitlab-runner
  - sudo gitlab-runner start


4. sudo gitlab-runner register --url https://gitlab.gwdg.de/ --registration-token TOKEN
  

    (...)
    Enter a description for the runner:
    [qotsa]: 
    Enter tags for the runner (comma-separated):
    dev
    Registering runner... succeeded                     runner=HVAKbzAR
    Enter an executor: custom, docker, ssh, kubernetes, docker-ssh, parallels, shell, virtualbox, docker+machine, docker-ssh+machine:
    shell
    Runner registered successfully. Feel free to start it, but if it's running already the config should be automatically reloaded! 
    
    cloud@qotsa:~$ gitlab-runner list
    Runtime platform                                    arch=amd64 os=linux pid=126850 revision=7f7a4bb0 version=13.11.0
    Listing configured runners                          ConfigFile=/home/cloud/.gitlab-runner/config.toml

    cloud@qotsa:/home/gitlab-runner$ gitlab-runner --version
    Version:      13.11.0
    Git revision: 7f7a4bb0
    Git branch:   13-11-stable
    GO version:   go1.13.8
    Built:        2021-04-20T17:02:30+0000
    OS/Arch:      linux/amd64

7. DEBUGGING:
  
  - problems deleting build files... remove by hand for debugging
    
        pwd
        /home/gitlab-runner/builds/5Num-pdU/0/gfbio/gfbio_dmpt
        
        ls
        cicd     CONTRIBUTORS.txt  LICENSE    manage.py                              pytest.ini    setup.cfg
        compose  docs              locale     merge_production_dotenvs_in_dotenv.py  README.rst
        config   gfbio_dmpt        local.yml  production.yml                         requirements

        sudo rm -rf docs/_build/
    
  - re-run pipeline via git-lab webui
    
  - GDWG ssl bug
    - add daemon.json in /etc/docker/
    
            cat /etc/docker/daemon.json 
            {
              "mtu": 1450
            }
      ==> NOT WORKING
    
  - perform docker build in gitlab runner directory ...
  - add network with mtu=1450 to production.yml

  - model 'question' of rdmo has change that is not reflected in migration file
    this prevents migrate command in ci script (... and elsewhere too)
    
  - sudo rm -rf docs/_build/ .pytest_cache/
      
  - sudo usermod -a -G sudo gitlab-runner 
    
        cloud@qotsa:/home/gitlab-runner/builds/5Num-pdU/0/gfbio/gfbio_dmpt$ groups gitlab-runner 
        gitlab-runner : gitlab-runner sudo docker

 - add gitlab-runner to sudoers
       sudo chmod 640 /etc/sudoers.d/90-cloud-init-users
        cloud@qotsa:/home/gitlab-runner/builds/5Num-pdU/0/gfbio/gfbio_dmpt$ sudo ls -l /etc/sudoers.d/90-cloud-init-users
        -rw-r----- 1 root root 149 Jan 28 20:47 /etc/sudoers.d/90-cloud-init-users
        cloud@qotsa:/home/gitlab-runner/builds/5Num-pdU/0/gfbio/gfbio_dmpt$ sudo vim /etc/sudoers.d/90-cloud-init-users