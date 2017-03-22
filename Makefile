.PHONY: docs

docs:
	rm -rf docs
	yarn build
	mv build docs
	sed -i 's/\/static\//static\//g' docs/index.html

