window.jQuery = require("jquery");
window.$ = require("jquery");

import DataAccess from "./dataAccess"

const ViewMode = {
    store : 0,
    fridge : 1
}

export default class FridgeModel {
    constructor(url){
        this.dataAccess = new DataAccess(url);
        this.carted = [];
        this.items = [];
        this.viewMode = ViewMode.store;
    }

    update ( callback ){
        let action = "get-carted-and-queued-fridge-items";
        let failure = (response) => { console.log(response, response.responseText); };

        this.dataAccess.AjaxCall(
            "get-available-fridge-items",
            [],
            function( response ){
                if(typeof response['data'] == 'object'){
                    this.items = response['data'];
                }
                // console.log(response);
                this.dataAccess.AjaxCall(
                    "get-carted-and-queued-fridge-items",
                    [],
                    function(response){
                        if(typeof response['data'] == 'object'){
                            this.carted = response['data'];
                        }
                        // console.log(response);
                        callback();
                    }.bind(this),
                    failure
                );
            }.bind(this),
            failure
        );
    }

    doAction( action, data, success, failure ){
        console.log(action, data);
        this.dataAccess.AjaxCall(action, data, success, failure );
    }
    getItems(){
        return this.items;
    }
    getCarted(){
        return this.carted;
    }
    hasQueued(){
        for(let i in this.carted){
            if(this.carted[i].queued){
                return true;
            }
        }
        return false;
    }

    getMode(){
        return this.viewMode;
    }
    setMode(mode){
        if(this.isValidMode(mode)){
            this.viewMode = mode;
        }
    }
    isValidMode(mode){
        for(let i in ViewMode){
            if(ViewMode[i] == mode)
                return true;
        }
        return false;
    }
}
