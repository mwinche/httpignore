const path = require('path');

const iterator = require('./dependencyIterator.js');
const pkg = require(path.join(process.cwd(), 'package.json'));
const _glob = require('glob');
const ignore = require('ignore');
const _copy = require('copy');

const glob = pattern => new Promise((resolve, reject) => {
  _glob(pattern, { nodir: true }, (err, files) => err ? reject(err) : resolve(files));
});

const copy = (files, dest) => new Promise((resolve, reject) => {
  _copy(
    files, dest,
    err =>  err ? reject(err) : resolve({success: true})
  );
});

const api = {
  ignored(){
    const deps = Object.keys(pkg.dependencies);

    return iterator(deps);
  },
  files(){
    return Promise.all([this.ignored(), glob('./**/*')])
      .then(
        ([ignored, files]) => ignore().add(ignored).filter(files)
      );
  },
  copy(dest){
    return this.files()
      .then(files => copy(files, dest));
  }
};

module.exports = api;
