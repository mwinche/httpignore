import test from 'ava';

function setup(){
  const aggregate = require('../lib/aggregate.js');

  return aggregate();
}

test(`should take a single list of files`, t => {
  const aggregator = setup();

  aggregator.addModule('', [
    'README.md',
    'package.json'
  ]);

  const expected = [
    'README.md',
    'package.json'
  ];

  t.deepEqual(aggregator.files(), expected);
});

test(`should preserve duplicates`, t => {
  const aggregator = setup();

  aggregator.addModule('', [
    'README.md',
    'package.json',
    'README.md'
  ]);

  const expected = [
    'README.md',
    'package.json',
    'README.md'
  ];

  t.deepEqual(aggregator.files(), expected);
});

test(`should prefix for modules`, t => {
  const aggregator = setup();

  aggregator.addModule('lodash', [
    'README.md',
    'package.json',
    'README.md'
  ]);

  const expected = [
    'node_modules/lodash/README.md',
    'node_modules/lodash/package.json',
    'node_modules/lodash/README.md'
  ];

  t.deepEqual(aggregator.files(), expected);
});
