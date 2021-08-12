import client from "../config/apollo"
import { ApolloProvider } from "@apollo/client"
import OrdersProvider from "../context/orders/OrdersState"

const MyApp = ({ Component, pageProps}) => {
  return (
    <ApolloProvider client={client}>
      <OrdersProvider>
        <Component {...pageProps} />
      </OrdersProvider>
    </ApolloProvider>
  )
}

export default MyApp
