import React from 'react';
import axios from 'axios';
import CustomMarketSync from '../utils'
import { actionTypes } from './mercadosRedux'
import { FormattedMessage } from "react-intl";
import swal from 'sweetalert';

export const getCustomMarketTree = () => {
  return async function (dispatch) {
    dispatch({ type: actionTypes.RECEIVE_CUSTOM_MARKET_TREE_DATA, isLoading: true, customMarketTree: [] })
    const customMarkets = await axios.get(`customMarkets/tree`)
    dispatch({ type: actionTypes.RECEIVE_CUSTOM_MARKET_TREE_DATA, isLoading: false, customMarketTree: customMarkets.data })
  }
}


export const getLastAuditoryMarket = () => {
  return async function (dispatch) {
    try {
      dispatch({ type: actionTypes.RECEIVE_LAST_AUDITORY_VALUE, isLoading: true, lastAuditory: null });
      const response = await axios.get(`customMarkets/GetLastAuditory`);
      const lastAuditory = response.data;
      dispatch({ type: actionTypes.RECEIVE_LAST_AUDITORY_VALUE, isLoading: false, lastAuditory });
    } catch (error) {
      dispatch({ type: actionTypes.SET_GET_ERROR, visible: true, title: 'Error', description: error.message });
    }
  };
};

export const signMarket = (data) => {
  return async function (dispatch) {
    try {

      dispatch({ type: actionTypes.SET_CUSTOM_MARKET_SIGNATURE, isLoading: true, signedMessage: null });
      const resp = await axios.post('customMarkets/SignMarket', data, { headers: { 'Content-Type': 'application/json' } });
      const response = resp.data;

      if (response.status) {
        dispatch({ type: actionTypes.SET_GET_SUCCESS, visible: true, title: 'Exito!', description: response.message });

        if (response.message == "Session Expirada") {

          dispatch({ type: actionTypes.SET_GET_ERROR, visible: true, title: 'Error', description: response.message });
          swal({
            title: "Error",
            text: response.message,
            icon: "warning",
          }).then((e) => {
            if(e){
              document.location.href = '/logout'
            }
          })
        }
        swal({
          title: "Exito",
          text: response.message,
          icon: "success",
        })

        dispatch(getCustomMarketTree());
      }
      else {
        dispatch({ type: actionTypes.SET_GET_ERROR, visible: true, title: 'Error', description: response.message });
        swal({
          title: "Error",
          text: response.message,
          icon: "warning",
        })
      }
    }
    catch (error) {
      console.error("Error in SignMarket request:", error);
      dispatch({ type: actionTypes.SET_GET_ERROR, visible: true, title: 'Error', description: error.message });
    }
  }
}

export const signAll = (lineCode, userId, customMarketCount) => {
  return async function (dispatch) {
    try {

      await dispatch({ type: actionTypes.SET_CUSTOM_MARKET_SIGN_ALL, isLoading: true, customMarketCount: customMarketCount });
      const resp = await axios.post(`customMarkets/SignAllMarket/${lineCode}/${userId}`);

      const response = resp.data;

      if (response.status) {
        await dispatch(getCustomMarketTree());

        swal({
          title: "Exito",
          text: response.message,
          icon: "success",
          dangerMode: false,
        });
        await dispatch({ type: actionTypes.SET_CUSTOM_MARKET_SIGN_ALL, isLoading: false, signedMessage: null });
        // await dispatch({ type: actionTypes.SET_GET_SUCCESS, visible: true, title: 'Exito!', description: response.message });

      }
      else {
        dispatch({ type: actionTypes.SET_GET_ERROR, visible: true, title: 'Error', description: response.message });
      }
    }
    catch (error) {
      console.error("Error in SignMarket request:", error);
      dispatch({ type: actionTypes.SET_GET_ERROR, visible: true, title: 'Error', description: error.message });
    }
  }
}


