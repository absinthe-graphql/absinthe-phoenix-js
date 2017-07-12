import { Socket } from 'phoenix';

import {
  Options,
  AbsintheRequest,
  SubscriptionRegistry,
  SubscriptionCallback,
  SubscriptionPayload,
  AbsintheResponse,
} from './types'

const CHANNEL: string = '__absinthe__:control'

export default class Client {
  private url: string
  private options: Options
  private socket: Socket
  private channel: any
  private subscriptionRegistry: SubscriptionRegistry

  constructor(url: string, options?: Options) {
    this.url = url
    this.options = options || {}
    this.subscriptionRegistry = {}
  }

  connect(): Promise<any> {
    this.socket = new Socket(this.url, this.options)
    return new Promise((resolve, reject) => {
      this.socket.onClose((event: CloseEvent) => {
        reject(event);
      });
      this.socket.onOpen((event: Event) => {
        this.socket.onMessage(({event, payload, ref}) => {
          if (event === "subscription:data") {
            this.findAndDispatchSubscriptionCallback(payload)
          }
        });
        this.channel = this.socket.channel(CHANNEL)
        this.channel
          .join()
          .receive("ok", () => resolve(this))
          .receive("error", e => reject(e))
          .receive("timeout", () => reject("timeout"))
      });
      this.socket.connect();
    })
  }

  findAndDispatchSubscriptionCallback(payload: SubscriptionPayload): boolean {
    const callback = this.subscriptionRegistry[payload.subscriptionId]
    if (callback) {
      this.dispatchSubscriptionCallback(payload.result, callback)
      return true
    } else {
      return false
    }
  }

  // Override if postprocessing is needed
  dispatchSubscriptionCallback(data: AbsintheResponse, callback: SubscriptionCallback): void {
    callback(data);
  }

  registerSubscription(subscriptionId, callback): void {
    this.subscriptionRegistry[subscriptionId] = callback
  }

  subscribe(request: AbsintheRequest, callback: SubscriptionCallback): Promise<Event> {
    return new Promise((resolve, reject) => {
      const normalizedQuery = this.normalizeQuery(request.query);
      this.channel.push("doc", Object.assign({}, request, {query: normalizedQuery}))
        .receive("ok", resp => {
          if (resp.errors) {
            reject(resp);
          } else {
            this.registerSubscription(resp.subscriptionId, callback);
            resolve(resp)
          }
        })
        .receive("error", e => reject(e))
        .receive("timeout", () => reject("timeout"))
    })
  }

  normalizeQuery(query: any): string {
    if (typeof(query) === "string") {
      return query;
    } else if (typeof(query) === "object" && query.loc) {
      // Supports graphql-tag/loader
      return query.loc.source.body;
    } else {
      throw `Unknown query input: ${typeof(query)}`;
    }
  }

}