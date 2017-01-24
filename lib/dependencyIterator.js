const fs = require('fs');
const aggregate = require('./aggregate.js');
const resolve = require('resolve-from');

const encoding = 'utf-8';

const readFile = file => new Promise(resolve => {
  fs.readFile(
    file,
    { encoding },
    (err, data) => resolve(data || '')
  );
});

module.exports = (deps) => {
  const aggregator = aggregate();

  const getIgnores = dep => {
    const path = resolve('.', `${dep}/.httpignore`);

    if(!path){
      return Promise.resolve(undefined);
    }

    return readFile(path)
      .then(file => file.split('\n'))
      .then(lines => aggregator.addModule(dep, lines));
  };

  const promises = deps.map(getIgnores)
    .concat(
      readFile('./.httpignore')
        .then(file => file.split('\n'))
        .then(lines => aggregator.addModule('', lines))
    );

  return Promise.all(promises)
    .then(() => aggregator.files());
};
