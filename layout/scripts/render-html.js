'use strict';
const fs = require('fs');
const upath = require('upath');
const sh = require('shelljs');

module.exports = function renderHTML() {
    const sourcePath = upath.resolve(upath.dirname(__filename), '../src/*.html');
    const destPath = upath.resolve(upath.dirname(__filename), '../dist/.');
    sh.cp('-R', sourcePath, destPath)
};
