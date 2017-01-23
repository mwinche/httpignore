import test from 'ava';
import mock from 'mock-fs';
import path from 'path';
import proxyquire from 'proxyquire';

const PACKAGE_JSON = {
  name: 'package-name',
  dependencies: {
    'one': '1.2.3',
    '@scope/two': 'latest',
    'thr-ee': '*'
  },
  devDependencies: {
    'four': '2.x'
  }
};

const IGNORES = [
  "./README.md",
  "./package.json",
  "./.httpignore",
  "./node_modules/one/package.json",
  "./node_modules/one/README.md",
  "./node_modules/one/dist/sample.js",
  "./node_modules/one/dist/build.json",
  "./node_modules/one/lib/**/*",
  "./node_modules/one/.httpignore",
  "./node_modules/@scope/two/package.json",
  "./node_modules/@scope/two/README.md",
  "./node_modules/@scope/two/.httpignore",
  "./node_modules/thr-ee/./*.es",
  "./node_modules/thr-ee/.httpignore",
];

const copyStub = (() => {
  let count = 0;
  let files, dest;
  const stub = (_files, _dest, cb) => {
    files = _files;
    dest = _dest;
    cb(null, _files);
  };

  stub.reset = () => {
    count = 0;
    files = undefined;
    dest = undefined;
  };
  stub.files = () => files;
  stub.dest = () => dest;
  stub.count = () => count;

  return stub;
})();

function setup(){
  copyStub.reset();

  const requireMocks = {
    './dependencyIterator.js': () => Promise.resolve(IGNORES),
    'copy': copyStub
  };

  requireMocks[path.join(process.cwd(), 'package.json')] = PACKAGE_JSON;

  const api = proxyquire('../lib/index.js', requireMocks);

  const mocks = {
    "./node_modules/one/dist/main.js": 'console.log("just a mock");',
    "./node_modules/@scope/two/styles.css": 'console.log("just a mock");',
    "./node_modules/@scope/two/styles.min.css": 'console.log("just a mock");',
    "./node_modules/@scope/two/README.md": '# Just a mock',
    "./README.md": '# Just a mock',
    "./node_modules/one/package.json": '{ "mock": true }',
    "./node_modules/one/lib/index.js": 'console.log("just a mock");',
    "./node_modules/one/dist/sample.js": 'console.log("just a mock");',
    "./node_modules/one/dist/build.json": '{ "mock": true }',
    "./node_modules/one/dist/other.json": '{ "mock": true }'
  };

  mock(mocks);

  return api;
}

test.afterEach(mock.restore);

test(`should give you a list of what filters are being applied`, t => {
  const api = setup();

  return api.ignored()
    .then(files => t.deepEqual(files.sort(), IGNORES.sort()));
});

test(`should tell which files are allowed`, t => {
  const expected = [
    './node_modules/one/dist/main.js',
    './node_modules/@scope/two/styles.css',
    './node_modules/@scope/two/styles.min.css',
    './node_modules/one/dist/other.json'
  ];

  const api = setup();

  return api.files()
    .then(files => t.deepEqual(files.sort(), expected.sort()));
});

test(`should do the copy`, t => {
  const expectedFiles = [
    './node_modules/one/dist/main.js',
    './node_modules/@scope/two/styles.css',
    './node_modules/@scope/two/styles.min.css',
    './node_modules/one/dist/other.json'
  ];

  const expectedDest = './dest';

  const api = setup();

  return api.copy(expectedDest)
    .then(({ success }) => {
      t.true(success, `did not return expected result`);
      t.is(copyStub.count(), 0, `copyStub was never called`);
      t.deepEqual(
        copyStub.files().sort(),
        expectedFiles.sort(),
        `Didn't try to copy the expected files`);
      t.is(copyStub.dest(), expectedDest, `Didn't try to copy to the expected destination`);
    });
});
