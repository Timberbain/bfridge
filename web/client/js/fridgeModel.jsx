window.jQuery = require("jquery");
window.$ = require("jquery");

import DataAccess from "./dataAccess"

export default class FridgeModel {
    constructor(url){
        this.dataAccess = new DataAccess(url);
        this.dataModel = [];
    }

    queryItems( callback ){
        let action = "get-fridge-items";
        let data = [];
        let success = ((response) => { this.dataModel = response['data']; callback(); }).bind(this);
        // let success = function(response){
        //     this.dataModel = response['data'];
        // }.bind(this);
        let failure = (response) => { console.log(response); };
        this.dataAccess.AjaxCall(action, data, success, failure);
    }

    doAction( action, data, success, failure ){
        this.dataAccess.AjaxCall(action, data, success, failure );
    }

    getItems(){
        //console.log(this);
        return this.dataModel;
    }
}
