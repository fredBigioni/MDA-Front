import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { put, takeLatest } from "redux-saga/effects";

export const actionTypes = {
    RECEIVE_DRUGS_DATA: "RECEIVE_DRUGS_DATA",
    RECEIVE_PREVIEW_DATA: "RECEIVE_PREVIEW_DATA",
    RECEIVE_PREVIEW_HISTORYDATA:"RECEIVE_PREVIEW_HISTORYDATA",
    RECEIVE_PREVIEW_HISTORYDATATOSCREEN:"RECEIVE_PREVIEW_HISTORYDATATOSCREEN",
    RECEIVE_LABORATORIES_DATA: "RECEIVE_LABORATORIES_DATA",
    RECEIVE_LINEGROUPS_DATA: "RECEIVE_LINEGROUPS_DATA",
    RECEIVE_PHARMACEUTICALFORMS_DATA: 'RECEIVE_PHARMACEUTICALFORMS_DATA',
    RECEIVE_PRODUCTS_DATA: "RECEIVE_PRODUCTS_DATA",
    RECEIVE_PRODUCT_PRESENTATIONS_DATA: "RECEIVE_PRODUCT_PRESENTATIONS_DATA",
    RECEIVE_THERAPEUTICAL_CLASESS_DATA: "RECEIVE_THERAPEUTICAL_CLASESS_DATA",
    RECEIVE_LINES_DATA: "RECEIVE_LINES_DATA",
    RECEIVE_PRODUCT_TYPES_DATA: "RECEIVE_PRODUCT_TYPES_DATA",
    RECEIVE_LAST_AUDITORY_VALUE: "RECEIVE_LAST_AUDITORY_VALUE",
    RECEIVE_CUSTOM_MARKET_DATA: 'RECEIVE_CUSTOM_MARKET_DATA',
    RECEIVE_CUSTOM_MARKET_TREE_DATA: 'RECEIVE_CUSTOM_MARKET_TREE_DATA',
    SET_CUSTOM_MARKET_TITLE: 'SET_CUSTOM_MARKET_TITLE',
    SET_CUSTOM_MARKET_TREE_VISIBLE: 'SET_CUSTOM_MARKET_TREE_VISIBLE',
    SET_CUSTOM_MARKET_PAGE_VIEW: 'SET_CUSTOM_MARKET_PAGE_VIEW',
    SET_LOADING: "SET_LOADING",
    SET_LOADING_PRODUCTS: "SET_LOADING_PRODUCTS",
    SET_LOADING_PRODUCT_PRESENTATIONS: "SET_LOADING_PRODUCT_PRESENTATIONS",
    SET_LOADING_THERAPEUTICAL_CLASESS: "SET_LOADING_THERAPEUTICAL_CLASESS",
    SET_LOADING_LABORATORIES: "SET_LOADING_LABORATORIES",
    SET_LOADING_DRUGS: "SET_LOADING_DRUGS",
    SET_LOADING_PHARMACEUTICALFORMS: 'SET_LOADING_PHARMACEUTICALFORMS',
    SET_LOADING_LINEGROUPS: 'SET_LOADING_LINEGROUPS',
    SET_GET_ERROR: 'SET_GET_ERROR',
    SET_GET_SUCCESS: 'SET_GET_SUCCESS',
    SET_CUSTOM_MARKET_SIGNATURE: 'SET_CUSTOM_MARKET_SIGNATURE',
    SET_CUSTOM_MARKET_SIGN_ALL: 'SET_CUSTOM_MARKET_SIGN_ALL',
    SET_CUSTOM_MARKET_SIGN_ALL_COUNT: 'SET_CUSTOM_MARKET_SIGN_ALL_COUNT',
    RESET_CUSTOM_MARKET: 'RESET_CUSTOM_MARKET',
    CUSTOM_MARKET_PREVIEW_ACTION: 'CUSTOM_MARKET_PREVIEW_ACTION',
    STORE_CUSTOM_MARKET_SELECTED: 'STORE_CUSTOM_MARKET_SELECTED',
    STORE_CUSTOM_MARKET_GROUPS: 'STORE_CUSTOM_MARKET_GROUPS',

};

const initialState = {
    drugs: null,
    laboratories: null,
    lines: { data: [], isLoading: false },
    linegroups: null,
    pharmaceuticalforms: null,
    products: null,
    productpresentations: null,
    producttypes: null,
    therapeuticalclasses: null,
    customMarket: { data: {}, isLoading: false, description: '', treeVisible: true },
    customMarketPreviewAction: { type: '', item: null, visible: false, action: null },
    loading: true,
    customMarketGroups: { data: {}, isLoading: false },
    customMarketTree: { data: {}, isLoading: true },
    customMarketPageView: { view: '' },
    loadingProducts: true,
    loadingProductPresentations: true,
    loadingTherapeuticalClasses: true,
    loadingLaboratories: true,
    loadingDrugs: true,
    pharmaceuticalformsLoading: true,
    loadingLineGroups: true,
    allCustomMarket: { data: {}, isLoading: true },
    getError: { visible: false, title: null, description: null },
    getSuccess: { visible: false, title: null, description: null },
    lastAuditory: null,
    signedMessage: null,
    isLoading: false,
    customMarketCount: 0,
    marketPreviewData:null,
    marketHistoryArray:[],
    marketHistoryArrayToScreen:[]
};

