# -*- coding: utf-8 -*-

import os
from glob import glob

files = glob("*.sql.gz")
for f in files:
    command = 'curl -u cmFYH7ZQoKfroRj: -T {0} "https://owncloud.gwdg.de/public.php/webdav/"'.format(f)
    print('EXECUTE: {0}'.format(command))
    os.system(command)

