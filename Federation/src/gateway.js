import { ApolloServer } from 'apollo-server';
import { ApolloGateway, RemoteGraphQLDataSource } from '@apollo/gateway';

const remoteGraphs = [
      { name: 'strawberry', url: 'strawberry/graphql' },
      { name: 'service1', url: 'service1/graphql' }
  ]

const gateway = new ApolloGateway({
  serviceList: remoteGraphs,
  buildService({ name, url }) {
    if name.includes('strawberry') {
        return new RemoteGraphQLDataSource({
            url,
            willSendRequest({ request, context }) {
                request.http.headers.set('CSRF-TOKEN', () => 'test token');
            },
        });
    } else {
        return new RemoteGraphQLDataSource({
            url,
            willSendRequest({ request, context }) {
                request.http.headers.set('x-user-id', context?.userId ? context.userId : 0);
            },
        });
    }
  },
});

(async () => {
  const { schema, executor } = await gateway.load();

  const server = new ApolloServer({
    schema,
    executor,
    subscriptions: false,
  });

  server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });
})();
