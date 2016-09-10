window.jQuery = require("jquery");
window.$ = require("jquery");
require("jquery-validation");
require("./materialize.min.js");

// import angular from 'angular';
import React from 'react'
import {render} from 'react-dom'

import {FridgeItems, FridgeItem} from './fridgeitems'
import {ControlMenu} from './controlMenu'

import FridgeModel from './fridgeModel'

$(document).ready( init );

function init() {
    $(".button-collapse").sideNav();
    Materialize.updateTextFields();

    // $('.collapsible').collapsible();

}

/* Angular approach */
// (function(){
//
//     var app = angular.module("bfridge", []);
//
//     app.directive("fridgeItem", function(){
//         return {
//             restrict: 'E',
//             replace: true,
//             templateUrl: 'templates/fridge-item.html',
//             controllerAs: 'fridgeItemController',
//             controller: ["$scope", function($scope){
//             }]
//         };
//     });
// })();

// class FridgeUtil {
//     Ajax(url, action, success, failure){
//         $.ajax(
//             {
//                 url: url,
//                 dataType: 'json',
//                 async: true,
//                 cache: false,
//                 action: "POST",
//                 data: {
//                     action: action
//                 },
//                 success: function(result) {
//                     if(result.error){
//                         console.log(result.message);
//                     } else {
//                         success(result.data);   // this.setState({data: result.data});
//                     }
//                 }.bind(this),
//                 error: function(xhr, status, err) {
//                     console.log(this.props.url, status, err.toString());
//                 }.bind(this)
//             }
//         );
//     }
// }


/* React approach */
(function(){



    class Main extends React.Component {

        constructor(props){
            super(props);
            this.model = new FridgeModel("dataServer.php");
            this.state = {
                items : [],
                carted: []
            }

        }

        componentDidMount() {
            this.updateModel();
        }

        buyQueuedItems(){
            this.updateModel({
                action: 'buy-all-queued-items',
                data: {}
            });
        }


        updateModel( props = {} ){
            if( props.action ){
                // console.log(props);
                this.model.doAction(
                    props.action,
                    props.data || {},
                    ((e) => { console.log(e); this.updateModel(); }).bind(this),
                    ((e) => { console.log(e); this.updateModel(); }).bind(this))
            } else {
                this.model.update(
                    (() => {this.setState({
                        items: this.model.getItems(),
                        carted: this.model.getCarted()
                    })}).bind(this)
                );
            }
        }

        render() {
            return (
                <div>
                    <nav className="blue lighten-1">
                        <div className="nav-wrapper container">

                            <a className={"right " + (this.model.hasQueued() ? "waves-effect waves-light" : "disabled") + " btn-floating btn-large yellow small-margin"}
                                onClick={this.buyQueuedItems.bind(this)}>
                                <i className="material-icons">attach_money</i>
                            </a>

                            <a className="center brand-logo" href="">
                                <img className="header-icon responsive-img" src="images/bfridge_icon.png" />
                            </a>
                            <a href="#" data-activates="slide-out" className="button-collapse show-on-large">
                                <i className="material-icons">menu</i>
                            </a>
                        </div>
                    </nav>
                    <ControlMenu data={this.state.items} update={this.updateModel.bind(this)} />
                    <FridgeItems data={this.state.carted} update={this.updateModel.bind(this)} />
                </div>
            )
        }
    }



    render(<Main/>, $("#fridge").get(0));
})();
