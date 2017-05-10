const path = require('path');

const iterator = require('./dependencyIterator.js');
const pkg = require(path.join(process.cwd(), 'package.json'));
const ignore = require('ignore');
const _glob = require('glob');
const fs = require('fs-extra');
const _mkdirp = require('mkdirp');
const async = require('promise-async');

const COPY_PARALELL_LIMIT = 100;
const GLOB_OPTS = { nodir: true, follow: true};

const asPromised = task => new Promise((resolve, reject) => {
  try{
    task(
      (err, result) => err !== null ? reject(err) : resolve(result)
    );
  }
  catch(err){
    reject(err);
  }
});

const glob = pattern => asPromised(cb => _glob(pattern, GLOB_OPTS, cb));

const mkdirp = dir => asPromised(cb => _mkdirp(dir, cb))
  .then(() => dir);

const getRelevantFiles = (deps) => Promise.all(
  deps.map(dep => glob(`./node_modules/${dep}/**/*`))
)
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
      .then(files => files.map(file => cb =>
        fs.copy(file, path.join(dest, file), cb)
      ))
      .then(tasks => async.parallelLimit(tasks, COPY_PARALELL_LIMIT))
      .then(() => ({ success: true }));
  }
};

module.exports = api;
