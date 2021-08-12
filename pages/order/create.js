import React, { useState, useEffect, useContext } from 'react'
import Layout from '../../components/Layout'
import SelectClient from '../../components/orders/SelectClient'
import SelectProducts from '../../components/orders/SelectProducts'
import OrderDetail from '../../components/orders/OrderDetail'
import Total from '../../components/orders/Total'
import OrdersContext from '../../context/orders/OrdersContext'
import { CREATE_ORDER, GET_ORDERS_BY_SELLER } from '../../gql/orders'
import { useMutation } from '@apollo/client'
import Swal from 'sweetalert2'
import { useRouter } from 'next/router'

const CreateOrder = () => {
    const orderContext = useContext(OrdersContext)
    const { client, products, total } = orderContext
    const [ createOrder ] = useMutation(CREATE_ORDER, {
        update(cache, { data: { createOrder } }) {
            const getOrdersBySeller = cache.readQuery({ query: GET_ORDERS_BY_SELLER })
            
            cache.writeQuery({
                query: GET_ORDERS_BY_SELLER,
                data: {
                    getOrdersBySeller: [ ...getOrdersBySeller.getOrdersBySeller, createOrder ]
                }
            })
        }
    })
    const router = useRouter()

    const validateOrder = () => {
        return !products.every( product => product.quantity > 0) || total === 0 || (client && client.length === 0) ? ' opacity-50 cursor-not-allowed ' : ''
    }

    const handleCreateOrder = async () => {
        try {
            await createOrder({
                variables: {
                    input: {
                        order: products.map(({ stock, __typename, ...product}) => product),
                        client: client.id,
                        total
                    }
                }
            })

            Swal.fire(
                'Order created!',
                'The order was created successfully',
                'success'
            )

            router.push('/order')
        }
        catch(err) {
            const msg = err.message.replace('GraphQL error: ', '')
            Swal.fire(
                'Order cannot be created!',
                msg,
                'error'
            )
        }
    }

    return (
        <Layout>
            <h1 className='text-2xl text-gray-800 font-light'>Create Order</h1>

            <div className='flex justify-center mt-5'>
                <div className='w-full max-w-lg'>
                    <SelectClient />
                    <SelectProducts />
                    <OrderDetail />
                    <Total total={total} />

                    <button
                        type='button'
                        onClick={handleCreateOrder}
                        className={`bg-gray-800 w-full mt-5 p-2 text-white font-bold hover:bg-gray-900 ${validateOrder()}`}
                    >
                        CREATE ORDER
                    </button>
                </div>
            </div>
        </Layout>
    )
}

export default CreateOrder