import React from 'react'

export class FridgeItems extends React.Component {

    //@ Override
    constructor(props){
        super(props);
        this.state = {
            data: []
        };
    }

    removeItem(hid){
        if(confirm("Item will be removed. Are you sure?")){
            this.props.update({
                action: 'remove-item-from-cart',
                data: {
                    hid: hid
                }
            });
        }
    }
    queueItem(hid){
        this.props.update({
            action: 'add-item-to-buy-queue',
            data: {
                hid: hid
            }
        });
    }

    unqueueItem(hid){
        this.props.update({
            action: 'remove-item-from-buy-queue',
            data: {
                hid: hid
            }
        });
    }


    //@ Override
    render() {
        let items = this.props.data;
        let itemViews = items.map(function(e, i){
            return <FridgeItem
                key={"hid_" + i}
                hid={e.hid}
                name={e.name}
                date={e.date}
                queued={e.queued}
                elapsed={e.elapsed}
                queueItem={this.queueItem.bind(this)}
                unqueueItem={this.unqueueItem.bind(this)}
                removeItem={this.removeItem.bind(this)}
                />;
        }.bind(this));

        return (
            <div className="fridgeItems">
            {itemViews}
            </div>
        )
    }
}

export class FridgeItem extends React.Component {

    //@ Override
    constructor(props){
        super(props);
    }

    color(){
        if(this.props.queued){
            return "orange";
        } else {
            return "blue";
        }
    }

    button(){
        if(this.props.queued){
            return (
                <a className="waves-effect waves-light btn-floating btn-large red small-margin"
                    onClick={(()=>{this.props.unqueueItem(this.props.hid)}).bind(this)}>
                    <i className="material-icons">lock_open</i>
                </a>
            )
        } else {
            return (
                <div>
                <a className="waves-effect waves-light btn-floating btn-large green small-margin"
                    onClick={(()=>{this.props.queueItem(this.props.hid)}).bind(this)}>
                    <i className="material-icons">lock</i>
                </a>
                <a className="waves-effect waves-light btn-floating btn-large orange small-margin"
                    onClick={(()=>{this.props.removeItem(this.props.hid)}).bind(this)}>
                    <i className="material-icons">remove_shopping_cart</i>
                </a>
                </div>
            )
        }
    }

    //@ Override
    render () {
        return (
            <div className={"fridge-item card " + this.color() + " lighten-1"}>
                <div className="card-content">
                    <div className="card-title center white-text">
                        {this.props.name}
                    </div>
                    <div className={"f-chip chip white " + this.color() + "-text lighten-1"}>
                        <span className={"tiny f-icon " + this.color() + " white-text lighten-1"}>
                            <i className="ion-calendar tiny white-text lighten-1"></i>
                        </span>
                        {this.props.date}
                    </div>
                    <div className={"f-chip chip white " + this.color() + "-text lighten-1"}>
                        <span className={"tiny f-icon " + this.color() + " white-text lighten-1"}>
                            <i className="ion-clock tiny white-text lighten-1"></i>
                        </span>
                        {this.props.elapsed}
                    </div>
                    <div className="card-action center no-border" style={{'padding': '0'}}>
                        {this.button()}
                    </div>
                </div>
            </div>
        );
    }
}
