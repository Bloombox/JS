
/*
 * Copyright 2017, Bloombox, LLC. All rights reserved.
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
 * Bloombox Telemetry: Event Queue
 *
 * @fileoverview Provides RPC tools for managing a pool of XHRs.
 */

goog.require('bloombox.logging.log');

goog.require('bloombox.telemetry.BATCH_SIZE');
goog.require('bloombox.telemetry.internals.stats.updateRPCQueued');
goog.require('bloombox.telemetry.rpc.TelemetryRPC');
goog.require('bloombox.util.generateUUID');

goog.require('goog.structs.PriorityQueue');

goog.provide('bloombox.telemetry.internals.EventQueue');
goog.provide('bloombox.telemetry.internals.QueuedEvent');

goog.provide('bloombox.telemetry.prepareQueuedEvent');


/**
 * Enqueue a Telemetry RPC for fulfillment. This util method will also generate
 * a UUID for the transaction if one is not provided.
 *
 * @param {bloombox.telemetry.rpc.TelemetryRPC} rpc RPC to fulfill.
 * @param {number} priority Priority for the request.
 * @param {string=} opt_uuid UUID to use. If not provided, it will be generated.
 * @return {bloombox.telemetry.internals.QueuedEvent} Event, ready to send.
 * @public
 */
bloombox.telemetry.prepareQueuedEvent = function(rpc, priority, opt_uuid) {
  let uuid = opt_uuid === undefined ? bloombox.util.generateUUID() : opt_uuid;
  return new bloombox.telemetry.internals.QueuedEvent(uuid, rpc, priority);
};


/**
 * Event queued to be sent with its RPC.
 *
 * @param {string} uuid UUID for this event.
 * @param {bloombox.telemetry.rpc.TelemetryRPC} rpc RPC object to enqueue.
 * @param {number} priority Priority for this event.
 * @constructor
 * @package
 */
bloombox.telemetry.internals.QueuedEvent = function QueuedEvent(uuid,
                                                                rpc,
                                                                priority) {
  /**
   * RPC that is enqueued-to-send.
   *
   * @type {bloombox.telemetry.rpc.TelemetryRPC}
   * @package
   */
  this.rpc = rpc;

  /**
   * UUID for this event.
   *
   * @type {string}
   * @package
   */
  this.uuid = uuid;

  /**
   * Priority for this event.
   *
   * @type {number}
   * @package
   */
  this.priority = priority;
};

/**
 * Queue for event RPCs that are due to be sent to the Telemetry Service.
 *
 * @constructor
 * @package
 */
bloombox.telemetry.internals.EventQueue = function EventQueue() {
 /**
  * Internal priority queue that holds events-to-be-sent.
  *
  * @type {goog.structs.PriorityQueue<bloombox.telemetry.internals.QueuedEvent>}
  */
 this.queue = new goog.structs.PriorityQueue();

  /**
   * Current count of queued events.
   *
   * @type {number}
   */
 this.count = 0;
};


/**
 * Enqueue an RPC for a telemetry event.
 *
 * @param {number} priority Priority value for this RPC.
 * @param {bloombox.telemetry.internals.QueuedEvent} ev Event to enqueue.
 * @package
 */
bloombox.telemetry.internals.EventQueue.prototype.enqueue = function(priority,
                                                                     ev) {
  this.queue.enqueue(priority, ev);
  this.count++;

  bloombox.telemetry.internals.stats.updateRPCQueued(this.count);
  bloombox.logging.log('Enqueued telemetry event with UUID: ' + ev.uuid + '.');
};


/**
 * Dequeue an RPC for a telemetry event, so it can be dispatched.
 *
 * @param {function(bloombox.telemetry.internals.QueuedEvent)} mapper Mapper
 *        function to handle each dequeued event.
 * @param {?number=} opt_amt Number of events to dequeue. Defaults to the
 *        default batch size which is configurable from the telemetry base
 *        settings.
 * @return {number} Count of events dequeued in this batch.
 * @package
 */
bloombox.telemetry.internals.EventQueue.prototype.dequeue = function(mapper,
                                                                     opt_amt) {
  let countToDequeue = opt_amt ? opt_amt : (
    bloombox.telemetry.BATCH_SIZE), i = 0;

  while (i < countToDequeue) {
    let ev = this.queue.dequeue();
    if (ev) {
      // did we get an event?
      this.count--;
      bloombox.telemetry.internals.stats.updateRPCQueued(this.count);
      mapper(ev);

      // ok dequeue the next one
      i++;
    } else {
      break;
    }
  }
  return i;
};
