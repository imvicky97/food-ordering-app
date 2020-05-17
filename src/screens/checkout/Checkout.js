import React, { Component } from 'react';
import './Checkout.css';
import Header from '../../common/header/Header';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

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

function getStepContent(step, url, address, payment, existingAddressNext, newAddressNext, changePayment, changeAddress, PaymentButton) {
    console.log("checkout " + payment)

    switch (step) {
        case 0:
            return(<div></div>)
            
        case 1:
            return(<div></div>)
            

        default:
            return 'Unknown step';
    }
}

function CheckOutStepper(props) {
    const classes = useStyles;
    const [activeStep, setActiveStep] = React.useState(0);
    const steps = getSteps();
    const [NextButtonEnabled, setNextButtonEnabled] = React.useState(0);
    const [selectedAddress, setSelectedAddress] = React.useState("");
    const [selectedPayment, setSelectedPayment] = React.useState("");
    const [FinishButtonEnabled, setFinishButtonEnabled] = React.useState(0);



    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    const FinishBtnEnabled = () => {
        console.log("finsih button " + FinishButtonEnabled);
        if (FinishButtonEnabled === 0) {
            setFinishButtonEnabled(1);
        }
        console.log("finsih button after  " + FinishButtonEnabled);
    };

    const ButtonEnabled = () => {
        console.log("Button enabled " + NextButtonEnabled);
        if (NextButtonEnabled === 0) {
            setNextButtonEnabled(1);
        }

    };

    const ButtonDisbledForSaveAddress = () => {
        console.log("Button disabled " + NextButtonEnabled);
        if (NextButtonEnabled === 1) {
            setNextButtonEnabled(0);
        }
    };

    const SelectedDeliveryAddress = (address) => {

        setSelectedAddress(address);
    };

    const SelectedDeliveryPayment = (payment) => {
        setSelectedPayment(payment);
    };


    return (
        <div className={classes.root}>
            <Stepper activeStep={activeStep} orientation="vertical">
                {steps.map((label, index) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                        <StepContent>
                            {getStepContent(index, props.Url, selectedAddress, selectedPayment, ButtonEnabled, ButtonDisbledForSaveAddress, SelectedDeliveryPayment, SelectedDeliveryAddress, FinishBtnEnabled)}
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
                {activeStep === steps.length && (
                <Paper square elevation={0} className={classes.resetContainer}>
                    <Typography>View the summary and place your order now!</Typography>
                    <Button onClick={handleReset} className={classes.button}>
                        CHANGE
            </Button>
                </Paper>
            )}
            </Stepper>
            
        </div>
    )

}
class Checkout extends Component {

    steps = getSteps();

    constructor() {
        super();
        this.state = {
            accessToken: sessionStorage.getItem('access-token'),

        };

    }


   

    render() {
        return (
            <div>
                <div>
                    <Header history={this.props.history}
                        showSearchArea={false} />
                    
                </div>
                <div className="CheckOutBoxContainer">
                    <div className="stepperContainer">
                        <CheckOutStepper Url={this.props.baseUrl}></CheckOutStepper>
                    </div>
                   
                </div>
            </div>
        )
    }

}

export default Checkout;