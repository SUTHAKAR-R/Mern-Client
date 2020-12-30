import React from 'react'
import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink } from '@apollo/client'
import { setContext } from "@apollo/client/link/context"
import App from './App'

const httpLink = new createHttpLink({uri: 'http://localhost:5000'})

const authLink = setContext( () => {
    const token = localStorage.getItem('jwtToken')

    return {
        headers: {
            authorization: token ? `Bearer ${token}` : ''
        }
    }
})

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
    connectToDevTools: true,
})


export default (
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>
)
