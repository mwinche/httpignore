import test from 'ava';

function setup(){
  const aggregate = require('../lib/aggregate.js');

  return aggregate();
}

test(`should take a single list of files`, t => {
  const aggregator = setup();

  aggregator.addFile('', [
    'README.md',
    'package.json'
  ]);

  const expected = [
    'README.md',
    'package.json'
  ];

  t.deepEqual(aggregator.files(), expected);
});
