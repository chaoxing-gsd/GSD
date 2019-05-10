var {combineReducers} = require('redux');
import {routerReducer} from 'react-router-redux';
const userInfoReducer = require('./userInfos');
const personalityReducer = require('./personality');
const searchResultReducer = require("./searchResult");
const filterReducer =require("./filter");
const chartReducer=require("./chart")
const chaoxingDataReducer=require("./chaoxingData");
const histroyDataReducer=require("./historyData");
const myNotesReducer=require("./myNotes");
const myIndexsReducer=require("./myIndexs")


module.exports = combineReducers({
    ...userInfoReducer,
    ...personalityReducer,
    ...searchResultReducer,
    ...filterReducer,
    ...chartReducer,
    ...chaoxingDataReducer,
    ...histroyDataReducer,
    ...myNotesReducer,
    ...myIndexsReducer,
    routing: routerReducer,
});
