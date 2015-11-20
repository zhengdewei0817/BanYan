reg=--registry=https://registry.npm.taobao.org
install:
	npm install $(reg)
watch: install
	webpack --watch
