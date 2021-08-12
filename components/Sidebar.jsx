import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

const Sidebar = () => {
    const router = useRouter()
    const ITEMS = [{ name: 'Clients', to: '/' }, { name: 'Orders', to: '/order' }, { name: 'Products', to: '/product' }]
    const TOPS = [{ property: 'topsellers', name: 'Top Sellers', to: '/top/sellers'},{ property: 'topclients', name: 'Top Clients', to: '/top/clients'}]

    return (
        <aside className='bg-gray-800 sm:w-1/3 xl:w-1/6 sm:min-h-screen'>
            <div className='text-white text-2xl font-black p-5'>
                <p>CRM Clients</p>
            </div>
            <nav className='mt-5 list-none'>
                {
                    ITEMS.map(i => (
                        <li className={router.pathname == i.to ? 'bg-blue-900 p-5' : 'p-5'} key={i.name}>
                            <Link href={i.to}>
                                <a className='text-white mb-2 block'>{i.name}</a>
                            </Link>
                        </li>
                    ))
                }
            </nav>
            <div className='sm:mt-10'>
                <p className='text-white text-2xl font-black p-5'>Other Options</p>
            </div>
            <nav className='mt-5 list-none'>
                {
                    TOPS.map(i => (
                        <li className={router.pathname == i.to ? 'bg-blue-900 p-5' : 'p-5'} key={i.property}>
                            <Link href={i.to}>
                                <a className='text-white mb-2 block'>{i.name}</a>
                            </Link>
                        </li>
                    ))
                }
            </nav>
        </aside>
    )
}

export default Sidebar