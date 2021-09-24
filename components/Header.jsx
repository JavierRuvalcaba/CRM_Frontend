import React, { useState, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { GET_USER } from '../gql/users'
import { useRouter } from 'next/router'

const Header = () => {
    const [ user, setUser ] = useState({ name: '', lastname: '' })
    const { data, loading, error } = useQuery(GET_USER)
    const router = useRouter()

    useEffect(() => {
        if(!loading && !error) {
            if(!data || data.getUser == null) return router.push('/login')
            else {
                const { name, lastname } = data.getUser
                setUser({ name, lastname })
            }
        }
    }, [data, loading, error, router])

    const logout = () => {
        localStorage.removeItem('token')
        router.push('/login')
    }

    return (
        <div className='sm:flex sm:justify-between mb-5'>
            <p className='mr-2 mb-5 lg:mb-0'>Hi {user.name} {user.lastname}!</p>
            <button 
                className='bg-blue-800 w-full sm:w-auto font-bold uppercase text-xs rounded py-1 px-2 text-white shadow-md'
                onClick={logout}
            >
                Logout
            </button>
        </div>
    )
}

export default Header