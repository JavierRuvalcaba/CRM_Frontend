import React, { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import {
    BarChart, Bar, YAxis, XAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import { useQuery } from '@apollo/client'
import { TOP_CLIENTS } from '../../gql/top'

const TopClients = () => {
    const [ topClients, setTopClients ] = useState([]) 
    const { data, loading, error, startPolling, stopPolling } = useQuery(TOP_CLIENTS)

    useEffect   (() => {
        startPolling(1000)
        return () => stopPolling()
    }, [startPolling, stopPolling])

    useEffect(() => {
        if(data && !loading && !error) {
            const graphData = data.getTopClients.map(client => {
                return {
                    ...client.client[0],
                    total: client.total
                }
            })
            
            setTopClients(graphData)
        }
    },[data, loading, error])

    return (
        <Layout>
            <h1 className='text-2xl text-gray-800 fnt-light'>Top Sellers</h1>
            <ResponsiveContainer
                width={'95%'}
                height={500}
            >
                <BarChart className='mt-10' width={600} height={450} data={topClients}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="total" fill="#3182ce" />
                </BarChart>
            </ResponsiveContainer>
        </Layout>
    )
}

export default TopClients