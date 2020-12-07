dist.zip: build
	rm -f $@
	cd dist/ && zip -r ../$@ *

build:
	rm -rf dist/
	npx tsc
	cp package.json dist/
	cd dist/ && npm install --production
