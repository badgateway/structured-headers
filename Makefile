export PATH:=./node_modules/.bin/:$(PATH)

.PHONY: build
build: browser/structured-header.min.js tsbuild

.PHONY: clean
clean:
	rm -r browser/
	rm -r dist/

.PHONY: test
test: lint test/httpwg-tests/list.json
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

.PHONY: tsbuild
tsbuild:
	tsc

.PHONY: watch
watch:
	tsc --watch

.PHONY: browserbuild
browserbuild:
	mkdir -p browser
	webpack \
		--optimize-minimize \
		-p \
		--display-modules \
		--sort-modules-by size

browser/structured-header.min.js: browserbuild

test/httpwg-tests/list.json:
	git clone https://github.com/httpwg/structured-header-tests test/httpwg-tests
