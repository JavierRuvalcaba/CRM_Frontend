import { 
    SELECT_CLIENT,
    SELECT_PRODUCT,
    SELECT_PRODUCT_QUANTITY,
    UPDATE_TOTAL
} from "../../types"

const setClient = (state, action) => {
    return {
        ...state,
        client: action.payload
    }
}

const setProducts = (state, action) => {
    return {
        ...state,
        products: action.payload
    }
}

const addProductQty = (state, action) => {
    return {
        ...state,
        products: state.products.map(product => (
            product.id === action.payload.id ? action.payload : product
        ))
    }
}

const updateTotal = (state, action) => {
    return {
        ...state,
        total: action.payload
    }
}

export default (state, action) => {
    switch(action.type) {
        case SELECT_CLIENT:
            return setClient(state, action)
        case SELECT_PRODUCT:
            return setProducts(state, action)
        case SELECT_PRODUCT_QUANTITY:
            return addProductQty(state, action)
        case UPDATE_TOTAL:
            return updateTotal(state, action)
        default:
            return state
    }
}