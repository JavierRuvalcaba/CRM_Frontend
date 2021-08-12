import React, { useState } from 'react'
import Layout from '../components/Layout'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useMutation, gql } from '@apollo/client'
import { useRouter } from 'next/router'

const LOG_IN = gql`
    mutation login($input: LoginInput) {
        authentication(input: $input) {
            token
        }
    }
`

const Login = () => {
    const LOGIN = ['email','password']
    const [ authentication ] = useMutation(LOG_IN)
    const [ msg, setMsg ] = useState()
    const router = useRouter()

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Email is not valid').required('Email cannot be empty'),
            password: Yup.string().required('Password is required')
        }),
        onSubmit: async values => {
            const { email, password } = values
            try {
                const { data } = await authentication({
                    variables: {
                        input: {
                            email,
                            password
                        }
                    }
                })

                const { token } = data.authentication
                localStorage.setItem('token',token)
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
        <>
            <Layout>
                <h1 className='text-center text-2xl text-white font-light'>Login</h1>
                { msg && showMessage() }
                <div className='flex justify-center mt-5'>
                    <div className='w-full max-w-sm'>
                        <form 
                            className='bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4'                            
                            onSubmit={formik.handleSubmit}
                        >
                            {
                                LOGIN.map(field => (
                                    <div key={field}>
                                        <label className='block text-gray-700 text-sm font-bold mb-2 capitalize' htmlFor={field}>{field}</label>
                                        <input className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                            id={field}
                                            type={field}
                                            placeholder={`User ${field}`}
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
                                value='Sign In'
                            />
                        </form>
                    </div>
                </div>
            </Layout>
        </>
    )
}

export default Login