ChangeLog
=========

0.1.0 (2018-12-06)
------------------

* Fully up to date with [draft-ietf-httpbis-header-structure-09][2].
* Package renamed to 'structured-headers'.
* Conversion to typescript.
* The `parseBinary` function is renamed to `parseByteSequence`, to match the
  rename in draft-ietf-httpbis-header-structure-08.
* Support for Booleans.
* The `parseIdentifier` function is renamed to `parseToken`, to match the
  rename in draft-ietf-httpbis-header-structure-09.
* Renamed `parseParameterizedList` to `parseParamList`. It's shorter.

0.0.2 (2018-03-27)
------------------

* Added minified webpacked version.
* Added readme.
* Fixed a small bug in identifier parsing.
* 100% unittest coverage.

0.0.1 (2018-03-26)
------------------

* First version!
* Parses all of the [04 draft of the specification][1].

[1]: https://tools.ietf.org/html/draft-ietf-httpbis-header-structure-04#section-4.2
[2]: https://tools.ietf.org/html/draft-ietf-httpbis-header-structure-09
