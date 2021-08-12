import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../../components/Layout'
import { useQuery, useMutation } from '@apollo/client'
import { GET_PRODUCT, EDIT_PRODUCT } from '../../../gql/products'
import { Formik } from 'formik'
import * as Yup from 'yup'
import Swal from 'sweetalert2'

const EditClient = () => {
    const PRODUCT_FORM = [
        { property: 'name', title: 'Product name', type: 'text' },
        { property: 'stock', title: 'Stock', type: 'number' },
        { property: 'price', title: 'Price', type: 'number' },
    ]
    const router = useRouter()
    const [ product, setProduct ] = useState(null)
    const { query: { id } } = router
    const { data, loading, error } = useQuery(GET_PRODUCT, {
        variables: {
            id
        }
    })
    const [ updateProduct ] = useMutation(EDIT_PRODUCT)

    useEffect(() => {
        if(data && !loading && !error) {
            console.log(data.getProductById)
            setProduct(data.getProductById)
        }
    }, [data])

    const validationSchema = Yup.object({
        name: Yup.string()
            .required('Product name is required.'),
        stock: Yup.number()
            .required('Stock is required.')
            .positive('Stock cannot be negative.')
            .integer('Use only integers.'),
        price: Yup.number()
            .required('Price is required.')
            .positive('Price cannot be less than 0.')
    })

    const handleUpdateProduct = async (values) => {
        const { name, stock, price } = values

        try {
            await updateProduct({
                variables: {
                    id,
                    input: {
                        name,
                        stock,
                        price
                    }
                }
            })

            Swal.fire(
                'Updated!',
                'Product was updated successfully',
                'success'
            )
            router.push('/product')
        }
        catch(err) {
            console.log(err)
        }
    }

    return (
        <Layout>
            <h1 className='text-2xl text-gray-800 font-light'>Edit Product</h1>
            
            <div className='flex justify-center mt-5'>
                <div className='w-full max-w-lg'>
                    <Formik
                        validationSchema={validationSchema}
                        enableReinitialize
                        initialValues={product}
                        onSubmit={ values => {
                            handleUpdateProduct(values)
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
                                            PRODUCT_FORM.map(field => (
                                                <div key={field.property}>
                                                    <label className='block text-gray-700 text-sm font-bold mb-2 capitalize' htmlFor={field.property}>{field.title}</label>
                                                    <input className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                                        id={field.property}
                                                        type={field.type}
                                                        placeholder={field.title}
                                                        onChange={props.handleChange}
                                                        onBlur={props.handleBlur}
                                                        value={props.values && props.values[field.property]}
                                                    />
                                                    {
                                                        props.errors[field.property] && props.touched[field.property] 
                                                        ? <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>{props.errors[field.property]}</div> : null
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