# runtime
DENO := deno run --allow-env --allow-net --unstable

# module
PKG := mongo

define package
$(shell node -p "require('./package.json').$(1)")
endef

# docker
DTAG := $(call package,version)
DIMG := mongo.ts:${DTAG}

# runtime
deno:
	@${DENO} tests/${PKG}.test.ts

all:
	@$(MAKE) -s deno