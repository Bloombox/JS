
#
## Bloombox: JS Client
#

VERSION ?= v2.0.0b1
TARGET ?= target
VERBOSE ?= no
RELEASE ?= no
PUBLIC ?= no
DOCS ?= docs/

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

GULP_FLAGS ?= --libversion "$(VERSION)" --buildtype "$(GOAL)"
GSUTIL_FLAGS ?= -h "Content-Type: text/javascript" -h "Cache-Control: $(CACHE_CONTROL)" cp -z js -a public-read


all: $(GOAL)
	@echo "Bloombox JS is ready."

serve-docs:
	@cd docs && python -m SimpleHTTPServer

ifeq ($(PUBLIC),no)
docs: $(DOCS)
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

publish-lib:
	@echo "Publishing library..."
	@firebase deploy

publish-docs: docs
	@echo "Publishing docs..."
	@cd $(DOCS) && git init && \
	    git remote add origin git@github.com:bloombox/js.git && \
	    git checkout -b gh-pages && \
	    git add . && \
	    git commit -m "Update docs" && \
	    git push origin gh-pages --force
	@rm -fr $(DOCS)/.git
endif

clean: clean-docs
	@echo "Cleaning targets..."
	@-rm $(RM_FLAGS) $(TARGET)

test:
	@echo "Running testsuite..."
	@karma start --browsers ChromeHeadless --single-run --no-auto-watch karma.conf.js

test-dev:
	@echo "Running testsuite (dev mode)..."
	@karma start karma.conf.js


clean-docs:
	@echo "Cleaning docs..."
	@rm -fr $(DOCS)

distclean: clean
	@echo "Cleaning dependencies..."
	@-rm $(RM_FLAGS) node_modules protobuf/js/node_modules

forceclean: distclean
	@echo "Cleaning submodules..."
	@-rm $(RM_FLAGS) protobuf schema
	@echo "Performing hard reset..."
	@-git reset --hard
	@echo "Sanitizing codebase..."
	@-git clean -xdf

node_modules/:
	@echo "Installing Node modules..."
	@yarn

dependencies: node_modules/ submodules sources

sources:
	@echo "Rendering source templates..."
	@sed 's/__VERSION__/$(VERSION)/g' .tpl/license.txt.tpl > src/license.txt
	@cat third_party/stackdriver/error-reporting.js >> src/license.txt
	@sed 's/__VERSION__/$(VERSION)/g' .tpl/README.md.tpl > README.md

sync-schema: submodules

submodules:
	@git submodule update --init --remote

protobuf/js/node_modules:
	@echo "Initializing ProtobufJS dependencies..."
	@cd protobuf/js && npm install
	@echo "Building ProtobufJS..."
	@cd protobuf/js && PROTOC=$(PROTOC) gulp dist && PROTOC=$(PROTOC) gulp genproto_well_known_types_closure
	@cd protobuf && rm -fv js/package.json js/package-lock.json && git checkout js/package.json

$(SCHEMA)/languages/js: protobuf/js/node_modules
	@echo "Building schema..."
	@$(MAKE) -C schema LANGUAGES=js TABLES=no
	@rm -fr schema/languages/js/{browser,es6,closure,commonjs}

build: dependencies
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
	@echo "Build complete."

release: build dependencies
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
	@cp -fv target/$(VERSION).min.js public/client/
	@cp -fv target/$(VERSION)-debug.min.js public/client/
	@cp -fv target/$(VERSION).min.js public/client.min.js
	@cp -fv target/$(VERSION)-debug.min.js public/client-debug.min.js

serve:
	@echo "Starting test server..."
	@cd $(TARGET) && python -m SimpleHTTPServer

publish-gcs:
	@echo "Publishing library to GCS..."
	@cd public && gsutil -h "Cache-Control: public, max-age=300, s-max-age=7200, stale-while-revalidate=3600, stale-if-error=3600" -m cp -a public-read -z html,js "./*" gs://origin.js.bloombox.cloud/
	@cd public/client && gsutil -h "Cache-Control: public, immutable, max-age=31536000, s-max-age=31536000, stale-while-revalidate=31536000, stale-if-error=31536000" -m cp -a public-read -z js "./*.js" gs://origin.js.bloombox.cloud/client/

publish: build release publish-gcs
	@echo "Publishing private Bloombox JS..."
	@cd target && gsutil $(GSUTIL_FLAGS) \
	    ./*.min.js gs://k9-cdn-bloombox-embed/embed/client/
	@echo "Publishing public Bloombox JS..."
	@firebase deploy
	@echo "Library $(VERSION) published."
	@echo "Publishing to NPM..."
	@npm publish --access public
	@mv package.json package-scoped.json
	@mv package-global.json package.json
	@npm publish --access public
	@mv package.json package-global.json
	@mv package-scoped.json package.json
	@echo "Library '$(VERSION)' published on NPM, with alias '$(ALIAS)'."


.PHONY: docs publish build release

