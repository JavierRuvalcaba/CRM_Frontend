import React from 'react'
import Swal from 'sweetalert2'
import { useMutation } from '@apollo/client'
import { DELETE_CLIENT, GET_SELLER_CLIENTS } from '../gql/clients'
import Router from 'next/router'

const Client = ({ client }) => {
    const [ deleteClient ] = useMutation(DELETE_CLIENT, {
        update(cache) {
            const { getSellerClients } = cache.readQuery({ query: GET_SELLER_CLIENTS })
            cache.writeQuery({
                query: GET_SELLER_CLIENTS,
                data: {
                    getSellerClients: getSellerClients.filter(c => c.id !== client.id)
                }
            })
        }
    })

    const handleDeleteClient = () => {
        Swal.fire({
            title: `Delete client ${client.name} ${client.lastname}`,
            text: `You won't be able to revert this!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then( async result => {
            if(result.value) {
                try {
                    const msg = await deleteClient({ variables: { id: client.id }})

                    Swal.fire(
                        'Deleted!',
                        msg,
                        'success'
                    )
                }
                catch(err) {
                    console.log(err)
                }
            }
        })
    }
    
    const handleEditClient = () => {
        Router.push({ pathname: '/client/edit/[id]', query: { id: client.id } })
    }

    return (
        <tr>
          <td className='border px-4 py-2'>{client.name} {client.lastname}</td>
          <td className='border px-4 py-2'>{client.company}</td>
          <td className='border px-4 py-2'>{client.email}</td>
          <td className='border px-4 py-2'>
            <button 
                type='button' 
                className='flex justify-center items-center bg-green-600 py-2 px-4 w-full text-white rounded text-sxs font-bold'
                onClick={handleEditClient}
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
                onClick={handleDeleteClient}
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

export default Client