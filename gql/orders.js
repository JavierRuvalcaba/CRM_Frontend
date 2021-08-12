import { gql } from '@apollo/client'

export const CREATE_ORDER = gql`
    mutation CreateOrder($input: OrderInput) {
        createOrder(input: $input) {
            id
            status
        }
    }
`

export const GET_ORDERS_BY_SELLER = gql`
    query getOrdersBySeller {
        getOrdersBySeller {
            id
            order {
                id
                name
                quantity
                price
            },
            client {
                id
                name
                lastname
                email
                company
                phone
            }
            total
            status
        }
    }
`

export const UPDATE_ORDER = gql`
    mutation UpdateOrder($id: ID!, $input: OrderInput) {
        updateOrder(id: $id, input: $input) {
            status
        }
    }
`

export const DELETE_ORDER = gql`
    mutation DeleteOrderMutation($id: ID!) {
        deleteOrder(id: $id)
    }
`