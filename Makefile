.PHONY: build
build: dist/structured-header.min.js

.PHONY: clean
clean:
	rm dist/ketting.js

.PHONY: test
test:
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

