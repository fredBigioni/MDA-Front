import axios from 'axios';

export const getUsers = () => {
    return async function(getState) {
        const users = await axios.get(`users/GetAll`)
        return users.data;
    }
}

export const getUserPermissions = (userId) => {
    return async function(getState) {
        const userPermissions = await axios.get(`users/${userId}/permissions`)
        return userPermissions.data;
    }
}

export const updateUserPermissions = (userId, permissions) => {
    return async function(getState) {
        const userPermissions = await axios.put(`users/${userId}/permissions`, permissions)
        return userPermissions.data;
    }
}

export const getCustomMarketsFullTree = () => {
    return async function(getState) {
        const tree = await axios.get(`customMarkets/full-tree`)
        return tree.data;
    }
}

export const updateUserAdministrator = (userId, data) => {
    return async function(getState) {
        const userPermissions = await axios.put(`users/${userId}`, data , { headers: { 'Content-Type':'application/json'}} )
        return userPermissions.data;
    }
}

export const createUser = (data) => {
    return async function(getState) {
        const createNewUser = await axios.post(`users`, data , { headers: { 'Content-Type':'application/json'}} )
        return createNewUser.data;
    }

}