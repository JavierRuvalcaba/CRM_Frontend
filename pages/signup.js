import React, { useState } from 'react'
import Layout from '../components/Layout'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useMutation, gql } from '@apollo/client'
import { useRouter } from 'next/router'

const SIGN_UP = gql`
    mutation createUser($input: UserInput) {
        createUser(input: $input) {
            id
            name
            lastname
            email
        }
    }
`

const SignUp = () => {
    const USER = ['name','lastname','email','password']
    const [ createUser ] = useMutation(SIGN_UP)
    const [ msg, setMsg ] = useState()
    const router = useRouter()

    const formik = useFormik({
        initialValues: {
            name: '',
            lastname: '',
            email: '',
            password: ''
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Name is required'),
            lastname: Yup.string().required('Lastname is required'),
            email: Yup.string().email('Email is not valid').required('Email is required'),
            password: Yup.string().required('Password is required').min(6,'Password must have 6 characters at least'),
        }),
        onSubmit: async values => {
            const { name, lastname, email, password } = values
            try {
                const { data } = await createUser({
                    variables: {
                        input: {
                            name,
                            lastname,
                            email,
                            password,
                        }
                    }
                })

                router.push('/login')
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
                <h1 className='text-center text-2xl text-white font-light'>Sign Up</h1>
                { msg && showMessage() }
                <div className='flex justify-center mt-5'>
                    <div className='w-full max-w-sm'>
                        <form 
                            className='bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4'
                            onSubmit={formik.handleSubmit}
                        >
                            {
                                USER.map(u => (
                                    <div key={u}>
                                        <label className='block text-gray-700 text-sm font-bold mb-2 capitalize' htmlFor={u}>{u}</label>
                                        <input className='shadow appearance-none border rounded w-full py-2 px-3 mb-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                            id={u}
                                            type={u}
                                            placeholder={`User ${u}`}
                                            value={formik.values[u]}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        />
                                        {
                                            formik.errors[u] && formik.touched[u] ? <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>{formik.errors[u]}</div> : null
                                        }
                                    </div>
                                ))
                            }
                            <input 
                                type='submit'
                                className='bg-gray-800 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900'
                                value='Sign Up'
                            />
                        </form>
                    </div>
                </div>
            </Layout>
        </>
    )
}

export default SignUp