export const getCustomMarkets = () => {
  return async function (dispatch) {
    dispatch({ type: actionTypes.RECEIVE_CUSTOM_MARKET_DATA, isLoading: true, customMarket: [] })
    const customMarketData = await axios.get(`customMarkets`)
    let customMarkets = [];
    if (customMarketData && customMarketData.data) {
      customMarketData.data.map(customMarket => {
        //let valueEncoded = btoa(JSON.stringify(customMarket));

        let descriptionValues = []
        if (customMarket.description) {
          descriptionValues.push(customMarket.description)
        }
        if (customMarket.line) {
          descriptionValues.push(customMarket.line)
        }
        if (customMarket.lineGroup) {
          descriptionValues.push(customMarket.lineGroup)
        }
        let description = descriptionValues.join(' / ');

        customMarkets.push({ code: customMarket.code, description: description.toUpperCase() })
      })
    }
    dispatch({ type: actionTypes.RECEIVE_CUSTOM_MARKET_DATA, isLoading: false, data: customMarkets })
  }
}

export const getCustomMarketsByLine = (lineCodes) => {
  return async function (dispatch) {
    const customMarketData = await axios.get(`customMarkets/by-line?lineCodes=${lineCodes}`)
    //const customMarketData = await axios.get(`customMarkets`)
    let customMarkets = [];
    if (customMarketData && customMarketData.data) {
      customMarketData.data.map(customMarket => {
        let valueEncoded = btoa(JSON.stringify(customMarket));

        let descriptionValues = []
        if (customMarket.description) {
          descriptionValues.push(customMarket.description)
        }
        if (customMarket.line) {
          descriptionValues.push(customMarket.line)
        }
        /*             if (customMarket.lineGroup) {
                      descriptionValues.push(customMarket.lineGroup)
                    } */
        let description = descriptionValues.join(' - ');

        customMarkets.push({ label: description.toUpperCase(), value: valueEncoded, checked: false })
      })
    }
    return customMarkets
  }
}

export const getDrugs = (itemsChecked) => {
  return function async(dispatch) {
    dispatch({ type: actionTypes.SET_LOADING_DRUGS, loading: true })
    CustomMarketSync.getDrugs().then(response => {
      let drugs = [];
      if (response && response.data) {
        response.data.map(drug => {
          let valueEncoded = btoa(JSON.stringify(drug));
          let checked = setPreviousChecked(itemsChecked, valueEncoded)

          drugs.push({ label: drug.description.toUpperCase(), value: valueEncoded, checked: checked, isGroup: drug.drugGroupCode != null })
        })
      }
      dispatch({ type: actionTypes.RECEIVE_DRUGS_DATA, drugs: drugs })
      dispatch({ type: actionTypes.SET_LOADING_DRUGS, loading: false })
    });
  }
}

export const getLaboratories = (itemsChecked) => {
  return async function (dispatch) {
    dispatch({ type: actionTypes.SET_LOADING_LABORATORIES, loading: true })
    const laboratoriesData = await axios.get(`laboratories/components`)
    let laboratories = [];
    if (laboratoriesData && laboratoriesData.data) {
      laboratoriesData.data.map(laboratory => {
        let valueEncoded = btoa(JSON.stringify(laboratory));
        let checked = setPreviousChecked(itemsChecked, valueEncoded)

        laboratories.push({ label: laboratory.description.toUpperCase(), value: valueEncoded, checked: checked, isGroup: laboratory.laboratoryGroupCode != null })
      })
    }
    dispatch({ type: actionTypes.RECEIVE_LABORATORIES_DATA, laboratories: laboratories })
    dispatch({ type: actionTypes.SET_LOADING_LABORATORIES, loading: false })
  }
}

export const createLine = (line) => {
  return async function (dispatch) {
    return axios.post(`lines`, line)
  }
}

export const updateLine = (lineCode, line) => {
  return async function (dispatch) {
    return axios.put(`lines/${lineCode}`, line)
  }
}

export const getLines = () => {
  return async function (dispatch) {
    dispatch({ type: actionTypes.RECEIVE_LINES_DATA, isLoading: true, lines: [] })
    const lines = await axios.get(`lines`)
    let linesData = [];
    if (lines && lines.data) {
      lines.data.map(line => {
        let fullDescription = line.description
        if (line.lineGroup && line.lineGroup.description) {
          fullDescription += ' / ' + line.lineGroup.description
        }
        line.fullDescription = fullDescription
        linesData.push(line)
      })
    }
    dispatch({ type: actionTypes.RECEIVE_LINES_DATA, isLoading: false, lines: linesData })
  }
}

