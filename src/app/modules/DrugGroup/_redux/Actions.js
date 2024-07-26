import axios from 'axios';

export const getAllDrugGroup = () => {
    return async function(getState) {
        const drugGroup = await axios.get(`drugs/groups`)
        return drugGroup.data;
    }
}

export const getAllDrugs = () => {
    return async function(getState) {
        const drugs = await axios.get(`drugs`)
        return drugs.data;
    }
}

export const getDetailDrugGroup = (id) => {
    return async function(getState) {
        const detail = await axios.get(`drugs/group/${id}`)
        return detail.data;
    }
}

export const createDrugGroup = (data) => {
    return async function(dispatch) {
      const createDrugGroup = await axios.post(`drugs/group`, data, { headers: { 'Content-Type':'application/json'}})
      return createDrugGroup.data;
    }
}

export const updateDrugGroup = (drugGroupCode, data) => {
    return async function(getState) {
        const update = await axios.put(`drugs/group/${drugGroupCode}`, data, { headers: { 'Content-Type':'application/json'}})
        return update.data;
    }

}

export const deleteDrugGroup = (drugGroupCode) => {
    return async function(getState) {
        const deleteDrugGroup = await axios.delete(`drugs/group/${drugGroupCode}`)
        return deleteDrugGroup.data;
    }
}