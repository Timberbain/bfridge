import React from 'react'

window.jQuery = require("jquery");
window.$ = require("jquery");

class Util {
    static makeButton(icon, color, callback, enabled){
        return (
        <a className={"menu-button btn-floating btn-large " + color + " center " + (enabled ? "waves-effect waves-light" : "disabled")} onClick={ enabled ? callback : function(){}}>
            <i className="material-icons">{icon}</i>
        </a>
        )
    }
}


export class TextInput extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            isEmpty: true,
            valid: false,
            errorMessage: "invalid",
        }
    }

    validate( event ){
        let value = event.target.value;
        let error = this.props.validate(value);
        this.setState({
            isEmpty: value.length == 0,
            valid: error === true,
            errorMessage: error
        });
    }

    isValidClass(){
        return this.state.isEmpty ? "" : (this.state.valid ? "valid" : "invalid");
    }


    render() {
        return(
            <div className="input-field col black-text">
                <i className="material-icons prefix">{this.props.icon}</i>
                <input
                    id={this.props.id}
                    type="text"
                    className={"validate " + this.isValidClass()}
                    onChange={this.validate.bind(this)}
                    onKeyPress={this.validate.bind(this)}
                />
                <label data-error={this.state.errorMessage} htmlFor={this.props.id}>{this.props.placeholder}</label>
            </div>
        )
    }

}
TextInput.defaultProps = {
    validate: () => { return true; }
}



export class InputCreateForm extends React.Component {
    constructor(props){
        super(props);
        this.state = {
          validName: false,
          validExpiration: false
        };
    }

    handleSubmit( e ){
        e.preventDefault();

    }

    render() {
        return (
            <div className="row" style={{'lineHeight': '10px'}}>
                <form className="input-form" onSubmit={function(){return false;}} method="POST">
                    <TextInput
                        id="input-item-name"
                        icon="text_fields"
                        placeholder="Item Name"
                        validate= {() => { }} />
                    <TextInput
                        id="input-item-expiration"
                        icon="timelapse"
                        placeholder="Expiration (days)" />
                    <div className="menu-controls center">
                        {Util.makeButton("add", "green", function(){}, true)}
                        {Util.makeButton("cached", "orange", function(){}, this.state.valid)}
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
            items: [],
        };
    }

    selectItem(item){
        this.setState({selectedItem: item});
    }
    resetItem(){
        this.selectItem({id:-1, name:""});
    }

    addSelectedItemToCart(){
        if(this.state.selectedItem.id != -1){
            this.props.update({
                action: 'add-items-to-chart',
                props: {
                    id: this.state.selectedItem.id
                }
            });
            this.resetItem();
        }
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
                            {this.props.data.map(function(e, i){
                                return <DropDownItem key={"mfid_" + i} itemname={e.name} itemid={e.id} onClick={function(){ this.selectItem(e); }.bind(this)}>{e.name}</DropDownItem>
                            }.bind(this))}

                        </ul>
                        <a className="btn dropdown-button white blue-text lighten-1" href="#!" data-activates="available-items">
                            {this.itemDropdown(this.state.selectedItem.name)}
                            <span className="dropdown-item-name">{this.state.selectedItem.name}</span>

                        </a>
                        <div className="menu-controls center">
                            {Util.makeButton("add_shopping_cart", "green", this.addSelectedItemToCart.bind(this), true)}
                            {Util.makeButton("cached", "orange", this.resetItem.bind(this), this.state.selectedItem.id != -1)}
                        </div>
                    </div>
                </li>
                <li className="alt_divider center"></li>
                <li>
                    <div className="center blue-text lighten-1">
                        Create
                    </div>
                    <InputCreateForm></InputCreateForm>
                </li>
            </ul>
        )

    }
}
