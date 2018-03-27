Structured Header parser for Javascript
=======================================

This library is a parser for the [structured header][1] specification.
Currently it's still a draft, so this package is also in alpha until the
specification stabilizes as a RFC.

Installation
------------

Using npm:

```
npm install structured-header
```

Using Yarn:

```
yarn add structured-header
```

API
---

The library exposes 3 functions, and they're used as such:

```js
var header = require('structured-header');

header.parseDictionary('foo=1.23, en="Applepie", da=*w4ZibGV0w6ZydGUK*');
// Returns { foo: 1.23, en: 'Applepie', da: new Buffer('...') };

header.parseList('foo, bar, baz_45');
// Returns ['foo', 'bar', 'baz_45'];

header.parseParameterizedList('abc_123;a=1;b=2; c, def_456, ghi;q="19";r=foo');

// Returns [
//   [ 'abc_123', { a: 1, b: 2, c: null } ],
//   [ 'def_456', {} ],
//   [ 'ghi', { q: '19', r: 'foo' } ]
// ]

```

[1]: https://tools.ietf.org/html/draft-ietf-httpbis-header-structure
