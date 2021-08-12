import React, { useContext, useEffect, useState } from 'react'
import OrdersContext from '../../context/orders/OrdersContext'

const OrderProductDetail = ({ product }) => {
    const orderContext = useContext(OrdersContext)
    const [ qty, setQty ] = useState(1)
    const { name, price } = product
    const { addProductQty } = orderContext

    useEffect(() => {
        const nProduct = { ...product, quantity: Number(qty) }
        addProductQty(nProduct)
    },[qty])

    return (
        <div className='md:flex md:justify-between md:items-center mt-5'>
            <div className='md:w-2/4 mb-2 md:mb-0'>
                <p className='text-sm'>{name}</p>
                <p>$ {price}</p>
            </div>
            <input
                type='number'
                min={1}
                defaultValue={1}
                placeholder='Quantity'
                className='shadow appearance-none borde rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline md:ml-4'
                onChange={(e) => setQty(e.target.value)}
            />
        </div>
    )
}

export default OrderProductDetail