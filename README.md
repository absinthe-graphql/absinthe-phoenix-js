# absinthe-phoenix

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

JavaScript support for Absinthe GraphQL subscriptions over Phoenix channels.

## DEPRECATED

Superseded by [@absinthe/socket](https://github.com/absinthe-graphql/absinthe-socket/tree/master/packages/socket).

## Examples

The following examples configure a client that connects to a Phoenix socket at
`"ws://localhost:4000/socket"`, sends a subscription to Absinthe operating there,
and registers a callback to be invoked every time a result is broadcast for that
subscription.

### ES6 Example

From, for example, a React project:

```javascript
// Import the client class
import Client from 'absinthe-phoenix';

// Instantiate the client, giving a ws:// or wss:// URL to the Phoenix socket
const client = new Client("ws://localhost:4000/socket");

// Connect to the socket and Absinthe channel
client.connect()

  // Yay, you've connected.
  .then(() => {
    // Log it, just because.
    console.log('Connected.');

    // Define a subscription.
    //
    // Note that the document can be a string, as shown here, or a value
    // imported by graphql-tag/loader, eg:
    //
    //     import subscription from 'subscription.graphql';
    //
    const subscription = `
    subscription AnExample {
      aSubscriptionField {
        aChildField
      }
    }
    `;

    // Send the subscription. You can also pass, eg, `variables`, as an option.
    client.subscribe({query: subscription}, ({ subscriptionId, result }) => {

      // Executed every time this subscription is broadcast.
      //
      // Put what you want to happen when data is received.
      // (If you're using React, this is likely using `setState()`)
      //
      console.log(`Subscription Data [ID:${subscriptionId}]`, result);
    })
      // Log that you've subscribed, if you want to.
      .then(({ subscriptionId }) => {
        console.log(`Subscription Created [ID:${subscriptionId}]`);
      })
      // Do something with validation errors, etc.
      .catch(resp => console.error(`Subscription Failed`, resp));
  })
  // Do something when you can't connect to the socket/channel
  .catch(e => console.error(`Couldn't connect`, e));
```

To unsubscribe:

```javascript
client.unsubscribe(subscriptionId)
  .then(() => console.log(`Subscription Removed [ID: ${subscriptionId}]`))
  .catch(resp => console.error(`Couldn't Unsubscribe`, resp));
```

### Browser Example

If you're using absinthe-phoenix as standalone, embedded dependency (eg, in
your own GraphiQL), you can use unpkg, eg:

```html
<script src="//unpkg.com/absinthe-phoenix"></script>
<script>
  var client = new AbsinthePhoenix.Client("ws://your.host/socket");
  // Use client similar to ES6 example
</script>
```

Note you may want to use a specific version of `absinthe-phoenix` from unpkg,
eg, `//unpkg.com/absinthe-phoenix@0.1.0`.

## Contributing

The code is written in TypeScript (as are many GraphQL projects in the JS
ecosystem). We'd happily accept help refactoring, documenting, and expanding the
code from more experienced TypeScript developers!

## License

See [LICENSE.md](./LICENSE.md).
