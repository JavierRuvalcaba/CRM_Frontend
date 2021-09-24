import React, { useState, useEffect, useContext } from 'react'
import Select from 'react-select'
import { useQuery } from '@apollo/client'
import { GET_PRODUCTS } from '../../gql/products'
import OrdersContext from '../../context/orders/OrdersContext'

const SelectProducts = () => {
    const [ productsList, setProductsList ] = useState([])
    const [ orderProducts, setOrderProducts ] = useState([])
    const ordersContext = useContext(OrdersContext)
    const { setProducts } = ordersContext
    const { data, loading, error } = useQuery(GET_PRODUCTS)

    useEffect(() => {
        if(data && !loading && !error) {
            const options = data.getProducts.map(product => ({
                value: product.id,
                label: `${product.name} - ${product.stock} available`
            }))
            setProductsList(options)
        }
    }, [data, loading, error])

    useEffect(() => {
        if(data && orderProducts) {
            const selectedIds = orderProducts.map(p => p.value)
            const productsSelected = data.getProducts.filter(c => selectedIds.includes(c.id))
            setProducts(productsSelected)
        }
    },[orderProducts])

    return (
        <>
            <p className='mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold'>2.- Select or search products.</p>
            <Select 
                className='mt-3'
                isMulti
                options={productsList}
                onChange={value => setOrderProducts(value)}
                placeholder={'Client...'}
            />
        </>
    )
}

export default SelectProducts
