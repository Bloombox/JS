
/*
 * Copyright 2019, Momentum Ideas, Co.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Bloombox JS: DB Init
 *
 * @fileoverview Initialization code for the JS storage layer.
 */

/*global goog */

goog.require('bloombox.logging.info');
goog.require('bloombox.logging.warn');

goog.require('goog.db');
goog.require('goog.db.IndexedDb');
goog.require('goog.db.Transaction');

goog.provide('bloombox.db.DEBUG');
goog.provide('bloombox.db.DEFAULT_STORE');
goog.provide('bloombox.db.ENABLE');
goog.provide('bloombox.db.VERSION');
goog.provide('bloombox.db.setup');


// -- Configuration -- //
/**
 * Database engine enable/disable flag.
 *
 * @define {boolean} bloombox.db.ENABLE Enable or disable DB engine.
 * @export
 */
bloombox.db.ENABLE = goog.define('bloombox.db.ENABLE', true);


/**
 * Database engine debug flag.
 *
 * @define {boolean} bloombox.db.DEBUG Debug flag for DB engine.
 * @export
 */
bloombox.db.DEBUG = goog.define('bloombox.db.DEBUG', false);


/**
 * Database engine version. Incremented with each breaking schema change.
 *
 * @define {number} bloombox.db.VERSION Version indicator for DB schema.
 * @export
 */
bloombox.db.VERSION = goog.define('bloombox.db.VERSION', 1);


/**
 * Name to set on the DB locally, for generic storage.
 *
 * @define {string} bloombox.db.DEFAULT_STORE Name of the DB.
 * @export
 */
bloombox.db.DEFAULT_STORE = goog.define('bloombox.db.DEFAULT_STORE', 'bws');


/**
 * Whether the DB engine has been initialized yet or not.
 *
 * @type {boolean}
 * @nocollapse
 */
bloombox.db._initialized = false;


/**
 * Whether the DB engine is currently initializing or not.
 *
 * @type {boolean}
 * @nocollapse
 */
bloombox.db._initializing = false;


/**
 * Whether the DB engine failed to init.
 *
 * @type {boolean}
 * @nocollapse
 */
bloombox.db._broken = false;


// -- Callbacks -- //
/**
 * Handle an event from IndexedDB indicating that the underlying database is due
 * for an upgrade to the latest schema version.
 *
 * @param {!goog.db.IndexedDb.VersionChangeEvent} ev Event that occurred.
 * @param {!goog.db.IndexedDb} db Reference to the current frontend database.
 */
const databaseUpgradeNeeded = function(ev, db) {
  bloombox.logging.info('Initializing frontend database...',
    {'name': bloombox.db.DEFAULT_STORE, 'version': bloombox.db.VERSION});
  db.createObjectStore(bloombox.db.DEFAULT_STORE);
};

/**
 * A callback that's called if a blocked event is received. When a database is
 * supposed to be deleted or upgraded (i.e. versionchange), and there are open
 * connections to this database, a block event will be fired to prevent the
 * operations from going through until all such open connections are closed.
 * This callback can be used to notify users that they should close other tabs
 * that have open connections, or to close the connections manually.
 *
 * This is passed a VersionChangeEvent that has the version of the database
 * before it was deleted, and "null" as the new version.
 *
 * @param {!goog.db.IndexedDb.VersionChangeEvent} ev
 */
const databaseBlocked = function(ev) {
  bloombox.logging.warn(
    'Active connections to the frontend database prevented opening ' +
    'at version ' + bloombox.db.VERSION + '.', ev);
};


/**
 * Produce a function that can handle completion of database init. Once the
 * frontend database is available, dispatch the provided callback function.
 *
 * @param {function(?goog.db.IndexedDb)} callback Callback to dispatch after
 *        database init. Passed a reference to the active DB.
 * @returns {function(goog.db.IndexedDb)} Nested callback function.
 */
const databaseInitCallback = function(callback) {
  return (db) => {
    let database = /** @type {!goog.db.IndexedDb} */ (db);
    callback(database || null);
  };
};


// -- Setup -- //
/**
 * Setup frontend database storage, via IndexedDB. Usable for caching records
 * locally, like menus and menu changes, account changes, and more. Provides an
 * interface that supports object/key-value-style storage.
 *
 * @param {string} partner Partner code for the active account.
 * @param {string} location Location code for the active account.
 * @param {string} apikey Active API key for the library.
 * @param {function()} callback Function to dispatch once setup is complete.
 */
bloombox.db.setup = function(partner, location, apikey, callback) {
  if (bloombox.db.ENABLE) {
    if (!bloombox.db._initialized && !bloombox.db._initializing) {
      bloombox.db._initializing = true;

      // we are enabled. initialize the DB.
      goog.db.openDatabase(
        bloombox.db.DEFAULT_STORE,
        bloombox.db.VERSION,
        databaseUpgradeNeeded,
        databaseBlocked).addCallback(databaseInitCallback((db) => {
        bloombox.db._initializing = false;
        bloombox.db._initialized = true;
        bloombox.db._broken = !db;
        if (db)
          bloombox.logging.info('Local DB engine is ready.', db);
      }));
    }
  }
  callback();
};
