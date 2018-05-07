.PHONY: build
build: dist/structured-header.min.js

.PHONY: clean
clean:
	rm dist/ketting.js

.PHONY: test
test: test/httpwg-tests/list.json
	npm test

.PHONY: lint
lint:
	node_modules/.bin/eslint lib/

dist/structured-header.min.js: src/*.js index.js
	mkdir -p dist
	node_modules/.bin/webpack \
		--optimize-minimize \
		-p \
		--display-modules \
		--sort-modules-by size

test/httpwg-tests/list.json:
	git clone https://github.com/httpwg/structured-header-tests test/httpwg-tests
