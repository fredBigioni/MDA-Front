import axios from 'axios';

export const getLogs = () => {
    return async function(getState) {
        const logs = await axios.get(`logger/GetAll`)
        return logs.data;
    }
}

