import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink, split } from '@apollo/client'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { setContext } from '@apollo/client/link/context';
import { getMainDefinition } from '@apollo/client/utilities';

const WROKSPACE_ID = '...';
const TOKEN = '...'
const HTTP_URI = '...'
const WS_URL = '...'

const httpLink = createHttpLink({
  uri: HTTP_URI,
});

const wsLink = new GraphQLWsLink(createClient({
  // url: 'ws://localhost:3002',
  url: WS_URL,
    reconnect: true,
    connectionParams: () => ({
      workspaceId: WROKSPACE_ID,
      token: TOKEN
    }),
  webSocketImpl: class WebSocketWithoutProtocol extends WebSocket {
    constructor(url) {
      super(url);
    }
  }
}));

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: `Bearer ${TOKEN}`,
    }
  }
});

const client = new ApolloClient({
  link: authLink.concat(splitLink),
  cache: new InMemoryCache()
});


ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
  ,
  document.getElementById('root')
);
reportWebVitals();