export const getLinesByLineGroup = (lineGroupCodes) => {
  return async function (dispatch) {
    const linesData = await axios.get(`lines/by-linegroup?lineGroupCodes=${lineGroupCodes}`)
    let lines = [];
    if (linesData && linesData.data) {
      linesData.data.map(line => {
        let valueEncoded = btoa(JSON.stringify(line));
        lines.push({ label: line.description.toUpperCase(), value: valueEncoded, checked: false })
      })
    }
    return lines
  }
}

export const createLineGroup = (lineGroup) => {
  return async function (dispatch) {
    return axios.post(`lineGroups`, lineGroup)
  }
}

export const updateLineGroup = (lineGroupCode, lineGroup) => {
  return async function (dispatch) {
    return axios.put(`lineGroups/${lineGroupCode}`, lineGroup)
  }
}

export const getLineGroups = () => {
  return async function (dispatch) {
    dispatch({ type: actionTypes.SET_LOADING_LINEGROUPS, loading: true })
    const lineGroupsData = await axios.get(`linegroups`)
    let linegroups = [];
    if (lineGroupsData && lineGroupsData.data) {
      lineGroupsData.data.map(linegroup => {
        let valueEncoded = btoa(JSON.stringify(linegroup));
        linegroups.push({ label: linegroup.description.toUpperCase(), value: valueEncoded, checked: false })
      })
    }
    dispatch({ type: actionTypes.RECEIVE_LINEGROUPS_DATA, linegroups: linegroups })
    dispatch({ type: actionTypes.SET_LOADING_LINEGROUPS, loading: false })
  }
}

export const getPharmaceuticalForms = () => {
  return async function (dispatch) {
    dispatch({ type: actionTypes.SET_LOADING_PHARMACEUTICALFORMS, loading: true })
    const pharmaceuticalformsData = await axios.get(`pharmaceuticalforms`)
    let pharmaceuticalforms = [];
    if (pharmaceuticalformsData && pharmaceuticalformsData.data) {
      pharmaceuticalformsData.data.map(pharmaceuticalform => {
        let valueEncoded = btoa(JSON.stringify(pharmaceuticalform));
        let description = getPharmaceuticalFormDescription(pharmaceuticalform)
        pharmaceuticalforms.push({ label: description.toUpperCase(), value: valueEncoded, checked: false })
      })
    }
    dispatch({ type: actionTypes.RECEIVE_PHARMACEUTICALFORMS_DATA, pharmaceuticalforms: pharmaceuticalforms })
    dispatch({ type: actionTypes.SET_LOADING_PHARMACEUTICALFORMS, loading: false })
  }
}

export const getPharmaceuticalFormsByProduct = (productCodes, productGroupCodes) => {
  return async function (dispatch) {
    try {
      const pharmaceuticalformsData = await axios.get(`pharmaceuticalforms/by-product?productCodes=${productCodes}&productGroupCodes=${productGroupCodes}`)
      let pharmaceuticalforms = [];
      if (pharmaceuticalformsData && pharmaceuticalformsData.data) {
        pharmaceuticalformsData.data.map(pharmaceuticalform => {
          let valueEncoded = btoa(JSON.stringify(pharmaceuticalform));
          let description = getPharmaceuticalFormDescription(pharmaceuticalform)
          pharmaceuticalforms.push({ label: description.toUpperCase(), value: valueEncoded, checked: false })
        })
      }
      return pharmaceuticalforms
    } catch (e) {
      dispatch({
        type: actionTypes.SET_GET_ERROR,
        visible: true,
        title: <FormattedMessage id="CUSTOM_MARKET_TAB.ERROR.TITLE" />,
        description: <FormattedMessage id="CUSTOM_MARKET_TAB.ERROR.DESCRIPTION" />
      })
      return []
    }
  }
}

