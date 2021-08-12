import { gql } from '@apollo/client'

export const GET_PRODUCTS = gql`
    query {
        getProducts {
            id
            name
            stock
            price
        }
    }
`

export const GET_PRODUCT = gql`
    query getProduct($id: ID!) {
        getProductById(id: $id) {
            id
            name
            stock
            price
        }
    }
`

export const CREATE_PRODUCT = gql`
    mutation createProduct($input: ProductInput) {
        addProduct(input: $input) {
            id
            name
            price
            stock
        }
    }
`

export const EDIT_PRODUCT = gql`
    mutation editProduct($id: ID!, $input: ProductInput) {
        updateProduct(id: $id, input: $input) {
            id
            name
            stock
            price
        }
    }
`

export const DELETE_PRODUCT = gql`
    mutation deleteProduct($id: ID!) {
        deleteProduct(id: $id)
    }
`

