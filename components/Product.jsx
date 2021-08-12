import React from 'react'
import Swal from 'sweetalert2'
import { useMutation } from '@apollo/client'
import { DELETE_PRODUCT, GET_PRODUCTS } from '../gql/products'
import Router from 'next/router'

const Product = ({ product }) => {
    const { id, name, stock, price } = product
    const [ deleteProduct ] = useMutation(DELETE_PRODUCT, {
        update(cache) {
            const { getProducts } = cache.readQuery({
                query: GET_PRODUCTS
            })

            cache.writeQuery({
                query: GET_PRODUCTS,
                data: {
                    getProducts: getProducts.filter( product => product.id !== id)
                }
            })
        }
    })

    const handleDeleteProduct = () => {
        Swal.fire({
            title: `Delete product ${product.name}`,
            text: `You won't be able to revert this!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then( async result => {
            if(result.value) {
                const msg = await deleteProduct({ variables: { id }})

                Swal.fire(
                    'Deleted!',
                    msg,
                    'success'
                )
            }
        })
    }

    const handleEditProduct = () => {
        Router.push({
            pathname: '/product/edit/[id]',
            query: { id }
        })
    }

    return (
        <tr>
          <td className='border px-4 py-2'>{name}</td>
          <td className='border px-4 py-2'>{stock}</td>
          <td className='border px-4 py-2'>$ {price}</td>
          <td className='border px-4 py-2'>
            <button 
                type='button' 
                className='flex justify-center items-center bg-green-600 py-2 px-4 w-full text-white rounded text-sxs font-bold'
                onClick={handleEditProduct}
            >
                EDIT
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
            </button>
          </td>
          <td className='border px-4 py-2'>
            <button 
                type='button' 
                className='flex justify-center items-center bg-red-800 py-2 px-4 w-full text-white rounded text-sxs font-bold'
                onClick={handleDeleteProduct}
            >
                DELETE
                <svg className="w-6 h-6 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </button>
          </td>
        </tr>
    )
}

export default Product