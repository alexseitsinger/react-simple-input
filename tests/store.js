import { createStore as createReduxStore } from "redux"
import { appReducer } from "./reducer"

export function createStore(initialState = {}) {
  return createReduxStore(appReducer, initialState)
}
