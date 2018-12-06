Structured Headers parser for Javascript
=======================================

This library is a parser for the [structured headers][1] specification.
Currently it's still a draft, so this package is also in alpha until the
specification stabilizes as a RFC.

Installation
------------

Using npm:

```
npm install structured-headers
```

API
---

### Parsing an item

The following are examples of `item` headers:

Parsed as string

```
# Parsed into string
Header: "foo"
Header: bar

# Parsed into number
Header: 5
Header: -10
Header: 5.01415

# Parsed into boolean
Header: !T
Header: !F
```

To parse these header values, use `parseItem`:

```javascript
const sh = require('structured-headers');
console.log(sh.parseItem(header));
```

### Parsing a list

Lists contain items separated by comma Here's an example

```
Header: 5, "foo", bar, !T
```

To parse these:

```javascript
const sh = require('structured-headers');
console.log(sh.parseList(header));
```

This will result in `[5, "foo", "bar", true]`.

### Parsing a dictionary

A dictionary is a key->value object. Examples:

```javascript
Example: foo: "Bar"; baz: 5
```

Dictionary keys can be any item. This is parsed with:

```javascript
const sh = require('structured-headers');
console.log(sh.parseDictionary(header));
```

The output for this is an object: `{ foo: 'bar', baz: 5}`.

### Parsing a list of lists

A list of list is a 2-dimensional array. The top level is separated
by commas, and the second level is separated by semi-colons.

Every member in this list can be any item (string, boolean, number).


```
Example: "foo";"bar", "baz", "bat"; "one"
```

Parsing:

```javascript
const sh = require('structured-headers');
console.log(sh.parseListList(header));
```

This will result in `[['foo', 'bar'], ['baz'], ['bat', 'one']]`.

### Parsing a parameterized list

A parameterized list is a list for which every member can have
one or more parameters, specified as a dictionary.

```
ExampleParamList: foo; param1: "value1", bar; "param2": "value2"
```

Parsing:


```javascript
const sh = require('structured-headers');
console.log(sh.parseParameterizedList(header));
```

This will result in `[['foo', { param1: "value1" }], ['bar', { param2: "value2" }]`.


Browser support
---------------

There is a minified version of this library in the `browser/` directory. This minified
file will expose a global variable called 'structuredHeader' which contains the rest
of the api.


[1]: https://tools.ietf.org/html/draft-ietf-httpbis-header-structure
