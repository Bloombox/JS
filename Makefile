
#
## Bloombox: JS Client
#

VERSION ?= v2.2.1
TARGET ?= target
VERBOSE ?= no
RELEASE ?= no
PUBLIC ?= no
DOCS ?= docs/
CI ?= no

PROTOC ?= $(shell which protoc)

CACHE_CONTROL_TIMEOUT ?= 3600
CACHE_CONTROL_TIMEOUT_SHARED ?= 86400
CACHE_CONTROL_TRAILER ?= no-transform
CACHE_CONTROL_MODE ?= public

CACHE_CONTROL = $(CACHE_CONTROL_MODE), max-age=$(CACHE_CONTROL_TIMEOUT)
CACHE_CONTROL += s-max-age=$(CACHE_CONTROL_TIMEOUT_SHARED), $(CACHE_CONTROL_TRAILER)

ifeq ($(RELEASE),yes)
GOAL ?= release
else
GOAL ?= build
endif

ifeq ($(VERBOSE),yes)
RM_FLAGS ?= -frv
CP_FLAGS ?= -frv
else
RM_FLAGS ?= -fr
CP_FLAGS ?= -fr
endif

ifeq ($(CI),yes)
KARMA = ./node_modules/karma/bin/karma
KARMA_CONF = karma-ci.conf.js
else
KARMA = $(shell which karma)
KARMA_CONF = karma.conf.js
endif

GULP_FLAGS ?= --libversion "$(VERSION)" --buildtype "$(GOAL)"
GSUTIL_FLAGS ?= -h "Content-Type: text/javascript" -h "Cache-Control: $(CACHE_CONTROL)" cp -z js -a public-read


all: $(GOAL)  ## Build all JS client targets.
	@echo "Bloombox JS is ready."

serve-docs:  ## Serve the JS client docs locally.
	@cd docs && python -m SimpleHTTPServer

ifeq ($(PUBLIC),no)
docs: $(DOCS)  ## Build the JS client docs.
$(DOCS):
	@mkdir -p $(DOCS)
	@java -jar ./node_modules/js-dossier/dossier.jar -c dossier-dev.json
	@cp ./content/docs.css docs/dossier.css
	@cat ./content/docs-private.css >> docs/dossier.css
else
docs: clean-docs $(DOCS)
$(DOCS):
	@mkdir -p $(DOCS)
	@java -jar ./node_modules/js-dossier/dossier.jar -c dossier-public.json
	@cp ./content/docs.css docs/dossier.css

publish-lib:  ## Publish the latest copy of the library.
	@echo "Publishing library..."
	@firebase deploy

publish-docs: docs  ## Publish the latest copy of the docs.
	@echo "Publishing docs..."
	@cd $(DOCS) && git init && \
	    git remote add origin git@github.com:bloombox/js.git && \
	    git checkout -b gh-pages && \
	    git add . && \
	    git commit -m "Update docs" && \
	    git push origin gh-pages --force
	@rm -fr $(DOCS)/.git
endif

clean: clean-docs  ## Clean built targets.
	@echo "Cleaning targets..."
	@-rm $(RM_FLAGS) $(TARGET)

test:  ## Run unit and integration tests with Karma.
	@echo "Running testsuite..."
	@$(KARMA) start --browsers ChromeHeadless --single-run --no-auto-watch $(KARMA_CONF)

test-dev:  ## Run unit and integration tests with Karma, and keep them running.
	@echo "Running testsuite (dev mode)..."
	@karma start karma.conf.js

clean-docs:  ## Clean any built JS client docs.
	@echo "Cleaning docs..."
	@rm -fr $(DOCS)

distclean: clean  ## Clean any built targets and downloaded dependencies.
	@echo "Cleaning dependencies..."
	@-rm $(RM_FLAGS) node_modules protobuf/js/node_modules

forceclean: distclean  ## Clean targets, dependencies, and force-reset/sanitize the codebase.
	@echo "Cleaning submodules..."
	@-rm $(RM_FLAGS) protobuf schema
	@echo "Performing hard reset..."
	@-git reset --hard
	@echo "Sanitizing codebase..."
	@-git clean -xdf

node_modules/:
	@echo "Installing Node modules..."
	@yarn

dependencies: node_modules/ submodules sources  ## Install Node.js modules and Git submodule dependencies.

sources:  ## Re-render sources like the README and license.
	@echo "Rendering source templates..."
	@sed 's/__VERSION__/$(VERSION)/g' .tpl/license.txt.tpl > src/license.txt
	@cat third_party/stackdriver/error-reporting.js >> src/license.txt
	@sed 's/__VERSION__/$(VERSION)/g' .tpl/README.md.tpl > README.md

sync-schema: submodules  ## Sync with current schema.

submodules:  ## Install Git submodules.
	@git submodule update --init

third_party/idom/dist:
	#@echo "Building Incremental DOM..."
	#@cd third_party/idom && yarn && gulp js-closure
	@echo "iDOM is ready."

