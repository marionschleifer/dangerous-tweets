# dangerous-tweets

```bash
# create a react app
npx create-react-app dangerous-tweets
cd dangerous-tweets

# install dependencies
npm install --save graphql graphql-tag @apollo/react-hooks apollo-client apollo-link-ws subscriptions-transport-ws apollo-cache-inmemory
```

Create a Hasura server on Heroku: https://heroku.com/deploy?template=https://github.com/hasura/graphql-engine-heroku

View the app, it opens Hasura console.

Create a table:
```
Table name: tweets
Columns:
- id        | type: uuid, default: gen_random_uuid()
- raw       | type: text
- sanitized | type: text, nullable

Primary key: id
```

Copy the Heroku app url: `<you-app-name>.herokuapp.com`

Remix the Glitch project https://glitch.com/edit/#!/pitch-waste and replace endpoint with your heroku app.

Create an event trigger:

```
Trigger name: santize
Schema/Table: public tweets
Trigger operations: Insert
Webhook URL: https://pitch-waste.glitch.me/ (your glitch url)
```

Setup Apollo client:
```js
// index.js

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { WebSocketLink } from 'apollo-link-ws';

import { ApolloProvider } from '@apollo/react-hooks';

const client = new ApolloClient({
  link: new WebSocketLink({
    // replace with your heroku app name
    uri: `wss://skm-test.herokuapp.com/v1/graphql`,
    options: {
      reconnect: true
    }
  }),
  cache: new InMemoryCache()
});

ReactDOM.render(
  (<ApolloProvider client={client}>
    <App />
  </ApolloProvider>),
  document.getElementById('root')
);
```

Create `DangerouslyTweet.js`:
```jsx
// DangerouslyTweet.js

import React from 'react';

import TweetStatus from './TweetStatus';

import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

const ADD_TWEET = gql`
  mutation ($raw: String!) {
    insert_tweets(objects:[{raw: $raw}]) {
      returning {
        id
      }
    }
  }
`;

const DangerouslyTweet = () => {
  let input;
  const [addTweet, { data, loading, error }] = useMutation(ADD_TWEET);

  if (data) {
    /* return (<span>Dispatched!</span>); */
    return (<TweetStatus id={data.insert_tweets.returning[0].id} />);
  }
  if (loading) {
    return (<span>Loading...</span>);
  }
  if (error) {
    return (<span>{error.toString()}</span>);
  }
  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        addTweet({ variables: { raw: input.value } });
        input.value = "";
      }}
    >
      <textarea
        style={{fontSize: 'calc(10px + 2vmin)'}}
        ref={node => {
          input = node;
        }}
      />
      <br/>
      <button style={{fontSize: 'calc(10px + 2vmin)', padding: '10px'}}
              type="submit">__dangerouslyTweet()</button>
    </form>
  )
};

export default DangerouslyTweet;
```

Create `TweetStatus.js`:
```jsx
// TweetStatus.js

import React from 'react';

import gql from 'graphql-tag';
import { useSubscription } from '@apollo/react-hooks';

const TWEET_STATUS = gql`
  subscription tweetStatus($id: uuid!) {
    tweets(where:{id: {_eq: $id}}) {
      id
      sanitized
    }
  }
`;

const TweetStatus = ({ id }) => {
  const { data, loading, error } = useSubscription(TWEET_STATUS, { variables : { id }});

  if (loading) {
    return (<span>Loading...</span>);
  }
  if (error) {
    return (<span>{error.toString()}</span>);
  }

  if (!data || !data.tweets[0].sanitized) {
    return (<span>
      <img alt ="cleaning" src="https://i.giphy.com/media/TG9ko7uVhkkde2eVAU/giphy.webp" />
    </span>);
  }

  if (data && data.tweets[0].sanitized) {
    const sanitized = data.tweets[0].sanitized;
    return (<div>
      {sanitized}
      <br/><br/>
      <img alt="innocent" src="https://i.giphy.com/media/l3nSxBDg5obIiU9Ko/giphy.webp" />
    </div>);
  }
};

export default TweetStatus;
```

Edit `App.js`:
```jsx
// App.js

import React from 'react';
import './App.css';

import DangerouslyTweet from './DangerouslyTweet'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <DangerouslyTweet />
      </header>
    </div>
  );
}

export default App;
```

Run the app:
```bash
npm start
```
