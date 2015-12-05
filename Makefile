reg=--registry=https://registry.npm.taobao.org
logs_dir=logs
build_dir=build

# 如果存在logs文件夹，就不创建
define MKDIR
	test -d $(logs_dir) || mkdir -p $(logs_dir)
endef

# 删除build
define RMBUILD
	test -d $(build_dir) || rm -rf $(build_dir)
endef



# 更新依赖
install:
	$(MKDIR)
	npm install $(reg)

# watch
watch: install
	webpack --watch --progress

# 生产时，编译静态资源
pro:
	$(RMBUILD)
	@NODE_ENV=production webpack --progress
	gulp build