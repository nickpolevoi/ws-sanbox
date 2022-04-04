import { gql, useSubscription, useQuery } from '@apollo/client'

const SUBSCRIPTION = gql`subscription {
  Test_table {
    previousValues {
      num
    }
  }
}`;

const SUBSCRIPTION_LOCAL = gql`
  subscription {
    Test_table {
      previousValues {
        someColumn
      }
    }
  }`;


const QUEERY = gql`
  query {
  test_tablesList {
    items {
      num
    }
  }
}`;

function App() {
  const { data, loading } = useQuery(QUEERY);
  console.log('data', data);

  const subscription = useSubscription(SUBSCRIPTION_LOCAL)
  console.log('subscription', subscription.data);

  return (
    <h1>Hi there</h1>
  );
}

export default App;