export const getPharmaceuticalFormsByProductPresentation = (productPresentationCodes, productPresentationGroupCodes) => {
  return async function (dispatch) {
    try {
      const pharmaceuticalformsData = await axios.get(`pharmaceuticalforms/by-productpresentation?productPresentationCodes=${productPresentationCodes}&productPresentationGroupCodes=${productPresentationGroupCodes}`)
      let pharmaceuticalforms = [];
      if (pharmaceuticalformsData && pharmaceuticalformsData.data) {
        pharmaceuticalformsData.data.map(pharmaceuticalform => {
          let valueEncoded = btoa(JSON.stringify(pharmaceuticalform));
          let description = getPharmaceuticalFormDescription(pharmaceuticalform)
          pharmaceuticalforms.push({ label: description.toUpperCase(), value: valueEncoded, checked: false })
        })
      }
      return pharmaceuticalforms
    } catch (e) {
      dispatch({
        type: actionTypes.SET_GET_ERROR,
        visible: true,
        title: <FormattedMessage id="CUSTOM_MARKET_TAB.ERROR.TITLE" />,
        description: <FormattedMessage id="CUSTOM_MARKET_TAB.ERROR.DESCRIPTION" />
      })
      return []
    }
  }
}

export const getCustomMarketDescription = (customMarket) => {
  let description = []
  if (customMarket.lineGroupDescription) {
    description.push(customMarket.lineGroupDescription)
  }
  if (customMarket.lineDescription) {
    description.push(customMarket.lineDescription)
  }
  if (customMarket.description) {
    description.push(customMarket.description)
  }
  return description.join(' / ')
}


const getPharmaceuticalFormDescription = (pharmaceuticalForm) => {
  let description = []
  if (pharmaceuticalForm.imscode) {
    description.push(pharmaceuticalForm.imscode)
  }
  if (pharmaceuticalForm.description) {
    description.push(pharmaceuticalForm.description)
  }
  return description.join(' - ')
}

export const setMarketDescriptionTitle = (description) => {
  return async function (dispatch) {
    return dispatch({ type: actionTypes.SET_CUSTOM_MARKET_TITLE, description })
  }
}
export const getCustomMarketByCode = (code) => {
  return async function (dispatch) {
    dispatch({ type: actionTypes.STORE_CUSTOM_MARKET_SELECTED, isLoading: true })
    const getCustomMarket = await axios.get(`customMarkets/${code}`)
    if (getCustomMarket && getCustomMarket.data) {
      getCustomMarket.data.customMarketDetail.forEach(function (cmd, index) {
        cmd.index = index;
      });

      getCustomMarket.data.fullDescription = getCustomMarketDescription(getCustomMarket.data)

      return dispatch({ type: actionTypes.STORE_CUSTOM_MARKET_SELECTED, isLoading: false, customMarketSelected: getCustomMarket.data })
    }
  }
}

export const getCustomMarketGroupByCustomMarketCode = (customMarketCode) => {
  return async function (dispatch) {
    dispatch({ type: actionTypes.STORE_CUSTOM_MARKET_GROUPS, isLoading: true, customMarketGroups: null })
    const getCustomMarketGroup = await axios.get(`customMarketGroups/by-custommarket?customMarketCode=${customMarketCode}`)
    if (getCustomMarketGroup && getCustomMarketGroup.data) {
      return dispatch({ type: actionTypes.STORE_CUSTOM_MARKET_GROUPS, isLoading: false, customMarketGroups: getCustomMarketGroup.data })
    }
  }
}

export const createCustomMarketGroup = (customMarketGroup) => {
  return async function (dispatch) {
    return axios.post(`customMarketGroups`, customMarketGroup)
  }
}

export const updateCustomMarketGroup = (customMakertGroupCode, customMarketGroup) => {
  return async function (dispatch) {
    return axios.put(`customMarketGroups/${customMakertGroupCode}`, customMarketGroup)
  }
}

export const deleteCustomMarketGroup = (customMakertGroupCode) => {
  return async function (dispatch) {
    return axios.delete(`customMarketGroups/${customMakertGroupCode}`)
  }
}

