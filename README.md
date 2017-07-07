# absinthe-phoenix

JavaScript support for Absinthe GraphQL subscriptions over Phoenix channels.

## Experimental!

Please note this is currently an experimental implementation. The API and
featureset are subject to dramatic and catastrophic change at any time.

Enjoy!

## Example

Sadly this is what counts for documentation.

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
    client.subscribe({query: subscription}, response => {

      // Executed every time this subscription is broadcast.
      //
      // Put what you want to happen when data is received.
      // (If you're using React, this is likely using `setState()`)
      //
      console.log('Got subscription data', response);
    })
      // Log that you've subscribed, if you want to.
      .then(() => console.log("Subscribed."))
      // Do something with validation errors, etc.
      .catch(e => console.error(`Couldn't subscribe`, e));
  })
  // Do something when you can't connect to the socket/channel
  .catch(e => console.error(`Couldn't connect`, e));
```

## Contributing

The code is written in TypeScript (as are many GraphQL projects in the JS
ecosystem). We'd happily accept help refactoring, documenting, and expanding the
code from more experienced TypeScript developers!

## License

See [LICENSE.md](/.LICENSE.md).