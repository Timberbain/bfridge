import React from 'react'

window.jQuery = require("jquery");
window.$ = require("jquery");

class Util {
    static makeButton(icon, color, callback, enabled){
        return (
        <a className={"menu-button btn-floating btn-large " + color + " center " + (enabled ? "waves-effect waves-light" : "disabled")} onClick={ enabled ? callback : (()=>{})}>
            <i className="material-icons">{icon}</i>
        </a>
        )
    }
}


export class TextInput extends React.Component {

    isValidClass(){
        return this.props.value.length == 0 ? "" : (this.props.error == "" ? "valid" : "invalid");
    }

    render() {
        return(
            <div className="input-field col s11 black-text">
                <i className="material-icons prefix">{this.props.icon}</i>
                <input
                    id={this.props.id}
                    type="text"
                    className={"" + this.isValidClass()}
                    onChange={this.props.onChange}
                    onKeyPress={this.props.onChange}
                    value={this.props.value}
                />
                <label data-error={this.props.error} htmlFor={this.props.id}>{this.props.placeholder}</label>
            </div>
        )
    }

}


export class InputCreateForm extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            newName: "",
            errorName: "",
            newExpiration: "",
            errorExpiration: ""
        };
    }

    validateName(event){
        let input = event.target.value;

        let pattern = /[0-9a-öA-Ö\s\-\_]+/g;
        let test = pattern.exec(input);
        let error = "";
        if(test == null || test != input){
            error = "dont use special characters";
        } else if($.inArray(input.toLowerCase(), this.props.data.map((e) => { return e.name.toLowerCase(); })) != -1 ){
            error = "item already exist";
        }
        this.setState({
            errorName: error,
            newName: input
        });
    }

    validateExpiration(event){
        let input = event.target.value;

        let pattern = /\d+/g;
        let test = pattern.exec(input);
        let error = "";
        if(test == null || test != input || !Number.isInteger(input - 0)){
            error = "wrong format";
        }
        this.setState({
            errorExpiration: error,
            newExpiration: input
        });
    }

    resetForm(){
        this.setState({
            newName: "",
            errorName: "",
            newExpiration: "",
            errorExpiration: ""
        });
    }

    submitForm(){
        if(this.state.errorName == "" &&
            this.state.newName.length > 0 &&
            this.state.errorExpiration == "" &&
            this.state.newExpiration.length > 0 ){

            this.props.createItem(this.state.newName, this.state.newExpiration);
            this.resetForm();
        }
    }
    canReset(){
        return this.state.newName != "" || this.state.newExpiration != "";
    }
    canSubmit(){
        return this.state.newName != "" && this.state.newExpiration != "";
    }

    render() {
        return (
            <div className="row" style={{'lineHeight': '10px'}}>
                <form className="input-form" onSubmit={() => {return false;}} method="POST">
                    <TextInput
                        id="input-item-name"
                        icon="text_fields"
                        placeholder="Item Name"
                        onChange={this.validateName.bind(this)}
                        error={this.state.errorName}
                        value={this.state.newName}/>
                    <TextInput
                        id="input-item-expiration"
                        icon="timelapse"
                        placeholder="Expiration (days)"
                        onChange={this.validateExpiration.bind(this)}
                        error={this.state.errorExpiration}
                        value={this.state.newExpiration}/>
                    <div className="menu-controls col s12 center">
                        {Util.makeButton("add", "green", this.submitForm.bind(this), this.canSubmit() )}
                        {Util.makeButton("cached", "orange", this.resetForm.bind(this), this.canReset() )}
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


export class InputAddForm extends React.Component {
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
    addItem(){
        if(this.state.selectedItem.id != undefined && this.state.selectedItem.id != -1){
            console.log(this.state.selectedItem);
            this.props.addItem( this.state.selectedItem.id );
            this.resetItem();
        }
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
            <div className="row" style={{'lineHeight': '10px'}}>
                <ul id="available-items" className="dropdown-content col s11">
                    {this.props.data.map(((e, i) =>{
                        return <DropDownItem key={"mfid_" + i} itemname={e.name} itemid={e.id} onClick={(() => { this.selectItem(e); }).bind(this)}>{e.name}</DropDownItem>
                    }).bind(this))}

                </ul>
                <a className=" col s11 btn dropdown-button white blue-text lighten-1" href="#!" data-activates="available-items">
                    {this.itemDropdown(this.state.selectedItem.name)}
                    <span className="dropdown-item-name">{this.state.selectedItem.name}</span>

                </a>
                <div className="menu-controls center col s11">
                    {Util.makeButton("add_shopping_cart", "green", this.addItem.bind(this), this.state.selectedItem.id != -1)}
                    {Util.makeButton("cached", "orange", this.resetItem.bind(this), this.state.selectedItem.id != -1)}
                </div>
            </div>
        )
    }


}


/* Navigation bar on the left side */
export class ControlMenu extends React.Component {

    addSelectedItemToCart(id){
        this.props.update({
            action: 'add-items-to-chart',
            data: {
                id: id
            }
        });
    }

    createItem(name, expiration){
        this.props.update({
            action: 'create-fridge-item',
            data: {
                name: name,
                expiration: expiration
            }
        });
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
                        Add Item
                    </div>
                    <InputAddForm
                        data={this.props.data}
                        addItem={this.addSelectedItemToCart.bind(this)} />
                </li>
                <li className="alt_divider center"></li>
                <li>
                    <div className="center blue-text lighten-1">
                        Create Item
                    </div>
                    <InputCreateForm
                        data={this.props.data}
                        createItem={this.createItem.bind(this)} />
                </li>
            </ul>
        )
    }
}
