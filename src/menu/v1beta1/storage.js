/*
 * Copyright 2019, Momentum Ideas, Co. All rights reserved.
 *
 * Source and object computer code contained herein is the private intellectual
 * property of Bloombox, a California Limited Liability Corporation. Use of this
 * code in source form requires permission in writing before use or the
 * assembly, distribution, or publishing of derivative works, for commercial
 * purposes or any other purpose, from a duly authorized officer of Momentum
 * Ideas Co.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Bloombox: Menu Storage
 *
 * @fileoverview Provides local support for caching, storage, indexing, and
 *               other rich stuff with regard to menu data.
 */

/*global goog */

goog.require('bloombox.DEBUG');
goog.require('bloombox.db.MENU_STORE');
goog.require('bloombox.db.acquire');

goog.require('goog.collections.sets');
goog.require('goog.db');

goog.require('goog.pubsub.TopicId');
goog.require('goog.pubsub.TypedPubSub');

goog.require('proto.opencannabis.products.menu.MenuProduct');
goog.require('proto.opencannabis.products.menu.section.Section');

goog.provide('bloombox.menu.processMenu');


goog.scope(function() {
  /**
   * Menu publish/subscribe feed. Receives emitted events for each product and
   * section that changes, as they change.
   *
   * @type {goog.pubsub.TypedPubSub}
   * @package
   */
  bloombox.menu.feed = new goog.pubsub.TypedPubSub(true);

  /**
   * Enumerates menu pub/sub feed topics that other library code can subscribe
   * to. This includes a topic for menu product changes, section changes, and
   * featured products.
   *
   * @enum {string}
   */
  bloombox.menu.FeedTopic = {
    PRODUCTS: 'bb.products',
    SECTIONS: 'bb.sections'
  };

  if (bloombox.DEBUG === true) {
    // subscribe to the menu pub/sub feed
    const rootTopic = /**
     @type {!goog.pubsub.TopicId<*>} */ (
       new goog.pubsub.TopicId(bloombox.menu.FeedTopic.SECTIONS));

    bloombox.menu.feed.subscribe(rootTopic, function(event) {
      // there was some menu event
      bloombox.logging.log('Menu section event emitted over pubsub.',
        {'event': event, 'topic': rootTopic});
    });
  }

  /**
   * Bag of types, which tracks each product type witnessed by this frontend. If
   * it has not seen constituent products from a given section, it won't be
   * here.
   *
   * @type {Set<number>}
   * @package
   */
  bloombox.menu._types = new Set();

  /**
   * Main products topic.
   *
   * @type {!goog.pubsub.TopicId<!proto.opencannabis.products.menu.MenuProduct>}
   */
  const productsTopic = /**
   @type {!goog.pubsub.TopicId<!proto.opencannabis.products.menu.MenuProduct>} */ (
    new goog.pubsub.TopicId(bloombox.menu.FeedTopic.PRODUCTS));

  /**
   * Main sections topic.
   *
   * @type {!goog.pubsub.TopicId<!proto.opencannabis.products.menu.section.Section>}
   */
  const sectionsTopic = /**
   @type {!goog.pubsub.TopicId<!proto.opencannabis.products.menu.section.Section>} */ (
    new goog.pubsub.TopicId(bloombox.menu.FeedTopic.SECTIONS));

  /**
   * Process a product that was retrieved via the API. We store it in any local
   * caching mechanisms and also note the time it was last modified, at least
   * according to our local data state. Additionally, perform any object-level
   * indexing we wish to do.
   *
   * @param {proto.opencannabis.products.menu.MenuProduct} product Product that
   *        was fetched from the server, which we should process.
   * @param {!goog.db.ObjectStore} store Local store to write to.
   * @param {number} ts Timestamp to use for product writes.
   */
  function processProduct(product, store, ts) {
    const key = product.getKey();
    const keyId = key.getId();
    const keyKind = key.getType();

    // add to types index
    bloombox.menu._types.add(keyKind);

    // generate encoded key in b64
    const encodedKey = bloombox.util.b64.encode(
      keyKind.toString() + '::' + keyId);

    // store in local DB first (write it down)
    const data = product.serializeBinary();
    const obj = {
      'p': data,
      'm': ts
    };
    store.put(obj, encodedKey);

    const productSpecificTopic = /**
      @type {!goog.pubsub.TopicId<!proto.opencannabis.products.menu.MenuProduct>} */ (
      new goog.pubsub.TopicId(
        [bloombox.menu.FeedTopic.PRODUCTS,
         'sections',
         keyKind.toString(),
         'products',
         keyId].join('/')));

    bloombox.menu.feed.publish(productSpecificTopic, product);
    bloombox.menu.feed.publish(productsTopic, product);
  }

  /**
   * Process a collection of products fetched for a given section. This method
   * does not expect the complete set of products for the section. For each
   * constituent product, process it locally by adding it to caching and doing any
   * indexing we need to do.
   *
   * @param {proto.opencannabis.products.menu.section.Section} section Catalog
   *        section we are processing in this invocation.
   * @param {Array<proto.opencannabis.products.menu.MenuProduct>} products Items
   *        to process as constituent products in `section`.
   * @param {!goog.db.ObjectStore} store Local store to write to.
   * @param {number} ts Timestamp to use for writes.
   */
  function processSection(section, products, store, ts) {
    products.map((item) => {
      processProduct(item, store, ts);
    });

    bloombox.menu.feed.publish(sectionsTopic, section);
  }

  /**
   * Process an entire menu catalog payload, which may contain one or more stanzas
   * of data, by menu section/product type. Other metadata should be attached to
   * the menu as well, like the current fingerprint value, last modified time, and
   * so on.
   *
   * @param {proto.opencannabis.products.menu.Menu} menu Menu payload to process
   *        for local indexing and storage.
   * @return {?goog.async.Deferred} Asynchronous operation to store menu.
   */
  bloombox.menu.processMenu = function(menu) {
    if (!menu.hasPayload()) return null;

    const sectioned = menu.getPayload();
    bloombox.logging.info('Processing/indexing menu catalog...',
      {'catalog': sectioned, 'count': sectioned.getCount()});

    if (sectioned.getCount() < 1) return null;

    const sections = sectioned.getPayloadList();

    return bloombox.db.acquire((db) => {
      if (db === null) return null;
      const txn = db.createTransaction(
        [bloombox.db.MENU_STORE, bloombox.db.DEFAULT_STORE],
        goog.db.Transaction.TransactionMode.READ_WRITE);

      const store = txn.objectStore(bloombox.db.MENU_STORE);
      const root = txn.objectStore(bloombox.db.DEFAULT_STORE);
      const ts = +(new Date());

      sections.map((payload) => {
        let section = /**
         @type {proto.opencannabis.products.menu.SectionData} */ (payload);
        if (section.getCount() > 0) {
          const productList = section.getProductList();
          const sectionSpec = section.getSection();

          // @TODO(sgammon) support for custom sections
          if (sectionSpec.hasSection()) {
            processSection(
              sectionSpec.getSection(), productList, store, ts);
          }
        }
      });

      const menuFingerprint = menu
        .getMetadata()
        .getSettings()
        .getFingerprint()
        .getHex();

      const menuVersion = menu
        .getMetadata()
        .getVersion();

      root.put(menuFingerprint, 'catalog.fingerprint');
      root.put(menuVersion, 'catalog.version');
      root.put(ts, 'catalog.lastModified');
      bloombox.menu.lastSeenFingerprint = menuFingerprint;
      return txn.wait();
    });
  }
});