export const reducer = persistReducer(
    { storage, key: "mda-components", whitelist: ["user", "authToken"] },
    (state = initialState, action) => {
        switch (action.type) {

            case actionTypes.SET_CUSTOM_MARKET_SIGN_ALL:
                return { ...state, isLoading: action.isLoading,  customMaketCount: action.customMarketCount  }

            case actionTypes.SET_CUSTOM_MARKET_SIGN_ALL_COUNT:
                return { ...state, customMaketCount: action.customMarketCount }

            case actionTypes.SET_CUSTOM_MARKET_SIGNATURE:
                return { ...state, signedMessage: action.signedMessage }

            case actionTypes.RECEIVE_PRODUCTS_DATA:
                return { ...state, products: action.products }

            case actionTypes.RECEIVE_PREVIEW_DATA:
                return { ...state, marketPreviewData: action.data }   
                
            case actionTypes.RECEIVE_PREVIEW_HISTORYDATA:
                return { ...state, marketHistoryArray: action.historyData }

            case actionTypes.RECEIVE_PREVIEW_HISTORYDATATOSCREEN:
                return { ...state, marketHistoryArrayToScreen: action.historyDataToScreen }     

            case actionTypes.RECEIVE_LAST_AUDITORY_VALUE:
                return { ...state, lastAuditory: action.lastAuditory, isLoading: action.isLoading };

            case actionTypes.RECEIVE_DRUGS_DATA:
                return { ...state, drugs: action.drugs }

            case actionTypes.RECEIVE_PHARMACEUTICALFORMS_DATA:
                return { ...state, pharmaceuticalforms: action.pharmaceuticalforms }

            case actionTypes.RECEIVE_PRODUCT_PRESENTATIONS_DATA:
                return { ...state, productpresentations: action.productpresentations }

            case actionTypes.RECEIVE_LINES_DATA:
                return {
                    ...state,
                    lines: {
                        ...state.lines,
                        data: action.lines,
                        isLoading: action.isLoading
                    }
                }

            case actionTypes.RECEIVE_LINEGROUPS_DATA:
                return { ...state, linegroups: action.linegroups }

            case actionTypes.RECEIVE_LABORATORIES_DATA:
                return { ...state, laboratories: action.laboratories }

            case actionTypes.RECEIVE_THERAPEUTICAL_CLASESS_DATA:
                return { ...state, therapeuticalclasses: action.therapeuticalclasses }

            case actionTypes.SET_CUSTOM_MARKET_TITLE:
                return {
                    ...state,
                    customMarket: {
                        ...state.customMarket,
                        description: action.description
                    }
                }

            case actionTypes.STORE_CUSTOM_MARKET_SELECTED:
                return {
                    ...state,
                    customMarket: {
                        ...state.customMarket,
                        data: action.customMarketSelected,
                        isLoading: action.isLoading,
                        treeVisible: action.treeVisible
                    }
                }

            case actionTypes.SET_CUSTOM_MARKET_TREE_VISIBLE:
                return {
                    ...state,
                    customMarket: {
                        ...state.customMarket,
                        treeVisible: action.visible
                    }
                }

            case actionTypes.STORE_CUSTOM_MARKET_GROUPS:
                return {
                    ...state,
                    customMarketGroups: {
                        ...state.customMarketGroups,
                        data: action.customMarketGroups,
                        isLoading: action.isLoading
                    }
                }

            case actionTypes.RECEIVE_PRODUCT_TYPES_DATA:
                return { ...state, producttypes: action.producttypes }

            case actionTypes.RECEIVE_CUSTOM_MARKET_TREE_DATA:
                return {
                    ...state,
                    customMarketTree: {
                        ...state.customMarketGroups,
                        data: action.customMarketTree,
                        isLoading: action.isLoading
                    }
                }

            case actionTypes.SET_CUSTOM_MARKET_PAGE_VIEW:
                return {
                    ...state,
                    customMarketPageView: {
                        view: action.view
                    }
                }
            case actionTypes.RESET_CUSTOM_MARKET:
                return initialState;

            case actionTypes.SET_LOADING:
                return { ...state, loading: action.loading }

            case actionTypes.SET_LOADING_PRODUCTS:
                return { ...state, loadingProducts: action.loading }

            case actionTypes.SET_LOADING_PRODUCT_PRESENTATIONS:
                return { ...state, loadingProductPresentations: action.loading }

            case actionTypes.SET_LOADING_THERAPEUTICAL_CLASESS:
                return { ...state, loadingTherapeuticalClasses: action.loading }

            case actionTypes.SET_LOADING_LABORATORIES:
                return { ...state, loadingLaboratories: action.loading }

            case actionTypes.SET_LOADING_DRUGS:
                return { ...state, loadingDrugs: action.loading }

            case actionTypes.SET_LOADING_PHARMACEUTICALFORMS:
                return { ...state, pharmaceuticalformsLoading: action.loading }

            case actionTypes.SET_LOADING_LINEGROUPS:
                return { ...state, loadingLineGroups: action.loading }

            case actionTypes.RECEIVE_CUSTOM_MARKET_DATA:
                return {
                    ...state,
                    allCustomMarket: {
                        data: action.data,
                        isLoading: action.isLoading
                    }
                }

            case actionTypes.SET_GET_ERROR:
                return {
                    ...state,
                    getError: {
                        visible: action.visible,
                        title: action.title,
                        description: action.description,
                    }
                }

            case actionTypes.SET_GET_SUCCESS:
                return {
                    ...state,
                    getSuccess: {
                        visible: action.visible,
                        title: action.title,
                        description: action.description,
                    }
                }
            case actionTypes.CUSTOM_MARKET_PREVIEW_ACTION:
                return {
                    ...state,
                    customMarketPreviewAction: {
                        visible: action.preview.visible,
                        type: action.preview.type,
                        item: action.preview.item,
                    }
                }
            default:
                return state;
        }
    }
);
