import axios from 'axios';

export const getAllLaboratoriesGroup = () => {
    return async function(getState) {
        const laboratoriesGroup = await axios.get(`laboratories/groups`)
        return laboratoriesGroup.data;
    }
}
export const getAllLaboratories = () => {
    return async function(getState) {
        const laboratories = await axios.get(`laboratories`)
        return laboratories.data;
    }
}

export const getDetailLaboratoryGroup = (id) => {
    return async function(getState) {
        const detail = await axios.get(`laboratories/group/${id}`)
        return detail.data;
    }
}

export const createLaboratoryGroup = (data) => {
    return async function(dispatch) {
      const createLaboraotryGroup = await axios.post(`laboratories/group`, data, { headers: { 'Content-Type':'application/json'}})
      return createLaboraotryGroup.data;
    }
}

export const updateLaboratoryGroup = (laboratoryGroupCode, data) => {
    return async function(getState) {
        const update = await axios.put(`laboratories/group/${laboratoryGroupCode}`, data, { headers: { 'Content-Type':'application/json'}})
        return update.data;
    }

}

export const deleteLaboratoryGroup = (laboratoryGroupCode) => {
    return async function(getState) {
        const deleteLaboratoryGroup = await axios.delete(`laboratories/group/${laboratoryGroupCode}`)
        return deleteLaboratoryGroup.data;
    }
}