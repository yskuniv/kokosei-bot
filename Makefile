dist.zip: build
	cd dist/ && zip -r ../$@ *

build:
	npx tsc
