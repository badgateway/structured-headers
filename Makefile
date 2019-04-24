export PATH:=./node_modules/.bin/:$(PATH)

SOURCE_FILES:=$(shell find src/ -type f -name '*.ts')

.PHONY: build
build: browser/structured-header.min.js

.PHONY: clean
clean:
	rm -r browser/
	rm -r dist/

.PHONY: test
test: lint test/httpwg-tests/list.json dist/build
	nyc mocha

.PHONY: test-debug
test-debug:
	mocha --inspect-brk

.PHONY: lint
lint:
	tslint -c tslint.json --project tsconfig.json 'src/**/*.ts' 'test/**/*.ts'

.PHONY: fix
fix:
	tslint -c tslint.json --project tsconfig.json 'src/**/*.ts' 'test/**/*.ts' --fix

.PHONY: watch
watch:
	tsc --watch

.PHONY: browserbuild
browserbuild: dist/build
	mkdir -p browser
	webpack \
		--optimize-minimize \
		-p \
		--display-modules \
		--sort-modules-by size

dist/build: $(SOURCE_FILES)
	tsc
	@# A fake file to keep track of the last build time
	touch dist/build

browser/structured-header.min.js: browserbuild

test/httpwg-tests/list.json:
	git clone https://github.com/httpwg/structured-header-tests test/httpwg-tests
