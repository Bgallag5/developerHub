import {
  GET_PROFILE,
  GET_PROFILES,
  GET_REPOS,
  NO_REPOS,
  UPDATE_PROFILE,
  CLEAR_PROFILE,
  PROFILE_ERROR,
  ACCOUNT_DELETED,
} from "../actions/types";


const intialState = {
    profiles: [],
    profile: null,
    repos: [],
    loading: true,
    errors: {}
};

export default function profileReducers(state = intialState, action) {
    const {type, payload} = action;


    switch(type){
        default:
            return state;
        case GET_PROFILE:
            return {
                ...state,
                profile: payload,
                loading: false
            }  
        case CLEAR_PROFILE:
            return {
                ...state, 
                repos: [],
                loading: false,
                profile: null,
            }    
        case PROFILE_ERROR:
            return {
                ...state,
                errors: payload,
                loading: false,
                profile: null
            }
        case GET_PROFILES:
            return state
    }
}