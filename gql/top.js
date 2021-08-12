import { gql } from '@apollo/client'

export const TOP_SELLERS = gql`
    query Query {
        getTopSellers {
            total
            seller {
                name
                lastname
            }
        }
    }
`

export const TOP_CLIENTS = gql`
    query Query {
        getTopClients {
            total
            client {
                name
                lastname
                company
            }
        }
    }
`