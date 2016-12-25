//request.js
import Mock from "mockjs";
import config from "./config";
import queryString from "query-string";
import _ from "lodash";

let request = {};

let getUrl = (url) =>{
    return config.api.base + config.api[url];
}

request.get = (url,param) =>{
    url = getUrl(url);
    if(param){
        url += "?" + queryString.stringify(param);
    }
    console.log(url);
    return fetch(url)
        .then((respone) => respone.json())
        .then((respone) => Mock.mock(respone))
        .then((data) => {
            if(data.head.errcode == 0){
                return data;
            }else{
                throw new Error("error")
            }
        })
}

request.post = (url,body) => {
    let map = _.extend({},config.fetchMap,{
        body:JSON.stringify(body)
    });
    url = getUrl(url);
    return fetch(url,map)
        .then((respone) => respone.json())
        .then((respone) => Mock.mock(respone));
}

module.exports = request;