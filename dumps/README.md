# Dumps for/of rdmo and gfbio_dmpt testing

## 28.10.2024

### local_dump_with_2.2.2.json

    docker-compose -f local.yml run --rm django python manage.py dumpdata conditions domain options overlays projects questions  > local_dump_with_2.2.2.json


basically everything from local database is in here due to objects that have
relations to other objects (user, tasks, projects, etc.. ), otherwise not
consistent dump could be loaded in tests as fixtures.
A nice clean dump would be great.
u