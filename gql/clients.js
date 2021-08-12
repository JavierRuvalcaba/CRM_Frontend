import { gql } from '@apollo/client'

export const GET_SELLER_CLIENTS = gql`
    query {
        getSellerClients {
            id
            name
            lastname
            company
            email
            phone
        }
    }
`

export const CREATE_CLIENT = gql`
    mutation createClient($input: ClientInput) {
        addClient(input: $input) {
            id
            name
            lastname
            company
            email
        }
    }
`

export const DELETE_CLIENT = gql`
    mutation deleteClient($id: ID!) { 
        deleteClient(id: $id)
    }
`

export const GET_CLIENT =  gql`
    query getClient($id: ID!) {
        getClientById(id: $id) {
            id
            name
            lastname
            company
            email
            phone
        }
    }
`

export const EDIT_CLIENT = gql`
    mutation updateClient($id: ID!, $input: ClientInput) {
        updateClient(id: $id, input: $input) {
            name
            lastname
            email
        }
    }
`