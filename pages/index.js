import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { useQuery } from '@apollo/client'
import { GET_SELLER_CLIENTS } from '../gql/clients'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Client from '../components/Client'

const Clients = () => {
  const [ clients, setClients ] = useState([])
  const { data, loading, error } = useQuery(GET_SELLER_CLIENTS)
  const router = useRouter()

  useEffect(() => {
    if(!loading && !error) {
      if(!data) return router.push('/login')
      else setClients(data.getSellerClients)
    }
  },[data])

  return (
    <div>
      <Layout>
        <h1 className='text-2xl text-gray-800 font-light'>Clients</h1>
        <Link href='/client/create'>
          <a className='bg-blue-800 py-2 px-5 mt-3 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold w-full lg:w-auto text-center'>
            Add Client
          </a>
        </Link>
        <div className='overflow-x-scroll'>
          <table className='table-auto shadow-md mt-10 w-full w-lg'>
            <thead className='bg-gray-800 text-center font-bold'>
              <tr className='text-white'>
                <td className='w-1/5 py-2'>Name</td>
                <td className='w-1/5 py-2'>Company</td>
                <td className='w-1/5 py-2'>Email</td>
                <td className='w-1/5 py-2'>Edit</td>
                <td className='w-1/5 py-2'>Delete</td>
              </tr>
            </thead>
            <tbody className='bg-white'>
              {
                clients && clients.map(client => (
                  <Client client={client} key={client.id} />
                ))
              }
            </tbody>
          </table>
        </div> 
      </Layout>
    </div>
  )
}

export default Clients