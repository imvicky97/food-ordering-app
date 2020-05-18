import React, { Component } from 'react';
import './PaymentMode.css';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';


const CustomStyles = {
    margin: 10
};

class PaymentMode extends Component {
    constructor() {
        super();
        this.state = {
            paymentMethods: [
                {
                    id: "",
                    payment_name: ""
                }

            ],
            selectedPayment: ""
        }
    }

    UNSAFE_componentWillMount() {

        this.setState({ selectedPayment: this.props.selectedPayment })
        let that = this;
        let modesOfPayment = null;
        let xhrModesOfPayment = new XMLHttpRequest();
        xhrModesOfPayment.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                that.setState({
                    paymentMethods: JSON.parse(this.responseText).paymentMethods
                });
            }
        });
        xhrModesOfPayment.open("GET", this.props.Url + "/payment");
        xhrModesOfPayment.setRequestHeader("Cache-Control", "no-cache");
        xhrModesOfPayment.send(modesOfPayment);
    }


    handleChange = (event) => {
        this.setState({ selectedPayment: event.target.value });
        this.props.onChangePayment(event.target.value);
    };


    render() {
        return (
            <div>
                <div className="PaymentContainer">
                    <FormControl component="fieldset">
                        <FormLabel component="legend">Select Mode of Payment</FormLabel>
                        <RadioGroup style={CustomStyles} aria-label="gender" name="gender1" value={this.props.selectedPayment} onChange={this.handleChange}>
                            {this.state.paymentMethods.map(paymentMethod => (
                                <FormControlLabel key={paymentMethod.id} value={paymentMethod.id} control={<Radio />} label={paymentMethod.payment_name}></FormControlLabel>
                            ))}
                            
                        </RadioGroup>
                    </FormControl>

                </div>
            </div>
        )
    }
}


export default PaymentMode;