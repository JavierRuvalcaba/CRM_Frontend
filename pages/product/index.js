import React, { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import Product from '../../components/Product'
import { useQuery } from '@apollo/client'
import { GET_PRODUCTS } from '../../gql/products'
import Link from 'next/link'

const Products = () => {
  const [ products, setProducts ] = useState(null)
  const { data, loading, error } = useQuery(GET_PRODUCTS)

  useEffect(() => {
    if(data && !loading && !error) {
      setProducts(data.getProducts)
    }
  },[data, error])

  return (
    <div>
      <Layout>
        <h1 className='text-2xl text-gray-800 font-light'>Products</h1>

        <Link href='/product/create'>
          <a className='bg-blue-800 py-2 px-5 mt-3 inline-block text-white hover:bg-gray-800 hover:text-gray-200 mb-3 rounded font-bold text-sm'>
            New Product
          </a>
        </Link>

        <table className='table-auto shadow-md mt-10 w-full w-lg'>
          <thead className='bg-gray-800 text-center font-bold'>
            <tr className='text-white'>
              <td className='w-1/5 py-2'>NAME</td>
              <td className='w-1/5 py-2'>STOCK</td>
              <td className='w-1/5 py-2'>PRICE</td>
              <td className='w-1/5 py-2'>EDIT</td>
              <td className='w-1/5 py-2'>DELETE</td>
            </tr>
          </thead>
          <tbody className='bg-white'>
            {
              products && products.map(product => (
                <Product product={product} key={product.id} />
              ))
            }
          </tbody>

        </table>
      </Layout>
    </div>
  )
}

export default Products