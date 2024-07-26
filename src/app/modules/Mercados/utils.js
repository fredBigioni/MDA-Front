import axios from 'axios'

class CustomMarketSync {

    getProducts = async() => {
        return await axios.get(`products/components`)
    }
    getDrugs = async() => {
        return await axios.get(`drugs/components`)
    }
    getProductPresentations = async() => {
        return await axios.get(`productpresentations/components`)
    }
    getLaboratories = async() => {
        return await axios.get(`laboratories/components`)
    }
    getPharmaceuticalForms = async() => {
        return await axios.get(`pharmaceuticalforms`)
    }

    getLineGroups = async() => {
        return await axios.get(`linegroups`)
    }
    
    getTherapeuticalClasses = async() => {
        return await axios.get(`therapeuticalclasses/component`)
    }
}

export default new CustomMarketSync;