SOURCE_FILES:=$(shell find src/ -type f -name '*.ts')

.PHONY: clean
clean:
	rm -r dist/

.PHONY: test
test: lint test/httpwg-tests/list.json dist/build
	node_modules/.bin/nyc node_modules/.bin/mocha

.PHONY: test-debug
test-debug:
	node_modules/.bin/mocha --inspect-brk

.PHONY: lint
lint:
	node_modules/.bin/eslint --quiet 'src/**/*.ts'

.PHONY: fix
fix:
	node_modules/.bin/eslint --quiet 'src/**/*.ts' --fix

.PHONY: watch
watch:
	node_modules/.bin/tsc --watch

dist/build: $(SOURCE_FILES)
	node_modules/.bin/tsc
	@# A fake file to keep track of the last build time
	touch dist/build

test/httpwg-tests/list.json:
	git clone https://github.com/httpwg/structured-header-tests test/httpwg-tests
