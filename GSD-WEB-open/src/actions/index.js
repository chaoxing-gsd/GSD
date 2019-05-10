
const userInfosActions = require('./userInfos');
const personalityActions = require('./personality');
const searchResultActions=require('./searchResult');
const filterActions=require("./filter");
const chartActions=require("./chart")
const chaoxingData=require("./chaoxingData")
const hisotryActions =require("./history")
const myNotes = require("./myNotes")
const myIndexs = require("./myIndexs")

module.exports = {
    ...userInfosActions,
    ...personalityActions,
    ...searchResultActions,
    ...filterActions,
    ...chartActions,
    ...chaoxingData,
    ...hisotryActions,
    ...myNotes,
    ...myIndexs
};