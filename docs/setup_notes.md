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