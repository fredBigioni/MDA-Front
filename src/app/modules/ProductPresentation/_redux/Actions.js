import axios from 'axios';

export const getAllProductPresentations = () => {
    return async function(getState) {
        const productpresentations = await axios.get(`productpresentations`)
        return productpresentations.data;
    }
}

export const getAllTherapeuticlass = () => {
    return async function(getState) {
        const therapeuticalclasses = await axios.get(`therapeuticalclasses`)
        return therapeuticalclasses.data;
    }
}

export const getAllBusinessUnits = () => {
    return async function(getState) {
        const businessUnits = await axios.get(`businessUnits`)
        return businessUnits.data;
    }
}

export const updateProductPresentation = (productPresentationCode, data) => {
    return async function(getState) {
        const update = await axios.put(`productpresentations/${productPresentationCode}`, data, { headers: { 'Content-Type':'application/json'}})
        return update.data;
    }

}