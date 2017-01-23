import test from 'ava';
import mock from 'mock-fs';
import proxyquire from 'proxyquire';

const BASE_HTTPIGNORE = `
README.md
package.json
`;

const ONE_HTTPIGNORE = `
package.json
README.md
dist/sample.js
dist/build.json
lib/**/*
`;

const TWO_HTTPIGNORE = `
package.json
README.md
`;

const THREE_HTTPIGNORE = `
./*.es
`;

function setup(){
  const dependencyIterator = proxyquire('../lib/dependencyIterator.js',
    { 'resolve-from': (dir, path) => path }
  );

  mock({
    "one/.httpignore": ONE_HTTPIGNORE,
    "@scope/two/.httpignore": TWO_HTTPIGNORE,
    "thr-ee/.httpignore": THREE_HTTPIGNORE,
    './.httpignore': BASE_HTTPIGNORE
  });

  return dependencyIterator;
}

test.afterEach(mock.restore);

test(`should loop over all provided dependencies and
  look for .httpignore files`, t => {
    const iterator = setup();

    const deps = [
      'one',
      '@scope/two',
      'thr-ee'
    ];

    const expected = [
      './README.md',
      './package.json',
      './node_modules/one/package.json',
      './node_modules/one/README.md',
      './node_modules/one/dist/sample.js',
      './node_modules/one/dist/build.json',
      './node_modules/one/lib/**/*',
      './node_modules/@scope/two/package.json',
      './node_modules/@scope/two/README.md',
      './node_modules/thr-ee/./*.es',
      './.httpignore',
      './node_modules/one/.httpignore',
      './node_modules/@scope/two/.httpignore',
      './node_modules/thr-ee/.httpignore'
    ];

    return iterator(deps)
      .then(ignored => t.deepEqual(ignored.sort(), expected.sort()));
});
