Structured Headers parser for Javascript
=======================================

This library is a parser and serializer for the [structured headers][1]
specification.  Currently it's still a draft, so this package is also in alpha
until the specification stabilizes as a RFC.

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
Header: ?T
Header: ?F
```

To parse these header values, use `parseItem`:

```javascript
const sh = require('structured-headers');
console.log(sh.parseItem(header));
```

### Parsing a list

Lists contain items separated by comma Here's an example

```
Header: 5, "foo", bar, ?T
```

To parse these:

```javascript
const sh = require('structured-headers');
console.log(sh.parseList(header));
```

This will result in the following object:

```javascript
[
   {value: 5, parameters: {}},
   {value: 'foo', parameters: {}},
   {value: 'bar', parameters: {}},
   {value: true, parameters: {}},
]
```

This is an example of a more complex list:

```
Header: "foo"; param=1, "bar", ("sublistA", "sublistB")
```

Parsing this list will result in:

```javascript
[
   {value: 'foo', parameters: {param: 1}},
   {value: 'bar', parameters: {}},
   {value: ['sublistA', 'sublistB'], parameters: {}},
]
```


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

The output for this is the following object:

```javascript
{
  foo: { value: 'bar', parameters: {} },
  baz: { value: 5, parameters: {} },
}
```


### Serializing

The serialiser functions work the exact same way, but in opposite direction.
They all return strings.

```javascript
const sh = require('structured-headers');

// Returns "foo", "bar"
sh.serializeList([
  {value: 'foo'},
  {value: 'bar'}
]);

// Returns a=1, b=?0
sh.serializeDictionary({
  a: { value: 1},
  b: { value: false},
});

// Returns 42
sh.serializeItem(42);

// Returns 5.5
sh.serializeItem(5.5);

// Returns "hello world"
sh.serializeItem("hello world");

// Returns ?1
sh.serializeItem(true);

// Returns a base-64 representation like: *aGVsbG8=*
sh.serializeItem(Buffer.from('hello'))
```

Browser support
---------------

There is a minified version of this library in the `browser/` directory. This minified
file will expose a global variable called 'structuredHeader' which contains the rest
of the api.


[1]: https://tools.ietf.org/html/draft-ietf-httpbis-header-structure
