const path = require('path');

const iterator = require('./dependencyIterator.js');
const pkg = require(path.join(process.cwd(), 'package.json'));
const ignore = require('ignore');
const _glob = require('glob');
const _copy = require('copy');
const _mkdirp = require('mkdirp');

const glob = (pattern, options) => new Promise((resolve, reject) => {
  options.nodir = true;

  _glob(pattern, options, (err, files) => err ? reject(err) : resolve(files));
});

const copy = (files, dest) => new Promise((resolve, reject) => {
  _copy(
    files, dest,
    err =>  err ? reject(err) : resolve({success: true})
  );
});

const mkdirp = dir => new Promise((resolve, reject) => {
  _mkdirp(dir, err => err ? reject(err) : resolve(dir));
});

const getRelevantFiles = (deps) => Promise.all([
    glob('./**/*', {ignore:[`!./node_modules/{${deps.join(',')}}/**/*`]}),
    glob('./**/*', {ignore:[`./node_modules/**/*`]}),
  ])
    .then(fileLists => [].concat.apply([], fileLists));

const deps = Object.keys(pkg.dependencies);

const api = {
  ignored(){
    return iterator(deps);
  },
  files(){
    return Promise.all([this.ignored(), getRelevantFiles(deps)])
      .then(
        arr => {
          const ignored = arr[0];
          const files = arr[1];

          return ignore().add(ignored).filter(files);
        }
      );
  },
  copy(dest){
    return Promise.all([this.files(), mkdirp(dest)])
      .then(arr => arr[0])
      .then(files => copy(files, dest));
  }
};

module.exports = api;
