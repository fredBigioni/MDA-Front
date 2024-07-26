import axios from 'axios';

export const getAll = () => {
    return async function(getState) {
        const businessUnits = await axios.get(`businessUnits`)
        return businessUnits;
    }
}

export const createBusinessUnit = (data) => {
    return async function(getState) {
        const businessUnits = await axios.post(`businessUnits`, data, { headers: { 'Content-Type':'application/json'}})
        return businessUnits.data;
    }
}

export const updateBusinessUnit = (businessUnitCode, data) => {
    return async function(getState) {
        const businessUnits = await axios.put(`businessUnits/${businessUnitCode}`, data, { headers: { 'Content-Type':'application/json'}})
        return businessUnits.data;
    }
}