export const createCustomMarket = (customMarket) => {
  return async function (dispatch) {
    return await axios.post(`customMarkets`, customMarket)
  }
}

export const updateCustomMarket = (customMarket) => {
  customMarket.customMarketDetail.forEach(function (cmd, index) {
    cmd.order = index;
  });

  return async function (dispatch) {
    //dispatch({type: actionTypes.STORE_CUSTOM_MARKET_SELECTED, isLoading: true })
    const getCustomMarket = await axios.put(`customMarkets/${customMarket.code}`, customMarket)
    if (getCustomMarket && getCustomMarket.data) {
      getCustomMarket.data.customMarketDetail.forEach(function (cmd, index) {
        cmd.index = index;
      });

      getCustomMarket.data.fullDescription = getCustomMarketDescription(getCustomMarket.data)

      return dispatch({ type: actionTypes.STORE_CUSTOM_MARKET_SELECTED, isLoading: false, customMarketSelected: getCustomMarket.data })
    }
  }
}

export const deleteCustomMarket = (customMarket) => {
  return async function (dispatch) {
    //dispatch({type: actionTypes.STORE_CUSTOM_MARKET_SELECTED, isLoading: true })
    await axios.delete(`customMarkets/${customMarket.code}`)
    return dispatch({ type: actionTypes.STORE_CUSTOM_MARKET_SELECTED, isLoading: false, customMarketSelected: {}, treeVisible: true })
  }
}

export const cloneCustomMarket = (customMarket) => {
  return async function (dispatch) {
    customMarket.customMarketDetail = null
    return await axios.post(`customMarkets/clone/${customMarket.code}`, customMarket)
  }
}



export const setMarketTreeVisible = (visible) => {
  return async function (dispatch) {
    return dispatch({ type: actionTypes.SET_CUSTOM_MARKET_TREE_VISIBLE, visible })
  }
}

export const getProducts = (itemsChecked) => {
  return async function (dispatch) {
    dispatch({ type: actionTypes.SET_LOADING_PRODUCTS, loading: true })
    const products = await axios.get(`products/components`)
    if (products && products.data) {
      let productsMercado = [];
      products.data.map(product => {
        let valueEncoded = btoa(JSON.stringify(product));
        let checked = setPreviousChecked(itemsChecked, valueEncoded)

        let descriptionValues = []
        if (product.description) {
          descriptionValues.push(product.description)
        }
        if (product.class) {
          descriptionValues.push(product.class)
        }
        if (product.laboratory) {
          descriptionValues.push(product.laboratory)
        }
        let description = descriptionValues.join(' - ');
        productsMercado.push({ label: description.toUpperCase(), value: valueEncoded, checked: checked, isGroup: product.productGroupCode != null })
      })
      dispatch({ type: actionTypes.RECEIVE_PRODUCTS_DATA, products: productsMercado })
      dispatch({ type: actionTypes.SET_LOADING_PRODUCTS, loading: false })
    }
  }
}

export const getProductByDrug = (drugCodes, drugGroupCodes) => {
  return async function (dispatch) {
    try {
      const productsData = await axios.get(`products/by-drug?drugCodes=${drugCodes}&drugGroupCodes=${drugGroupCodes}`)
      let products = [];
      if (productsData && productsData.data) {
        productsData.data.map(product => {
          let valueEncoded = btoa(JSON.stringify(product));
          let descriptionValues = []
          if (product.description) {
            descriptionValues.push(product.description)
          }
          if (product.class) {
            descriptionValues.push(product.class)
          }
          if (product.laboratory) {
            descriptionValues.push(product.laboratory)
          }
          let description = descriptionValues.join(' - ');
          products.push({ label: description.toUpperCase(), value: valueEncoded, checked: false, isGroup: product.productGroupCode != null })
        })
      }
      return products
    } catch (e) {
      dispatch({
        type: actionTypes.SET_GET_ERROR,
        visible: true,
        title: <FormattedMessage id="CUSTOM_MARKET_TAB.ERROR.TITLE" />,
        description: <FormattedMessage id="CUSTOM_MARKET_TAB.ERROR.DESCRIPTION" />
      })
      return []
    }
  }
}

