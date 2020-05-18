import React, { Component } from 'react';
import { faCartArrowDown } from '@fortawesome/fontawesome-free-solid';
import Card from '@material-ui/core/Card';
import Avatar from '@material-ui/core/Avatar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import IconButton from '@material-ui/core/IconButton';
import { withStyles, CardContent } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import CardHeader from '@material-ui/core/CardHeader';
import Badge from '@material-ui/core/Badge';
import Button from '@material-ui/core/Button';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';

const styles = (theme => ({

    textRatingCost: { //Style for the Text of the Rating and cost.
        'text-overflow': 'clip',
        'width': '145px',
        'color': 'grey'
    },
    restaurantName: { //Style for the Restaurant name.
        'padding': '8px 0px 8px 0px',
        'font-size': '30px',
    },
    restaurantCategory: { //Style for the Restaurant Category.
        'padding': '8px 0px 8px 0px'
    },
    avgCost: { //Style for the Average cost.
        'padding-left': '5px'
    },
    itemPrice: { //Style for the Item prices.
        'padding-left': '5px'
    },
    addButton: { //Style for the add Button.
        'margin-left': '25px',
    },
    menuItemName: { //Style for the Item menu name.
        'margin-left': '20px',
    },

    shoppingCart: { //Style for the Shopping cart.
        color: 'black',
        'background-color': 'white',
        width: '60px',
        height: '50px',
        'margin-left': '-20px',
    },
    cartHeader: { //Style for the Cart Header containing the icon and title.
        'padding-bottom': '0px',
        'margin-left': '10px',
        'margin-right': '10px'
    },
    cartItemButton: { //Style for the button in the cart.
        padding: '10px',
        'border-radius': '0',
        color: '#fdd835',
        '&:hover': {
            'background-color': '#ffee58',
        }
    },
    cardContent: { //Style for the content for card.
        'padding-top': '0px',
        'margin-left': '10px',
        'margin-right': '10px'
    },
    totalAmount: { //Style for the the total amount.
        'font-weight': 'bold'
    },
    checkOutButton: { //Style for the Checkout button in the cart card. 
        'font-weight': '400'
    }




}))
class CartItems extends Component {

    constructor(props) {
        super(props);
        this.state = {
            snackBarOpen: false,
            snackBarMessage: "",
            cartItems: [],
            totalAmount: this.props.totalAmount,


        }
    }

    UNSAFE_componentWillMount() {
        let cartItems = this.props.cartItems;
        let totalAmount = this.props.totalAmount;

        this.setState({
            ...this.state,
            cartItems: cartItems,
            totalAmount: totalAmount
        });
    }

    //This Method is called when the minus button in the cart is clicked.
    //It take item as the parameter 
    //This method updates the quantity of the item and reduces by 1 for each click.
    //If the item is reduced to zero the the item is removed from the cart.
    //After each update a relevant snackbar message is shown.
    minusButtonClickHandler = (item) => {
        let cartItems = this.props.cartItems;
        let index = cartItems.indexOf(item);
        let itemRemoved = false;
        cartItems[index].quantity--; //Reducing the quantity of the item
        if (cartItems[index].quantity === 0) { //Checking if the quantity is zero to remove from the cart
            cartItems.splice(index, 1);
            itemRemoved = true;
        } else {
            cartItems[index].totalAmount = cartItems[index].price * cartItems[index].quantity; //Updating the Price of the item
        }

        // updating the total amount of the cart
        let totalAmount = 0;
        cartItems.forEach(cartItem => {
            totalAmount = totalAmount + cartItem.totalAmount;
        })
        this.props.updateTotal(totalAmount);
        //Updating the state
        this.setState({
            ...this.state,
            cartItems: cartItems,
            snackBarOpen: true,
            snackBarMessage: itemRemoved ? "Item removed from cart!" : "Item quantity decreased by 1!",
            totalAmount: totalAmount,

        })
    }

    //This method is called when the add button in the cart is clicked.
    //This method takes item as the parameter.
    //This method finds the corresponding item and updates it quantity by 1 for each click.
    //After each update a relevant snackbar message is shown.
    cartAddButtonClickHandler = (item) => {
        let cartItems = this.props.cartItems;
        let index = cartItems.indexOf(item);
        cartItems[index].quantity++; //Updating the quantity ofthe relevant item in the cart
        cartItems[index].totalAmount = cartItems[index].price * cartItems[index].quantity; //updating the total price of the item

        //Updating the Total amount ofthe cart 
        let totalAmount = 0;
        cartItems.forEach(cartItem => {
            totalAmount = totalAmount + cartItem.totalAmount;
        })
        this.props.updateTotal(totalAmount);
        //Updating the state
        this.setState({
            ...this.state,
            cartItems: cartItems,
            snackBarOpen: true,
            snackBarMessage: "Item quantity increased by 1!",
            totalAmount: totalAmount,

        })

    }

    
    render() {
        return (
            <div>
                {this.props.cartItems.map(cartItem => ( //Iterating over each item in cartItem to show in the cart.
                    <div className="cart-menu-item-container" key={cartItem.id}>
                        <i className="fa fa-stop-circle-o" aria-hidden="true" style={{ color: cartItem.itemType === "NON_VEG" ? "#BE4A47" : "#5A9A5B" }}></i>
                        <Typography variant="subtitle1" component="p" className={this.props.classes.menuItemName} id="cart-menu-item-name" >{cartItem.name[0].toUpperCase() + cartItem.name.slice(1)}</Typography>
                        <div className="quantity-container">
                            {this.props.showPlusMinusButton &&
                                <IconButton className={this.props.classes.cartItemButton} id="minus-button" aria-label="remove" onClick={() => this.minusButtonClickHandler(cartItem)} >
                                    <FontAwesomeIcon icon="minus" size="xs" color="black" />
                                </IconButton>
                            }
                            <Typography variant="subtitle1" component="p" className={this.props.classes.itemQuantity}>{cartItem.quantity}</Typography>
                            {this.props.showPlusMinusButton &&
                            <IconButton className={this.props.classes.cartItemButton} aria-label="add" onClick={() => this.cartAddButtonClickHandler(cartItem)}>
                                <FontAwesomeIcon icon="plus" size="xs" color="black" />
                            </IconButton>
                            }
                        </div>
                        <div className="item-price">
                            <i className="fa fa-inr" aria-hidden="true" style={{ color: 'grey' }}></i>
                            <Typography variant="subtitle1" component="p" className={this.props.classes.itemPrice} id="cart-item-price">{cartItem.totalAmount.toFixed(2)}</Typography>
                        </div>
                    </div>
                ))}
            </div>
        );
    }
}

export default withStyles(styles)(CartItems);;