import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk'; 
import root from './reducers';

const initialState = {};
const middleWare = [thunk];

//init the redux store with reducers, initState, middleware
const store = createStore(root, initialState, composeWithDevTools(applyMiddleware(...middleWare)))

export default store;