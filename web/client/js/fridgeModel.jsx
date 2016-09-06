window.jQuery = require("jquery");
window.$ = require("jquery");

import DataAccess from "./dataAccess"

export default class FridgeModel {
    constructor(url){
        this.dataAccess = new DataAccess(url);
        this.queued = [];
        this.items = [];
    }

    update ( callback ){
        let action = "get-charted-fridge-items";
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
                    "get-charted-fridge-items",
                    [],
                    function(response){
                        if(typeof response['data'] == 'object'){
                            this.queued = response['data'];
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
    getQueued(){
        return this.queued;
    }
}
