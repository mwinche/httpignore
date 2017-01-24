httpignore
==========

[![Build Status](https://travis-ci.org/mwinche/httpignore.svg?branch=master)](https://travis-ci.org/mwinche/httpignore)

This is a utility and CLI for interfacing with `.httpignore` files.

### A word on `.httpignore` files

I made them up (thanks to @lund0n for the inspiration). I wanted a way to be
able to serve up files from my `node_modules` directory but to allow individual
modules to mark things which, while they are published, ought not to be served
over HTTP.

My use case was for a private npm registry where I don't mind if internal people
can see, say, our README.md files, but I don't want all our internal documentation
to be customer facing.

The approach is simple and should be very familiar if you've used a `.npmignore`
or a `.gitignore` file. It follows all the same rules as those files. In this
case they define what files ought *not* be served over HTTP.

### Installation

`npm install httpignore`. All the normal flags apply.

### API

#### ignored()

Returns a promise which resolves with an array of all the filters that are being
applied via the `.httpignore` files.

#### files()

Returns a promise which resolves with an array of all files which are allowed
after the filters are applied.

#### copy(dest)

Returns a promise which resolves once all files from the `files` call are
copied to the directory `dest`. If `dest` does not exist, it will create it.

### CLI

Usage:

```
httpignore-copy <dest>
```

Performs the `copy` api method on the directory specified by `dest`. Paths are
relative to the current working directory.

### Development

A standard `npm install` and `npm test` will get you running here. Please merge
squash PRs.

### License

[MIT](https://opensource.org/licenses/MIT)

Copyright 2016 Matt Winchester

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
