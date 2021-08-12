import React, { useState, useEffect, useContext } from 'react'
import Select from 'react-select'
import { useQuery } from '@apollo/client'
import { GET_SELLER_CLIENTS } from '../../gql/clients'
import OrdersContext from '../../context/orders/OrdersContext'

const SelectClient = () => {
    const [ clients, setClients ] = useState([])
    const [ orderClient, setOrderClient ] = useState({})
    const ordersContext = useContext(OrdersContext)
    const { setClient } = ordersContext
    const { data, loading, error } = useQuery(GET_SELLER_CLIENTS)

    useEffect(() => {
        if(data && !loading && !error) {
            const options = data.getSellerClients.map(client => ({
                value: client.id,
                label: `${client.name} ${client.lastname}`
            }))
            setClients(options)
        }
    }, [data])

    useEffect(() => {
        if(data && orderClient) {
            const clientSelected = data.getSellerClients.filter(c => c.id === orderClient.value)
            setClient(clientSelected[0])
        }
    },[orderClient])

    return (
        <>
            <p className='mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold'>1.- Select a client.</p>
            <Select 
                className='mt-3'
                options={clients}
                onChange={value => setOrderClient(value)}
                placeholder={'Client...'}
            />
        </>
    )
}

export default SelectClient