export const getProductByLaboratory = (laboratoryCodes, laboratoryGroupCodes) => {
  return async function (dispatch) {
    const productsData = await axios.get(`products/by-laboratory?laboratoryCodes=${laboratoryCodes}&laboratoryGroupCodes=${laboratoryGroupCodes}`)
    let products = [];
    if (productsData && productsData.data) {
      productsData.data.map(product => {
        let valueEncoded = btoa(JSON.stringify(product));
        let descriptionValues = []
        if (product.description) {
          descriptionValues.push(product.description)
        }
        if (product.class) {
          descriptionValues.push(product.class)
        }
        if (product.laboratory) {
          descriptionValues.push(product.laboratory)
        }
        let description = descriptionValues.join(' - ');
        products.push({ label: description.toUpperCase(), value: valueEncoded, checked: false, isGroup: product.productGroupCode != null })
      })
    }
    return products
  }
}

export const getProductByTherapeuticalClass = (therapeuticalClassCodes) => {
  return async function (dispatch) {
    const productsData = await axios.get(`products/by-therapeuticalClass?therapeuticalClassCodes=${therapeuticalClassCodes}`)
    let products = [];
    if (productsData && productsData.data) {
      productsData.data.map(product => {
        let valueEncoded = btoa(JSON.stringify(product));
        let descriptionValues = []
        if (product.description) {
          descriptionValues.push(product.description)
        }
        if (product.class) {
          descriptionValues.push(product.class)
        }
        if (product.laboratory) {
          descriptionValues.push(product.laboratory)
        }
        let description = descriptionValues.join(' - ');
        products.push({ label: description.toUpperCase(), value: valueEncoded, checked: false, isGroup: product.productGroupCode != null })
      })
    }
    return products
  }
}

export const getProductPresentations = (itemsChecked) => {
  return async function (dispatch) {
    dispatch({ type: actionTypes.SET_LOADING_PRODUCT_PRESENTATIONS, loading: true })
    const presentations = await axios.get(`productpresentations/components`)
    let presentationsData = [];
    if (presentations && presentations.data) {
      presentations.data.map(presentation => {
        let valueEncoded = btoa(JSON.stringify(presentation));
        let checked = setPreviousChecked(itemsChecked, valueEncoded)

        let descriptionValues = []
        if (presentation.description) {
          descriptionValues.push(presentation.description)
        }
        if (presentation.class) {
          descriptionValues.push(presentation.class)
        }
        if (presentation.laboratory) {
          descriptionValues.push(presentation.laboratory)
        }
        if (presentation.therapeuticalClass) {
          descriptionValues.push(presentation.therapeuticalClass)
        }
        let description = descriptionValues.join(' - ');
        presentationsData.push({ label: description.toUpperCase(), value: valueEncoded, checked: checked, isGroup: presentation.productPresentationGroupCode != null })
      })
    }
    dispatch({ type: actionTypes.RECEIVE_PRODUCT_PRESENTATIONS_DATA, productpresentations: presentationsData })
    dispatch({ type: actionTypes.SET_LOADING_PRODUCT_PRESENTATIONS, loading: false })
  }
}

export const getProductTypes = () => {
  return async function (dispatch) {
    const productTypes = await axios.get(`producttypes`)
    let productTypesData = [];
    if (productTypes && productTypes.data) {
      productTypes.data.map(productType => {
        productTypesData.push({ code: productType.code, description: productType.description })
      })
    }
    dispatch({ type: actionTypes.RECEIVE_PRODUCT_TYPES_DATA, producttypes: productTypesData })
  }
}

