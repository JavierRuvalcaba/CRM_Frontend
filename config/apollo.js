import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client'
import fetch from 'node-fetch'
import { setContext } from 'apollo-link-context'
import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()

const httpLink = createHttpLink({
    uri: publicRuntimeConfig.API_URL,
    fetch
})

const authLink = setContext((_, {headers}) => {
    const token = localStorage.getItem('token')
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : ''
        }
    }
})

const client = new ApolloClient({
    connectToDevTools: true,
    cache: new InMemoryCache(),
    link: authLink.concat(httpLink),
    
})

export default client