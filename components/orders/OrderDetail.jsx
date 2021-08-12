import React, { useContext, useEffect } from 'react'
import OrdersContext from '../../context/orders/OrdersContext'
import OrderProductDetail from './OrderProductDetail'

const OrderDetail = () => {
    const orderContext = useContext(OrdersContext)
    const { products } = orderContext
    
    return (        
        <>
            <p className='mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold'>3.- Select Quantities.</p>
            {
                products.map(product => (
                    <OrderProductDetail product={product} key={product.id} />
                ))
            }
        </>
    )
}

export default OrderDetail