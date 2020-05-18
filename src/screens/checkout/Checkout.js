import React, { Component } from 'react';
import './Checkout.css';
import DeliveryAddress from './DeliveryAddress';
import PaymentMode from './PaymentMode';
import Header from '../../common/header/Header';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Summary from './Summary';


const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    button: {
        marginTop: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
    actionsContainer: {
        marginBottom: theme.spacing(2),
    },
    resetContainer: {
        padding: theme.spacing(3),
    },
}));

function getSteps() {
    return ['Delivery', 'Payment'];
}

function getStepContent(step, props, address, payment, changePayment, changeAddress) {
    switch (step) {
        case 0:
            return (<DeliveryAddress {...props} onChangeAddress={changeAddress} selectedAddress={address}></DeliveryAddress>);

        case 1:
            return (<PaymentMode {...props} onChangePayment={changePayment} selectedPayment={payment}></PaymentMode>);

        default:
            return 'Unknown step';
    }
}

function CheckOutStepper(props) {
    const classes = useStyles;
    const [activeStep, setActiveStep] = React.useState(0);
    const steps = getSteps();
    const [selectedAddress, setSelectedAddress] = React.useState("");
    const [selectedPayment, setSelectedPayment] = React.useState("");


    const handleNext = () => {
        if (selectedAddress !== "" && activeStep === 0) {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }
        if (selectedPayment !== "" && activeStep === 1) {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
            props.setPayment(selectedPayment);
        }
    }

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    const selectedDeliveryAddress = (address) => {

        setSelectedAddress(address);
        props.setAddress(address);    };

    const selectedDeliveryPayment = (payment) => {
        setSelectedPayment(payment);
        // console.log(activeStep)
        // if(activeStep===2){
        // props.setPayment(payment);
        // }
    };

    return (

        <div className={classes.root}>
            <Stepper activeStep={activeStep} orientation="vertical">
                {steps.map((label, index) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                        <StepContent>
                            {getStepContent(index, props, selectedAddress, selectedPayment, selectedDeliveryPayment, selectedDeliveryAddress)}
                            <div className={classes.actionsContainer}>
                                <div>
                                    <Button
                                        disabled={activeStep === 0}
                                        onClick={handleBack}
                                        className={classes.button}
                                    >
                                        Back
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleNext}
                                        className={classes.button}

                                    >
                                        {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                                    </Button>
                                </div>
                            </div>
                        </StepContent>
                    </Step>
                ))}

            </Stepper>
            {activeStep === steps.length && (

                <Paper elevation={0} className={classes.resetContainer} last={activeStep.toString()}>
                    <Typography>View the summary and place your order now!</Typography>
                    <Button onClick={handleReset} className={classes.button}>
                        CHANGE
                    </Button>
                </Paper>
            )}

        </div>
    )

}
class Checkout extends Component {
    steps = getSteps();
    constructor(props) {
        super(props);
        this.state = {
            accessToken: sessionStorage.getItem('access-token'),
            cartItems: [],
            restaurantDetails: [],
            addressId:"",
            paymentId:""
        };
    }

    UNSAFE_componentWillMount() {
        if (sessionStorage.getItem('access-token') === "" || this.props.location.cartItems === undefined) {
            this.props.history.push('/');
        }
    }
    setPaymentId=(payment)=>{
        this.setState({paymentId:payment})
    }
    setAddressId=(address)=>{
        this.setState({addressId:address.id})
    }


    render() {
        console.log(this.props.location.cartItems);
        return (
            <div>
                <div>
                    <Header history={this.props.history}
                        showSearchArea={false} />
                </div>
                {this.props.location.cartItems !== undefined &&
                    <div className="CheckOutBoxContainer">
                        <div className="stepperContainer">
                            <CheckOutStepper {...this.props} Url={this.props.baseUrl} setPayment={this.setPaymentId} setAddress={this.setAddressId}></CheckOutStepper>
                        </div>
                        <div className="cardContainer">
                            <Summary {...this.props}  cartItems={this.props.location.cartItems} restaurantDetails={this.props.location.restaurantDetails} paymentId={this.state.paymentId} addressId={this.state.addressId} />
                        </div>
                    </div>


                }
                
            </div>
        )
    }

}

export default Checkout;