import React, { Component } from 'react';
import './Summary.css';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import CartItems from '../details/CartItems';
import Divider from '@material-ui/core/Divider';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Fade from '@material-ui/core/Fade';


class Summary extends Component {
    constructor(props) {
        super(props)
        this.state = {
            totalAmount: 0,
            transition: Fade,
            placeOrderSuccess: false,
            item_quantities: [
            ],
            snackBarMessage: ""
        }

    }

    UNSAFE_componentWillMount() {
        // console.log(this.props.cartItems)
        if (sessionStorage.getItem('access-token') === "" || this.props.cartItems === undefined || this.props.restaurantDetails === undefined) {
            this.props.history.push('/');
        } else {

            let cartItems = this.props.cartItems;
            let totalAmount = 0;
            console.log(this.props)

            cartItems.forEach(cartItem => {
                totalAmount = totalAmount + cartItem.totalAmount;
            })
            this.setState({
                ...this.state,
                totalAmount: totalAmount

            })
            console.log(this.state.totalAmount)
        }
    }


    placeOrderClickHandler = () => {
        this.setState({ snackBarOpen: true })



        let cartItems = this.props.cartItems;
        let itemquantities = this.state.item_quantities;
        cartItems.forEach(cartItem => { //running a loop to find if the item is already present in the cart.
            let item = {
                item_id: cartItem.id,
                price: cartItem.price,
                quantity: cartItem.quantity
            }
            itemquantities.push(item);
        })
        this.setState({ item_quantities: itemquantities });


        let OrderPlaced = JSON.stringify({
            "address_id": this.props.addressId,
            "bill": this.state.totalAmount,
            "coupon_id": null,
            "discount": 0,
            "item_quantities": this.state.item_quantities,
            "payment_id": this.props.paymentId,
            "restaurant_id": this.props.restaurantDetails.id

        })


        let xhrPlaceOrder = new XMLHttpRequest();
        let that = this;
        xhrPlaceOrder.addEventListener("readystatechange", function () {
            if (this.readyState === 4 && this.status === 201) {
                that.setState({
                    snackBarMessage: "Order placed successfully! Your order ID is " + JSON.parse(this.responseText).id
                });

            }
            else {
                that.setState({
                    snackBarMessage: "Unable to place your order! Please try again!"
                });
            }
        });
        xhrPlaceOrder.open("POST", this.props.baseUrl + "/order");
        xhrPlaceOrder.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem('access-token'));
        xhrPlaceOrder.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhrPlaceOrder.setRequestHeader("Cache-Control", "no-cache");
        xhrPlaceOrder.send(OrderPlaced)


    }

    snackBarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({
            ...this.state,
            snackBarMessage: "",
            snackBarOpen: false,
        })
    }

    render() {
        console.log(this.props);
        return (
            <div>
                {this.props.restaurantDetails !== undefined &&
                    <Card className="SummaryCardContainer">
                        <CardContent>

                            <Typography variant="h4" gutterBottom>Summary</Typography>

                            <div>

                                <Typography variant="h5" gutterBottom>{this.props.restaurantDetails.name}</Typography>

                            </div><br />
                            <div>
                                {this.props.cartItems !== undefined &&
                                    <CartItems cartItems={this.props.cartItems} showPlusMinusButton={false} ></CartItems>
                                }
                            </div>
                            <Divider variant="middle" /><br />
                            <div className="NetAmountConatiner">
                                <div>
                                    NetAmount
                           </div>
                                <div>
                                    {this.state.totalAmount}
                                </div>
                            </div><br />
                            <div>
                                <Button fullWidth={true} variant="contained" color="primary" onClick={this.placeOrderClickHandler}>
                                    PLACE ORDER
                            </Button>
                            </div>


                        </CardContent>

                    </Card>
                }
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={this.state.snackBarOpen}
                    autoHideDuration={4000}
                    onClose={this.snackBarClose}
                    TransitionComponent={this.state.transition}
                    ContentProps={{
                        'aria-describedby': 'message-id',
                    }}
                    message={this.state.snackBarMessage}
                    action={
                        <IconButton color='inherit' onClick={this.snackBarClose}>
                            <CloseIcon />
                        </IconButton>
                    }
                />
            </div>
        )
    }
}


export default Summary;