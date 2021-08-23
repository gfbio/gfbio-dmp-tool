// import React, { createContext, useReducer } from 'react';
//
// const initialState = {
//     isFetching: false,
//     // sections: [],
//     // questionSets: [],
//     questions: []
// };
//
// const RdmoReducer = (state, action) => {
//     switch (action.type) {
//     case 'FETCH_QUESTIONS_START':
//         console.log('Fetching questions');
//         return { ...state, isFetching: true };
//     case 'FETCH_QUESTIONS_SUCCESS':
//         console.log(action.payload);
//         return { ...state, isFetching: false, questions: action.payload };
//     case 'FETCH_QUESTIONS_FAILURE':
//         const error = action.payload;
//         alert(`There was an error fetching questions: ${error.message}. Please try again.`);
//         return { ...state, isFetching: false };
//     default:
//         throw new Error();
//     }
// };
//