protobuf/js/node_modules:
	@echo "Initializing ProtobufJS dependencies..."
	@cd protobuf/js && npm install
	@echo "Building ProtobufJS..."
	@cd protobuf/js && PROTOC=$(PROTOC) gulp dist && PROTOC=$(PROTOC) gulp genproto_well_known_types_closure
	@cd protobuf && rm -fv js/package.json js/package-lock.json && git checkout js/package.json

$(SCHEMA)/languages/js:
	@echo "Building schema..."
	@$(MAKE) -C schema LANGUAGES=js TABLES=no
	@rm -fr schema/languages/js/{browser,es6,closure,commonjs}

build: dependencies  ## Build the JS client.
	@echo "Building Bloombox JS..."
	@mkdir -p $(TARGET)
	@gulp $(GULP_FLAGS)
	@cp -fv target/$(VERSION).min.js target/$(VERSION)-debug.min.js
	@cp -fv target/$(VERSION).min.js target/debug.min.js
	@echo "Copying source files..."
	@mkdir -p $(TARGET)/src
	@cp -fr src/ $(TARGET)/src/
	@echo "Copying test files..."
	@cp -f local/test.js $(TARGET)/test.js
	@sed 's/__VERSION__/$(VERSION)/g' local/index.html > $(TARGET)/index.html
	@sed 's/__VERSION__/$(VERSION)/g' local/test.html > $(TARGET)/test.html
	@echo "Build complete."

release: build dependencies  ## Build a version-stamped release of the JS client.
	@echo "Copying debug build..."
	@cp -fv target/$(VERSION).min.js target/$(VERSION)-debug.min.js
	@echo "Building Bloombox JS (RELEASE)..."
	@gulp --release $(GULP_FLAGS)
	@cp -fv target/$(VERSION).min.js target/release.min.js
	@echo "Copying test files..."
	@cp -f local/test.js $(TARGET)/test.js
	@sed 's/__VERSION__/$(VERSION)/g' local/index.html > $(TARGET)/index.html
	@sed 's/__VERSION__/$(VERSION)/g' local/prod.html > $(TARGET)/prod.html
	@echo "Build complete."
	@mkdir -p public/client/
	@cd target && gzip -k9vf $(VERSION)-debug.min.js && \
	                gzip -k9vf $(VERSION).min.js && \
	                brotli -kvZf --lgwin=0 $(VERSION)-debug.min.js && \
	                brotli -kvZf --lgwin=0 $(VERSION).min.js
	@cp -f target/$(VERSION).min.* public/client/
	@cp -f target/$(VERSION)-debug.min.* public/client/
	@cp -f target/$(VERSION).min.js public/client.min.js
	@cp -f target/$(VERSION)-debug.min.js public/client-debug.min.js
	@cp -f target/$(VERSION).min.js.gz public/client.min.js.gz
	@cp -f target/$(VERSION).min.js.br public/client.min.js.br
	@cp -f target/$(VERSION)-debug.min.js public/client-debug.min.js
	@cp -f target/$(VERSION)-debug.min.js.gz public/client-debug.min.js.gz
	@cp -f target/$(VERSION)-debug.min.js.br public/client-debug.min.js.br
	@du -h ./target/$(VERSION)*.min.*

beta:  ## Build a Beta copy of the JS client.
	@echo "Building Bloombox JS (INTERNAL)..."
	@gulp --release --beta $(GULP_FLAGS)
	@cp -fv target/$(VERSION).min.js target/internal.min.js
	@echo "Build complete."
	@cp -fv target/$(VERSION).min.js public/client/$(VERSION)-beta.min.js
	@cp -fv target/$(VERSION).min.js public/client-beta.min.js

serve:  ## Serve the JS client local test harness.
	@echo "Starting test server..."
	@cd $(TARGET) && python -m SimpleHTTPServer

publish-gcs:
	@echo "Publishing library to GCS..."
	@cd public && gsutil -h "Cache-Control: public, max-age=300, s-max-age=7200, stale-while-revalidate=3600, stale-if-error=3600" -m cp -a public-read -z html,js "./*" gs://origin.js.bloombox.cloud/
	@cd public/client && gsutil -h "Cache-Control: public, immutable, max-age=31536000, s-max-age=31536000, stale-while-revalidate=31536000, stale-if-error=31536000" -m cp -a public-read -z js "./*.*" gs://origin.js.bloombox.cloud/client/

publish: build release publish-gcs
	@echo "Publishing private Bloombox JS..."
	@cd target && gsutil $(GSUTIL_FLAGS) \
	    ./*.min.js gs://k9-cdn-bloombox-embed/embed/client/
	@echo "Publishing public Bloombox JS..."
	@firebase deploy
	@echo "Library $(VERSION) published."
	@#echo "Publishing to NPM..."
	@#npm publish --access public
	@#mv package.json package-scoped.json
	@#mv package-global.json package.json
	@#npm publish --access public
	@#mv package.json package-global.json
	@#mv package-scoped.json package.json
	@#echo "Library '$(VERSION)' published on NPM, with alias '$(ALIAS)'."

help:  ## Print this help text.
	@grep -E '^[a-z1-9A-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'


.PHONY: docs publish build release help

