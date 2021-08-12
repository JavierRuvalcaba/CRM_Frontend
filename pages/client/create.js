import React, { useState } from 'react'
import Layout from '../../components/Layout'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useMutation } from '@apollo/client'
import { CREATE_CLIENT, GET_SELLER_CLIENTS } from '../../gql/clients'
import { useRouter } from 'next/router'

const CreateClient = () => {
    const CLIENT_FORM = ['name','lastname','company','email','phone']
    const [ msg, setMsg ] = useState()
    const router = useRouter()
    const [ addClient ] = useMutation(CREATE_CLIENT, {
        update(cache, { data: { addClient }}) {
            // Get cache object
            const { getSellerClients } = cache.readQuery({ query: GET_SELLER_CLIENTS })

            // Rewrite cache (Cache must not be updated ever)
            cache.writeQuery({
                query: GET_SELLER_CLIENTS,
                data: {
                    getSellerClients: [...getSellerClients, addClient]
                }
            })
        }
    })

    const formik = useFormik({
        initialValues: {
            name: '',
            lastname: '',
            company: '',
            email: '',
            phone: ''
        },
        validationSchema:  Yup.object({
            name: Yup.string().required('Name is required'),
            lastname: Yup.string().required('Lastname is required'),
            company: Yup.string().required('Company is required'),
            email: Yup.string().email('Email is not valid').required('Email is required')
        }),
        onSubmit: async values => {
            const { name, lastname, company, email, phone } = values
            
            try {
                await addClient({
                    variables: {
                        input: { name, lastname, company, email, phone }
                    }
                })

                router.push('/')
            }
            catch(err) {
                setMsg(err.message.replace('GraphQL error: ', ''))
                setTimeout(() => {
                    setMsg(null)
                },5000)
            }
        }
    })
    
    const showMessage = () => (
        <div className='bg-white py-2 px-3 w-full my-3'>
            <p>{msg}</p>
        </div>
    )

    return (
        <Layout>
            <h1 className='text-2xl text-gray-800 font-light'>Create Client</h1>
            
            { msg && showMessage() }
            <div className='flex justify-center mt-5'>
                <div className='w-full max-w-lg'>
                    <form
                        className='bg-white shadow-md px-8 pt-6 pb-8 mb-4'
                        onSubmit={formik.handleSubmit}
                    >
                        {
                            CLIENT_FORM.map(field => (
                                <div key={field}>
                                    <label className='block text-gray-700 text-sm font-bold mb-2 capitalize' htmlFor={field}>{field}</label>
                                    <input className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                        id={field}
                                        type={field}
                                        placeholder={`Client ${field}`}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values[field]}
                                    />
                                    {
                                        formik.errors[field] && formik.touched[field] 
                                        ? <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>{formik.errors[field]}</div> : null
                                    }
                                </div>
                            ))
                        }
                        <input 
                            type='submit'
                            className='bg-gray-800 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900'
                            value='Register client'
                        />
                    </form>
                </div>
            </div>
        </Layout>
    )
}

export default CreateClient