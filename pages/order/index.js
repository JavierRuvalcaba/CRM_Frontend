import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import Link from 'next/link'
import { useQuery } from '@apollo/client'
import { GET_ORDERS_BY_SELLER } from '../../gql/orders'
import Order from '../../components/orders/Order'

const Orders = () => {
  const [ orders, setOrders ] = useState([])
  const { data, loading, error } = useQuery(GET_ORDERS_BY_SELLER)

  useEffect(() => {
    if(data && !loading && !error) {
      setOrders(data.getOrdersBySeller)
    }
  }, [data])

  return (
    <div>
      <Layout>
        <h1 className='text-2xl text-gray-800 font-light'>Orders</h1>
        
        <Link href='/order/create'>
          <a className='bg-blue-800 py-2 px-5 mt-3 inline-block text-white hover:bg-gray-800 hover:text-gray-200 mb-3 rounded font-bold text-sm'>
            Create Order
          </a>
        </Link>
        {
          orders && orders.length > 0 
          ? orders.map(order => <Order orderObj={order} key={`${order.id}-${order.client}`} /> )
          : <p className='mt-5 text-center text-2xl'>There is not orders yet.</p>
        }
      </Layout>
    </div>
  )
}

export default Orders