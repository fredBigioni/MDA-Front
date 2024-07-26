import axios from 'axios';

export const getAllProductGroup = () => {
    return async function(getState) {
        const productGroup = await axios.get(`products/groups`)
        return productGroup.data;
    }
}
export const getAllProducts = () => {
    return async function(getState) {
        const products = await axios.get(`products`)
        return products.data;
    }
}

export const getDetailProductGroup = (id) => {
    return async function(getState) {
        const detail = await axios.get(`products/group/${id}`)
        return detail.data;
    }
}

export const createProductGroup = (data) => {
    return async function(dispatch) {
      const createProductGroup = await axios.post(`products/group`, data, { headers: { 'Content-Type':'application/json'}})
      return createProductGroup.data;
    }
}

export const updateProductGroup = (productGroupCode, data) => {
    return async function(getState) {
        const update = await axios.put(`products/group/${productGroupCode}`, data, { headers: { 'Content-Type':'application/json'}})
        return update.data;
    }

}

export const deleteProductGroup = (productGroupCode) => {
    return async function(getState) {
        const deleteProductGroup = await axios.delete(`products/group/${productGroupCode}`)
        return deleteProductGroup.data;
    }
}