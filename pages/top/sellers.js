import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import {
    BarChart, Bar, YAxis, XAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import { useQuery } from '@apollo/client'
import { TOP_SELLERS } from '../../gql/top'

const TopSellers = () => {
    const [ topSellers, setTopSellers ] = useState([]) 
    const { data, loading, error, startPolling, stopPolling } = useQuery(TOP_SELLERS)

    useEffect   (() => {
        startPolling(1000)
        return () => stopPolling()
    }, [startPolling, stopPolling])

    useEffect(() => {
        if(data && !loading && !error) {
            const graphData = data.getTopSellers.map(seller => {
                return {
                    ...seller.seller[0],
                    total: seller.total
                }
            })

            setTopSellers(graphData)
        }
    },[data])

    return (
        <Layout>
            <h1 className='text-2xl text-gray-800 fnt-light'>Top Sellers</h1>
            <ResponsiveContainer
                width={'95%'}
                height={500}
            >
                <BarChart className='mt-8' width={600} height={450} data={topSellers}>
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

export default TopSellers