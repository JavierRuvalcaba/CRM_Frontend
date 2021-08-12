import React from 'react'
import Layout from '../../components/Layout'
import { CREATE_PRODUCT, GET_PRODUCTS } from '../../gql/products'
import { useMutation } from '@apollo/client'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useRouter } from 'next/router'
import Swal from 'sweetalert2'

const CreateProduct = () => {
    const PRODUCT_FORM = [
        { property: 'name', title: 'Product name', type: 'text' },
        { property: 'stock', title: 'Stock', type: 'number' },
        { property: 'price', title: 'Price', type: 'number' },
    ]
    const router = useRouter()
    const [ addProduct ] = useMutation(CREATE_PRODUCT, {
        update(cache, { data: { addProduct }}) {
            const { getProducts } = cache.readQuery({ query: GET_PRODUCTS })

            cache.writeQuery({
                query: GET_PRODUCTS,
                data: {
                    getProducts: [ ...getProducts, addProduct ]
                }
            })
        }
    })
    
    const formik = useFormik({
        initialValues: {
            name: '',
            stock: '',
            price: ''
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Product name is required.'),
            stock: Yup.number().required('Stock is required.')
                .positive('Stock cannot be negative.')
                .integer('Use only integers.'),
            price: Yup.number()
                .required('Price is required.')
                .positive('Price cannot be less than 0.')
        }),
        onSubmit: async values => {
            const { name, stock, price }  = values
            try {
                const { data } = await addProduct({
                    variables: {
                        input: {
                            name,
                            stock,
                            price
                        }
                    }
                })

                Swal.fire(
                    'Created!',
                    `Product ${data.addProduct.name} was created successfully`,
                    'success'
                )

                router.push('/product')
            }
            catch(err) {
                console.log(err)
            }
        }
    })

    return (
        <Layout>
            <div className='flex justify-center mt-5'>
                <div className='w-full max-w-lg'>
                    <form
                        className='bg-white shadow-md px-8 pt-6 pb-8 mb-4'
                        onSubmit={formik.handleSubmit}
                    >
                        {
                            PRODUCT_FORM.map(field => (
                                <div key={field.property}>
                                    <label className='block text-gray-700 text-sm font-bold mb-2 capitalize' htmlFor={field.property}>{field.title}</label>
                                    <input className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                        id={field.property}
                                        type={field.type}
                                        placeholder={field.title}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values[field.property]}
                                    />
                                    {
                                        formik.errors[field.property] && formik.touched[field.property] 
                                        ? <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>{formik.errors[field.property]}</div> : null
                                    }
                                </div>
                            ))
                        }
                        <input 
                            type='submit'
                            className='bg-gray-800 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900'
                            value='Add product'
                        />
                    </form>
                </div>
            </div>
        </Layout>
    )
}

export default CreateProduct