import React from 'react'

export class FridgeItems extends React.Component {

    //@ Override
    constructor(props){
        super(props);
        this.state = {
            data: []
        };
    }

    queueItem(hid){
        this.props.update({
            action: 'add-item-to-buy-queue',
            data: {
                hid: hid
            }
        });
    }


    unqueueItem(id){
        this.props.update({
            action: 'remove-item-from-buy-queue',
            data: {
                hid: hid
            }
        });
    }

    buyQueuedItems(){
        this.props.update({
            action: 'buy-all-queued-items',
            data: {}
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
                elapsed={e.elapsed}
                queueItem={this.queueItem.bind(this)}
                unqueueItem={this.unqueueItem.bind(this)}
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

    //@ Override
    render () {
        return (
            <div className="fridge-item card blue lighten-1">
                <div className="card-content">
                    <div className="card-title center white-text">
                        {this.props.name}
                    </div>
                    <div className="f-chip chip white blue-text lighten-1">
                        <span className="tiny f-icon blue white-text lighten-1">
                            <i className="ion-calendar tiny white-text lighten-1"></i>
                        </span>
                        {this.props.date}
                    </div>
                    <div className="f-chip chip white blue-text lighten-1">
                        <span className="tiny f-icon blue white-text lighten-1">
                            <i className="ion-clock tiny white-text lighten-1"></i>
                        </span>
                        {this.props.elapsed}
                    </div>
                    <div className="card-action center">
                        <a className="waves-effect waves-light btn-floating btn-large green"
                            onClick={(()=>{this.props.queueItem(this.props.hid)}).bind(this)}>
                            <i className="material-icons">shopping_cart</i>
                        </a>
                    </div>
                </div>
            </div>
        );
    }
}
