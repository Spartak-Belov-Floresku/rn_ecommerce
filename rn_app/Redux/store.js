// Import necessary modules
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';


import cartItems from './Reducers/cartitem';
// Combine reducers (currently empty but ready for additional reducers)
const reducer = combineReducers({
    cartItems: cartItems
});

// Custome logger middleware for development
const loggerMiddleware = store => next => action => {
    console.log('loggerMiddleware works');

    if (!action.type) {
        console.log('No action type.');
        return next(action);
    }

    console.log('type ', action.type);
    console.log('payload ', action.payload);
    console.log('currentState ', store.getState());

    next(action);

    console.log('next state: ', store.getState());
};

// Define middlewares (include logger only in development)
const middlewares = [
    process.env.NODE_ENV === 'development' && loggerMiddleware,
    thunk
].filter(Boolean); // Remove falsy values (e.g., logger in production)

// Configure store
const store = configureStore({
    reducer, // Add the root reducer
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(middlewares), // Add custom middlewares
    devTools: process.env.NODE_ENV === 'development', // Enable Redux DevTools only in development
});

// Export the configured store
export default store;
