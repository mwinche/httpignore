#!/usr/bin/env node

const [,,dest] = process.argv;

if(!dest){
  console.log(`USAGE: httpignore-copy [dest]`);
  process.exit(1);
}

const api = require('.');

api.copy(dest)
  .then(() => console.log(`Copy successful`))
  .catch(err => {
    console.error(`Error while copying: ${err}`);
    process.exit(2);
  });
