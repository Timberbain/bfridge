window.jQuery = require("jquery");
window.$ = require("jquery");
require("./materialize.min.js");

// import angular from 'angular';
import React from 'react'
import {render} from 'react-dom'

import {FridgeItems, FridgeItem} from './fridgeitems'

$(document).ready( init );

function init() {
    $(".button-collapse").sideNav();
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

    class LeftMenuItem extends React.Component {
        render(){
            return (
                <li><a className="blue-text" href="#!" onClick={this.props.onClick}>{this.props.children}</a></li>
            )
        }
    }

    class LeftMenu extends React.Component {
        //@ Override
        constructor(props){
            super(props);
            this.state = {
                selectedItem: {id: -1, name: ""},
                items: [
                    {id: 0, name: "Mjölk"},
                    {id: 1, name: "Smör"},
                    {id: 2, name: "Socker"}
                ],
            };
        }

        selectItem(item){
            this.setState({selectedItem: item});
        }
        resetItem(){
            this.selectItem({id:-1, name:""});
        }

        itemDropdown(name){
            if(name == ""){
                return <i className="material-icons">keyboard_arrow_down</i>
            } else {
                return <i className="material-icons">keyboard_arrow_right</i>
            }
        }
        makeButton(icon, color, callback, enabled){
            return (
                <a className={"menu-button btn-floating btn-large " + color + " center " + (enabled ? "waves-effect waves-light" : "disabled")} onClick={ enabled ? callback : function(){}}>
                    <i className="material-icons">{icon}</i>
                </a>
            )
        }

        render() {
            return (
                <ul id="slide-out" className="side-nav" style={{transform: 'translateX(-100%)'}}>
                    <li>
                        <div className="center blue-text lighten-1">
                            <h5>Menu</h5>
                        </div>
                    </li>
                    <li className="alt_divider center"></li>
                    <li>
                        <div className="center blue-text lighten-1">
                            Add
                            <ul id="available-items" className="dropdown-content">
                                {this.state.items.map(function(e, i){
                                    return <LeftMenuItem key={"mfid_" + i} itemname={e.name} itemid={e.id} onClick={function(){ this.selectItem(e); }.bind(this)}>{e.name}</LeftMenuItem>
                                }.bind(this))}

                            </ul>
                            <a className="btn dropdown-button white blue-text lighten-1" href="#!" data-activates="available-items">
                                {this.itemDropdown(this.state.selectedItem.name)}
                                <span className="dropdown-item-name">{this.state.selectedItem.name}</span>

                            </a>
                            <div className="menu-controls center">
                                {this.makeButton("add_shopping_cart", "green", function(){}, true)}
                                {this.makeButton("cached", "orange", this.resetItem.bind(this), this.state.selectedItem.id != -1)}
                            </div>
                        </div>
                    </li>
                    <li className="alt_divider center"></li>
                    <li>
                        <div className="center blue-text lighten-1">
                            Create
                        </div>
                    </li>
                </ul>
            )

        }
    }

    class Main extends React.Component {
        render() {
            return (
                <nav className="blue lighten-1">
                    <div className="nav-wrapper container">
                        <LeftMenu url={this.props.url}></LeftMenu>
                        <a className="right brand-logo" href="#">
                            <img className="header-icon responsive-img" src="images/bfridge_icon.png" />
                        </a>
                        <a href="#" data-activates="slide-out" className="button-collapse show-on-large">
                            <i className="material-icons">menu</i>
                        </a>
                    </div>
                    <FridgeItems url={this.props.url}/>
                </nav>
            )
        }
    }



    render(<Main url="dataServer.php"/>, $("#fridge").get(0));
})();
