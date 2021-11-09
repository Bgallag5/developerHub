import axios from "axios";
import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    AUTH_ERROR,
    USER_LOADED,
    LOGIN_FAIL,
    LOGIN_SUCCESS,
} from "./types";
import { setAlert } from "./alert";
import setAuthToken from "../utils/setAuthToken";

//Get User
export const loadUser = () => async( dispatch ) => {
    //if token exists, set it as auth token
    if ( localStorage.token ) {
        setAuthToken( localStorage.token );
    }

    try {
        const response = await axios.get( "/api/auth" );
        //if response 200 send user as response.data
        dispatch( {
            type: USER_LOADED,
            payload: response.data,
        } );
    } catch ( err ) {
        console.log( err );
        dispatch( {
            type: AUTH_ERROR,
        } );
    }
};

//Register User
export const registerUser =
    ( { username, email, password } ) =>
    async( dispatch ) => {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        const body = JSON.stringify( { username, email, password } );

        try {
            //await Post to /users
            const response = await axios.post( "/api/users", body, config );
            //dispatch REGISTER_SUCCESS with payload token (response.data is a token)
            dispatch( {
                type: REGISTER_SUCCESS,
                payload: response.data,
            } );
            //dispatch loadUser if Register successful
            dispatch( loadUser() );
        } catch ( err ) {
            console.log( err );
            const errors = err.response.data.errors;

            if ( errors ) {
                errors.forEach( ( err ) => dispatch( setAlert( err.msg, "danger" ) ) );
            }

            dispatch( {
                type: REGISTER_FAIL,
            } );
        }
    };

//Login User
export const loginUser =
    ( { email, password } ) =>
    async( dispatch ) => {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        const body = JSON.stringify( { email, password } );

        try {
            //await Post to /users
            const response = await axios.post( "/api/auth", body, config );

            dispatch( {
                type: LOGIN_SUCCESS,
                payload: response.data,
            } );
            //dispatch loadUser if login successful
            dispatch( loadUser() );
        } catch ( err ) {
            console.log( err );
            const errors = err.response.data.errors;

            if ( errors ) {
                errors.forEach( ( err ) => dispatch( setAlert( err.msg, "danger" ) ) );
            }

            dispatch( {
                type: LOGIN_FAIL,
            } );
        }
    };

//logOut User
export const logoutUser = () => async ( dispatch ) => {
    //to logout I send a login In Fail
    try {
        dispatch( {
            type: LOGIN_FAIL,
        } );
        //relocate user to login 
        window.location.replace('/login');
    } catch ( err ) {
        console.log( err );
    }
};