export const getPresentationsbyPharmaceuticalForms = (pharmaceuticalFormsCodes, productCodes = null, productGroupCodes = null) => {
  return async function (dispatch) {
    const presentations = await axios.get(`productpresentations/by-pharmaceuticalForm?pharmaceuticalFormCodes=${pharmaceuticalFormsCodes}&productCodes=${productCodes}&productGroupCodes=${productGroupCodes}`)
    let presentationsData = [];
    if (presentations && presentations.data) {
      presentations.data.map(presentation => {
        let valueEncoded = btoa(JSON.stringify(presentation));
        let descriptionValues = []
        if (presentation.description) {
          descriptionValues.push(presentation.description)
        }
        if (presentation.class) {
          descriptionValues.push(presentation.class)
        }
        if (presentation.laboratory) {
          descriptionValues.push(presentation.laboratory)
        }
        if (presentation.therapeuticalClass) {
          descriptionValues.push(presentation.therapeuticalClass)
        }
        let description = descriptionValues.join(' - ');
        presentationsData.push({ label: description.toUpperCase(), value: valueEncoded, checked: false, isGroup: presentation.productPresentationGroupCode != null })
      })
    }
    return presentationsData
  }
}

export const getTherapeuticalClasses = () => {
  return function async(dispatch) {
    dispatch({ type: actionTypes.SET_LOADING_THERAPEUTICAL_CLASESS, loading: true })
    CustomMarketSync.getTherapeuticalClasses().then(response => {
      let therapeuticalClasses = [];
      if (response && response.data) {
        response.data.map(therapeuticalClass => {
          let valueEncoded = btoa(JSON.stringify(therapeuticalClass));
          let descriptionValues = []
          if (therapeuticalClass.imscode) {
            descriptionValues.push(therapeuticalClass.imscode)
          }
          if (therapeuticalClass.description) {
            descriptionValues.push(therapeuticalClass.description)
          }
          let description = descriptionValues.join(' - ');
          therapeuticalClasses.push({ label: description.toUpperCase(), value: valueEncoded, checked: false })
        })
      }
      dispatch({ type: actionTypes.RECEIVE_THERAPEUTICAL_CLASESS_DATA, therapeuticalclasses: therapeuticalClasses })
      dispatch({ type: actionTypes.SET_LOADING_THERAPEUTICAL_CLASESS, loading: false })
    });
  }
}


export const createProductGroup = (data) => {
  return async function (dispatch) {
    const createProductGroup = await axios.post(`products/group`, data, { headers: { 'Content-Type': 'application/json' } })
  }
}

export const createLaboratoryGroup = (data) => {
  return async function (dispatch) {
    const createLaboraotryGroup = await axios.post(`laboratories/group`, data, { headers: { 'Content-Type': 'application/json' } })
  }
}

export const createDrugGroup = (data) => {
  return async function (dispatch) {
    const createDrugGroup = await axios.post(`drugs/group`, data, { headers: { 'Content-Type': 'application/json' } })
  }
}

export const createProductPresentationGroup = (data) => {
  return async function (dispatch) {
    const createPPGroup = await axios.post(`productpresentations/group`, data, { headers: { 'Content-Type': 'application/json' } })
  }
}

export const getCustomMarketsPreview = (code) => {
  return async function (dispatch) {
    const customMarketPreview = await axios.get(`customMarkets/preview/${code}`)
    return customMarketPreview.data
  }
}
export const getHistoricCustomMarketsPreview = (code) => {
  return async function (dispatch) {
    const customMarketPreview = await axios.get(`customMarkets/historicpreviews/${code}`)
    debugger;
    return customMarketPreview.data
  }
}
export const getHistoricCustomMarketsPreviewToScreen = (code) => {
  return async function (dispatch) {
    const customMarketPreview = await axios.get(`customMarkets/historicpreviewstoscreen/${code}`)
    debugger;
    return customMarketPreview
  }
}
export const getLastSignCustomMarketsPreviewToScreen = (code) => {
  return async function (dispatch) {
    debugger;
    const customMarketPreview = await axios.get(`customMarkets/lastsignpreviewstoscreen/${code}`)
    debugger;
    return customMarketPreview
  }
}
export const dispatchProductLoading = (loading) => {
  return async function (dispatch) {
    return dispatch({ type: actionTypes.SET_LOADING_PRODUCTS, loading: loading })
  }
}

export const dispatchProductPresentationLoading = (loading) => {
  return async function (dispatch) {
    return dispatch({ type: actionTypes.SET_LOADING_PRODUCT_PRESENTATIONS, loading: loading })
  }
}

