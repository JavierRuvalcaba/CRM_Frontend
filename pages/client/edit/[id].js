import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../../components/Layout'
import { useQuery, useMutation } from '@apollo/client'
import { GET_CLIENT, EDIT_CLIENT } from '../../../gql/clients'
import { Formik } from 'formik'
import * as Yup from 'yup'
import Swal from 'sweetalert2'

const EditClient = () => {
    const CLIENT_FORM = ['name','lastname','company','email','phone']
    const router = useRouter()
    const [ client, setClient ] = useState(null)
    const { query: { id } } = router
    const { data, loading, error } = useQuery(GET_CLIENT, {
        variables: {
            id
        }
    })
    const [ updateClient ] = useMutation(EDIT_CLIENT)

    useEffect(() => {
        if(data && !loading && !error) {
            setClient(data.getClientById)
        }
    }, [data])

    const validationSchema = Yup.object({
        name: Yup.string().required('Name is required'),
        lastname: Yup.string().required('Lastname is required'),
        company: Yup.string().required('Company is required'),
        email: Yup.string().email('Email is not valid').required('Email is required')
    })

    const handleUpdateClient = async (values) => {
        const { name, lastname, company, email, phone } = values

        try {
            const { data } = await updateClient({
                variables: {
                    id,
                    input: {
                        name,
                        lastname,
                        company,
                        email,
                        phone
                    }
                }
            })

            Swal.fire(
                'Updated!',
                'Client was updated successfully',
                'success'
            )
            router.push('/')
        }
        catch(err) {
            console.log(err)
        }
    }

    return (
        <Layout>
            <h1 className='text-2xl text-gray-800 font-light'>Edit Client</h1>
            
            <div className='flex justify-center mt-5'>
                <div className='w-full max-w-lg'>
                    <Formik
                        validationSchema={validationSchema}
                        enableReinitialize
                        initialValues={client}
                        onSubmit={ values => {
                            handleUpdateClient(values)
                        }}
                    >
                        {
                            props => {
                                return (
                                    <form
                                        className='bg-white shadow-md px-8 pt-6 pb-8 mb-4'
                                        onSubmit={props.handleSubmit}
                                    >
                                        {
                                            CLIENT_FORM.map(field => (
                                                <div key={field}>
                                                    <label className='block text-gray-700 text-sm font-bold mb-2 capitalize' htmlFor={field}>{field}</label>
                                                    <input className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                                        id={field}
                                                        type={field}
                                                        placeholder={`Client ${field}`}
                                                        onChange={props.handleChange}
                                                        onBlur={props.handleBlur}
                                                        value={props.values && props.values[field]}
                                                    />
                                                    {
                                                        props.errors[field] && props.touched[field] 
                                                        ? <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>{props.errors[field]}</div> : null
                                                    }
                                                </div>
                                            ))
                                        }
                                        <input 
                                            type='submit'
                                            className='bg-gray-800 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900'
                                            value='Edit client'
                                        />
                                    </form>
                                )
                            }
                        }
                    </Formik>
                </div>
            </div>
        </Layout>
    )
}

export default EditClient