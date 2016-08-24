import React from 'react'

export class FridgeItems extends React.Component {

    //@ Override
    constructor(props){
        super(props);
        this.state = {
            data: []
        };
    }


    //@ Override
    componentDidMount() {
        $.ajax(
            {
                url: this.props.url,
                dataType: 'json',
                async: true,
                cache: false,
                action: "POST",
                data: {
                    action: 'get-fridge-items'
                },
                success: function(result) {
                    if(result.error){
                        console.log(result.message);
                    } else {
                        this.setState({data: result.data});
                    }
                }.bind(this),
                error: function(xhr, status, err) {
                    console.log(this.props.url, status, err.toString());
                }.bind(this)
            }
        );
    }

    //@ Override
    render() {
        let items = this.state.data.map(function(e, i){
            return <FridgeItem key={"fid_" + i} name={e.name} date={e.date} elapsed={e.elapsed} />;
        });

        return (
            <div className="fridgeItems">
            {items}
            </div>
        )
    }
}

export class FridgeItem extends React.Component {

    //@ Override
    constructor(props){
        super(props);
        this.bought = this.bought.bind(this);
    }

    bought () {
        console.log("This item is bought!");
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
                        <a className="waves-effect waves-light btn-floating btn-large green" onClick={this.bought}>
                            <i className="material-icons">shopping_cart</i>
                        </a>
                    </div>
                </div>
            </div>
        );
    }
}
