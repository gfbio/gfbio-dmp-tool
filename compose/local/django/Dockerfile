# python version as variable
ARG PYTHON_VERSION=3.9-slim-buster

# alias for the image 
FROM python:${PYTHON_VERSION} as python

# python build stage
FROM python as python-build-stage

# set build environment
ARG BUILD_ENVIRONMENT=local


# Install apt packages
RUN apt-get update && apt-get install --no-install-recommends -y \
  # dependencies for building Python packages
  build-essential \
  # psycopg2 dependencies
  libpq-dev \
  # rdmo dependencies
  libxml2-dev \
  libxslt-dev \
  zlib1g-dev \
  git


# Requirements are installed here to ensure they will be cached.
COPY ./requirements .

# Create Python Dependency and Sub-Dependency Wheels.
RUN pip wheel --wheel-dir /usr/src/app/wheels  \
  -r ${BUILD_ENVIRONMENT}.txt


# Python 'run' stage
FROM python as python-run-stage

ARG BUILD_ENVIRONMENT=local
ARG APP_HOME=/app

ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1
ENV BUILD_ENV ${BUILD_ENVIRONMENT}

WORKDIR ${APP_HOME}

# NOTE:  <06-10-21, Claas> # 
# Please keep that as it enables pandoc to find the logo and extra style for dmp export
RUN mkdir -p /static/images
COPY ./gfbio_dmpt/static/images/gfbio_logo.png /static/images/
COPY ./gfbio_dmpt/static/fonts/lato/* /usr/share/fonts/truetype/lato/
COPY ./gfbio_dmpt/static/export_config/template.latex /static/export_config/
COPY ./gfbio_dmpt/static/export_config/ost.cls /static/export_config/

# Install required system dependencies
RUN apt-get update && apt-get install --no-install-recommends -y \
  # psycopg2 dependencies
  libpq-dev \
  # Translations dependencies
  gettext \
  # rdmo export dependencies
  pandoc \
  texlive \
  texlive-generic-extra \
  texlive-xetex \
  lmodern \
  librsvg2-bin \
  # cleaning up unused files
  && apt-get purge -y --auto-remove -o APT::AutoRemove::RecommendsImportant=false \
  && rm -rf /var/lib/apt/lists/*

# All absolute dir copies ignore workdir instruction. All relative dir copies are wrt to the workdir instruction
# copy python dependency wheels from python-build-stage
COPY --from=python-build-stage /usr/src/app/wheels  /wheels/

# use wheels to install python dependencies
RUN pip install --no-cache-dir --no-index --find-links=/wheels/ /wheels/* \
  && rm -rf /wheels/

RUN /usr/local/bin/python -m pip install --upgrade pip setuptools

COPY ./compose/production/django/entrypoint /entrypoint
RUN sed -i 's/\r$//g' /entrypoint
RUN chmod +x /entrypoint

COPY ./compose/local/django/start /start
RUN sed -i 's/\r$//g' /start
RUN chmod +x /start


COPY ./compose/local/django/celery/worker/start /start-celeryworker
RUN sed -i 's/\r$//g' /start-celeryworker
RUN chmod +x /start-celeryworker

COPY ./compose/local/django/celery/beat/start /start-celerybeat
RUN sed -i 's/\r$//g' /start-celerybeat
RUN chmod +x /start-celerybeat

COPY ./compose/local/django/celery/flower/start /start-flower
RUN sed -i 's/\r$//g' /start-flower
RUN chmod +x /start-flower


# copy application code to WORKDIR
COPY . ${APP_HOME}

ENTRYPOINT ["/entrypoint"]
