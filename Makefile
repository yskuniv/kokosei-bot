dist.zip: build
	rm -f $@ && cd dist/ && zip -r ../$@ *

build:
	npx tsc
