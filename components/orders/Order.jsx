import React, { useState } from 'react'
import { useMutation } from '@apollo/client'
import { UPDATE_ORDER, DELETE_ORDER, GET_ORDERS_BY_SELLER } from '../../gql/orders'
import Swal from 'sweetalert2'

const Order = ({ orderObj }) => {
    const { id, total, client: { name, lastname, email, phone }, status, order} = orderObj
    const [ orderStatus, setOrderStatus ] = useState(status)
    const [ updateOrder ] = useMutation(UPDATE_ORDER)
    const [ deleteOrder ] = useMutation(DELETE_ORDER, {
        update(cache) {
            const { getOrdersBySeller } = cache.readQuery({ query: GET_ORDERS_BY_SELLER })

            cache.writeQuery({
                query: GET_ORDERS_BY_SELLER,
                data: {
                    getOrdersBySeller: getOrdersBySeller.filter(order => order.id !== id)
                }
            })
        }
    })

    const getStatusStyle = () => {
        switch (orderStatus) {
            case 'COMPLETED':
                return 'border-green-500'
            case 'CANCELED':
                return 'border-red-800'
            default:
                return 'border-yellow-500'
        }
    }

    const handleOrderStatus = async (e) => {
        const newStatus = e.target.value
        const orderArr = order.map(({ __typename, ...order}) => order)
        try {
            const { data } = await updateOrder({
                variables: {
                    id,
                    input: {
                        client: orderObj.client.id,
                        status: newStatus,
                        order: orderArr,
                        total
                    }
                }
            })
            
            setOrderStatus(data.updateOrder.status)
            Swal.fire(
                'Order Status!',
                'The order status was updated successfully',
                'success'
            )
        }
        catch(err) {
            console.log(err)
        }
    }

    const handleDeleteOrder = async () => {
        Swal.fire({
            title: `Delete order`,
            text: `You won't be able to revert this!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then( async result => {
            if(result.value) {
                try {
                    await deleteOrder({
                        variables: {
                            id
                        }
                    })
                }
                catch(err) {
                    console.log(err)
                }
            }
        })
    }

    return (
        <div className={`${getStatusStyle()} border-t-4 mt-4 bg-white rounded p-6 md:grid md:grid-cols-2 md:gap-4 shadow-lg`}>
            <div>
                <p className='font-bold text-gray-600'>Client: {name} {lastname}</p>
                {
                    email && (
                        <p className='flex ites-center my-2'>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path className='w-4 h-4 mr-2' strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                            </svg>
                            {email}
                        </p>
                    )
                }
                {
                    phone && (
                        <p className='flex ites-center my-2'>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                            </svg>
                            {phone}
                        </p>
                    )
                }
                <h2 className='text-gray-800 font-bold mt-10'>Status: </h2>
                
                <select 
                    className='mt-2 appearance-none bg-blue-600 border border-blue-600 text-white p-2 text-center rounded leading-tight focus:outline-none focus:bg-blue-600 focus:border-blue-500 text-xs'
                    value={orderStatus}
                    onChange={handleOrderStatus}
                >
                    <option value={'COMPLETED'}>COMPLETED</option>
                    <option value={'PENDING'}>PENDING</option>
                    <option value={'CANCELED'}>CANCELED</option>
                </select>
            </div>
            <div>
                <h2 className='text-gray-800 font-bold mt-2'>Order detail</h2>
                {
                    order.map(article => (
                        <div key={`${article.id}-${article.quantity}`} className='mt-4'>
                            <p className='text-sm text-gray-600'>Product: {article.name}</p>
                            <p className='text-sm text-gray-600'>Quantity: {article.quantity}</p>
                        </div>
                    ))
                }
                <p className='text-gray-800 mt-3 font-bold'>Total:
                    <span className='font-light'> $ {total}</span>
                </p>
                <button 
                    onClick={handleDeleteOrder}
                    className='flex items-center mt-4 bg-red-800 px-5 py-2 inline-block text-white rounded leading-tight text-xs fon-bold'
                >
                    DELETE ORDER
                    <svg className="w-6 h-6 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </button>
            </div>

        </div>
    )
}

export default Order