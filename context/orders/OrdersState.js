import React, { useEffect, useReducer } from 'react'
import OrdersReducer from "./OrdersReducer"
import OrdersContext from './OrdersContext'
import { 
    SELECT_CLIENT,
    SELECT_PRODUCT,
    SELECT_PRODUCT_QUANTITY,
    UPDATE_TOTAL
} from "../../types"


const initialState = {
    client: {},
    products: [],
    total: 0
}

const OrdersProvider = ({ children }) => {
    const [ state, dispatch ] = useReducer(OrdersReducer, initialState)

    useEffect(() => {
        let total = 0
        state.products.forEach(product => {
            total += product.price * product.quantity
        })

        dispatch({
            type: UPDATE_TOTAL,
            payload: total
        })
    }, [state.products])

    const setClient = client => {
        dispatch({
            type: SELECT_CLIENT,
            payload: client
        })
    }

    const setProducts = selectedProducts => {
        let newProducts = selectedProducts
        if(state.products.length > 0) {
            newProducts = selectedProducts.map(selectedProduct => {
                const obj = state.products.find( producState => producState.id === selectedProduct.id )
                return { ...selectedProduct, ...obj}
            })
        }
        
        dispatch({
            type: SELECT_PRODUCT,
            payload: newProducts
        })
    }

    const addProductQty = product => {
        dispatch({
            type: SELECT_PRODUCT_QUANTITY,
            payload: product
        })
    }

    return (
        <OrdersContext.Provider value={{ 
            ...state,
            setClient,
            setProducts,
            addProductQty
        }}>
            {children}
        </OrdersContext.Provider>
    )
}

//const useOrder = () =>  useContext(OrdersContext)

export default OrdersProvider