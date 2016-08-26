import React from 'react'

window.jQuery = require("jquery");
window.$ = require("jquery");

function makeButton(icon, color, callback, enabled){
    return (
        <a className={"menu-button btn-floating btn-large " + color + " center " + (enabled ? "waves-effect waves-light" : "disabled")} onClick={ enabled ? callback : function(){}}>
            <i className="material-icons">{icon}</i>
        </a>
    )
}


export class InputForm extends React.Component {
    constructor(props){
        super(props);
        this.state = {
          valid: false
        };
    }
    render() {
        return (
            <div className="row" style={{'lineHeight': '10px'}}>
                <form className="input-form" onSubmit={function(){return false;}} method="POST">
                    <div className="input-field col black-text">
                        <i className="material-icons prefix">text_fields</i>
                        <input id="input-item-name" type="text" className="validate" />
                        <label htmlFor="input-item-name">Item Name</label>
                    </div>
                    <div className="input-field col black-text">
                        <i className="material-icons prefix">timelapse</i>
                        <input id="input-item-name" type="text" className="validate" />
                        <label htmlFor="input-item-name">Expiration (days)</label>
                    </div>
                    <div className="menu-controls center">
                        {makeButton("add", "green", function(){}, true)}
                        {makeButton("cached", "orange", function(){}, this.state.valid)}
                    </div>
                </form>
            </div>
        )
    }
}


export class DropDownItem extends React.Component {
    render(){
        return (
            <li><a className="blue-text" href="#!" onClick={this.props.onClick}>{this.props.children}</a></li>
        )
    }
}


/* Navigation bar on the left side */
export class ControlMenu extends React.Component {
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

    render() {
        return (
            <ul id="slide-out" className="side-nav" style={{transform: 'translateX(-100%)'}}>
                <li>
                    <div className="center blue-text lighten-1">
                        <h5>Menu</h5>
                        <div className="close-nav blue lighten-1 white-text" onClick={function(){$('.button-collapse').sideNav('hide');}}>
                          <i className="material-icons">keyboard_arrow_left</i>
                        </div>
                    </div>
                </li>
                <li className="alt_divider center"></li>
                <li>
                    <div className="container center blue-text lighten-1">
                        Add
                        <ul id="available-items" className="dropdown-content">
                            {this.state.items.map(function(e, i){
                                return <DropDownItem key={"mfid_" + i} itemname={e.name} itemid={e.id} onClick={function(){ this.selectItem(e); }.bind(this)}>{e.name}</DropDownItem>
                            }.bind(this))}

                        </ul>
                        <a className="btn dropdown-button white blue-text lighten-1" href="#!" data-activates="available-items">
                            {this.itemDropdown(this.state.selectedItem.name)}
                            <span className="dropdown-item-name">{this.state.selectedItem.name}</span>

                        </a>
                        <div className="menu-controls center">
                            {makeButton("add_shopping_cart", "green", function(){}, true)}
                            {makeButton("cached", "orange", this.resetItem.bind(this), this.state.selectedItem.id != -1)}
                        </div>
                    </div>
                </li>
                <li className="alt_divider center"></li>
                <li>
                    <div className="center blue-text lighten-1">
                        Create
                    </div>
                    <InputForm></InputForm>
                </li>
            </ul>
        )

    }
}