export const dispatchTherapeuticalClassesLoading = (loading) => {
  return async function (dispatch) {
    return dispatch({ type: actionTypes.SET_LOADING_THERAPEUTICAL_CLASESS, loading: loading })
  }
}

export const dispatchLaboratoriesLoading = (loading) => {
  return async function (dispatch) {
    return dispatch({ type: actionTypes.SET_LOADING_LABORATORIES, loading: loading })
  }
}

export const dispatchDrugsLoading = (loading) => {
  return async function (dispatch) {
    return dispatch({ type: actionTypes.SET_LOADING_DRUGS, loading: loading })
  }
}


export const dispatchPharmaceuticalFormsLoading = (loading) => {
  return async function (dispatch) {
    return dispatch({ type: actionTypes.SET_LOADING_PHARMACEUTICALFORMS, loading: false })
  }
}

export const dispatchLineGroupsLoading = (loading) => {
  return async function (dispatch) {
    return dispatch({ type: actionTypes.SET_LOADING_LINEGROUPS, loading: false })
  }
}


export const dispatchProducts = (products) => {
  return function (dispatch) {
    return dispatch({ type: actionTypes.RECEIVE_PRODUCTS_DATA, products: products })
  }
}

export const dispatchProductPresentations = (productPresentations) => {
  return function (dispatch) {
    return dispatch({ type: actionTypes.RECEIVE_PRODUCT_PRESENTATIONS_DATA, productpresentations: productPresentations })
  }
}

export const dispatchTherapeuticalClasses = (therapeuticalClasses) => {
  return async function (dispatch) {
    dispatch({ type: actionTypes.RECEIVE_THERAPEUTICAL_CLASESS_DATA, therapeuticalclasses: therapeuticalClasses })
  }
}

export const dispatchLaboratories = (laboratories) => {
  return async function (dispatch) {
    dispatch({ type: actionTypes.RECEIVE_LABORATORIES_DATA, laboratories: laboratories })
  }
}

export const dispatchDrugs = (drugs) => {
  return async function (dispatch) {
    dispatch({ type: actionTypes.RECEIVE_DRUGS_DATA, drugs: drugs })
  }
}

export const dispatchPharmaceuticalForms = (pharmaceuticalforms) => {
  return async function (dispatch) {
    dispatch({ type: actionTypes.RECEIVE_PHARMACEUTICALFORMS_DATA, pharmaceuticalforms: pharmaceuticalforms })
  }
}

export const dispatchLineGroups = (linegroups) => {
  return async function (dispatch) {
    dispatch({ type: actionTypes.RECEIVE_LINEGROUPS_DATA, linegroups: linegroups })
  }
}

export const setCustomMarketPageView = (view) => {
  return function (dispatch) {
    return dispatch({ type: actionTypes.SET_CUSTOM_MARKET_PAGE_VIEW, view })
  }
}

export const resetCustomMarket = () => {
  return function (dispatch) {
    return dispatch({ type: actionTypes.RESET_CUSTOM_MARKET })
  }
}

export const setPreviousChecked = (itemsChecked, valueToCompare) => {
  let checked = false
  if (itemsChecked) {
    itemsChecked.map(item => {
      if (item.value == valueToCompare) {
        checked = true
      }
    })
  }
  return checked
}


export const setGetError = (visible, title = null, description = null) => {
  return async function (dispatch) {
    dispatch({ type: actionTypes.SET_GET_ERROR, visible: visible, title: title, description: description })
  }
}

export const setGetSuccess = (visible, title = null, description = null) => {
  return async function (dispatch) {
    dispatch({ type: actionTypes.SET_GET_SUCCESS, visible: visible, title: title, description: description })
  }
}

export const setActionCustomMarketPreview = (action) => {
  return async function (dispatch) {
    dispatch({ type: actionTypes.CUSTOM_MARKET_PREVIEW_ACTION, preview: { type: action.type, visible: action.visible, item: action.item } })
  }
}

export const actionCustomMarketPreviewReset = () => {
  return async function (dispatch) {
    dispatch({ type: actionTypes.CUSTOM_MARKET_PREVIEW_ACTION, preview: { type: '', visible: false, item: null } })
  }
}
