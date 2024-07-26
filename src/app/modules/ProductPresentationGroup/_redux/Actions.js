import axios from 'axios';

export const getAllProductPresentationGroup = () => {
    return async function(getState) {
        const productGroup = await axios.get(`productpresentations/groups`)
        return productGroup.data;
    }
}

export const getAllProductPresentation = () => {
    return async function(getState) {
        const productPresentations = await axios.get(`productpresentations`)
        return productPresentations.data;
    }
}

export const getDetailProductPresentationGroup = (id) => {
    return async function(getState) {
        const detail = await axios.get(`productpresentations/group/${id}`)
        return detail.data;
    }
}

export const createProductPresentationGroup = (data) => {
    return async function(dispatch) {
      const createPPGroup = await axios.post(`productpresentations/group`, data, { headers: { 'Content-Type':'application/json'}})
      return createPPGroup.data
    }
}

export const updateProductPresentationGroup = (productPresentationCode, data) => {
    return async function(getState) {
        const update = await axios.put(`productpresentations/group/${productPresentationCode}`, data, { headers: { 'Content-Type':'application/json'}})
        return update.data;
    }

}

export const deleteProductPresentationGroup = (productPresentationGroupCode) => {
    return async function(getState) {
        const deleteProductPresentationGroup = await axios.delete(`productpresentations/group/${productPresentationGroupCode}`)
        return deleteProductPresentationGroup.data;
    }
}