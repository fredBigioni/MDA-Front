import axios from 'axios';

export const getAllProducts = () => {
    return async function(getState) {
        const product = await axios.get(`products`)
        return product.data;
    }
}
export const getAllLaboratories = () => {
    return async function(getState) {
        const businessUnits = await axios.get(`laboratories`)
        return businessUnits.data;
    }
}

export const updateProduct = (productCode, data) => {
    return async function(getState) {
        const update = await axios.put(`products/${productCode}`, data, { headers: { 'Content-Type':'application/json'}})
        return update.data;
    }

}