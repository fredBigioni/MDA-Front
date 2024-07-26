import {all} from "redux-saga/effects";
import {combineReducers} from "redux";

import * as auth from "../app/modules/Auth/_redux/authRedux";
import * as mercados from "../app/modules/Mercados/_redux/mercadosRedux";

export const rootReducer = combineReducers({
  auth: auth.reducer,
  mercados: mercados.reducer
});

export function* rootSaga() {
  yield all([auth.saga()]);
}
