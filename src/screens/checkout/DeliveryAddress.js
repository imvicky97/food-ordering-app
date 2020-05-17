import React, { Component } from 'react';
import './DeliveryAddress.css'
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import FormHelperText from '@material-ui/core/FormHelperText';
import MenuItem from '@material-ui/core/MenuItem';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

const IconStyle = {
    float: 'right'
};

const CustomStyles = {
    padding: 24,
    height: 244,
    cursor: 'pointer'
};

const styles = theme => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper
    },

    gridListSavedAddress: {
        flexWrap: 'nowrap',
        transform: 'translateZ(0)',
        width: '100%'
    },
    gridListMain: {

        transform: 'translateZ(0)',
        cursor: 'pointer'
    },
    green: {
        color: "green"
    },
    addreesBorder:
    {
        border: "1px Solid #DC143C",
    }
});

const UseStyles = {

    minWidth: 250
};

const TabContainer = function (props) {
    return (
        <Typography component="div" style={{ padding: 0, margin: 20 }}>
            {props.children}
        </Typography>
    );
}

TabContainer.propTypes = {
    children: PropTypes.node.isRequired
}

class DeliveryAddress extends Component {

    constructor(props) {
        super(props);
        this.state = {
            value: 0,
            FlatNameRequired: "dispNone",
            flatnumber: "",
            LocalityRequired: "dispNone",
            locality: "",
            CityRequired: "dispNone",
            city: "",
            StateRequired: "dispNone",
            selectstate: "",
            PincodeRequired: "dispNone",
            pincode: "",
            states: [
                {
                    id: "",
                    state_name: ""
                }
            ],
            saveAddressSuccess: false,
            addresses: [
                {
                    city: "",
                    flat_building_name: "",
                    id: "",
                    locality: "",
                    pincode: "",
                    state: {
                        id: "",
                        state_name: ""
                    }
                }
            ],
            selectedAddress: {
                city: "",
                flat_building_name: "",
                id: "",
                locality: "",
                pincode: "",
                state: {
                    id: "",
                    state_name: ""
                }
            },
            pincodeMessage: "required",
            addressMessage: "There are no saved addresses! You can save an address using the 'New Address' tab or using your 'Profile' menu option."
        };

    }

    UNSAFE_componentWillMount() {
        let that = this;
        this.setState({ selectedAddress: this.props.selectedAddress })
        let ShowAdderss = null;
        let xhrgetAddress = new XMLHttpRequest();
        xhrgetAddress.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                that.setState({
                    addresses: JSON.parse(this.responseText).addresses

                });
            }
        });
        xhrgetAddress.open("GET", this.props.Url + "/address/customer");
        xhrgetAddress.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem('access-token'));
        xhrgetAddress.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        xhrgetAddress.setRequestHeader("Cache-Control", "no-cache");
        xhrgetAddress.send(ShowAdderss);
    }

    iconClickHandler = (address) => {
        this.setState({ selectedAddress: address })
        this.props.onChangeAddress(address);
    }

    tabChangeHandler = (event, value) => {


        this.setState({ value });
        if (value === 1) {
            let that = this;
            let state = null;
            let xhrUser = new XMLHttpRequest();
            xhrUser.addEventListener("readystatechange", function () {
                if (this.readyState === 4) {
    
                    that.setState({
                        states: JSON.parse(this.responseText).states
    
                    });
    
                }
            });    
            xhrUser.open("GET", this.props.Url + "/states");
            xhrUser.setRequestHeader("Cache-Control", "no-cache");
            xhrUser.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
            xhrUser.send(state);

            this.props.onChangeAddress("");
        }
        if (value === 0) {
            let that = this;
            let ShowAdderss = null;
            let xhrgetAddress = new XMLHttpRequest();
            xhrgetAddress.addEventListener("readystatechange", function () {
                if (this.readyState === 4) {
                    that.setState({
                        addresses: JSON.parse(this.responseText).addresses

                    });
                }
            });
            xhrgetAddress.open("GET", this.props.Url + "/address/customer");
            xhrgetAddress.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem('access-token'));
            xhrgetAddress.setRequestHeader("Cache-Control", "no-cache");
            xhrgetAddress.send(ShowAdderss);
            this.props.onChangeAddress(this.state.selectedAddress);           
        }

    }

    saveAddressClcikHandler = () => {
        this.state.flatnumber === "" ? this.setState({ FlatNameRequired: "dispBlock" }) : this.setState({ FlatNameRequired: "dispNone" });
        this.state.locality === "" ? this.setState({ LocalityRequired: "dispBlock" }) : this.setState({ LocalityRequired: "dispNone" });
        this.state.city === "" ? this.setState({ CityRequired: "dispBlock" }) : this.setState({ CityRequired: "dispNone" });
        this.state.selectstate === "" ? this.setState({ StateRequired: "dispBlock" }) : this.setState({ StateRequired: "dispNone" });
        this.state.pincode === "" ? this.setState({ PincodeRequired: "dispBlock" }) : this.setState({ PincodeRequired: "dispNone" });
        //console.log(this.state.pincode.length);
        if (this.state.pincode === "") {
            this.setState({ pincodeMessage: "required" });
        }
        const re = /^[0-9\b]+$/;
        if (this.state.pincode !== "" && (this.state.pincode.length !== 6 || !re.test(this.state.pincode))) {

            this.setState({ pincodeMessage: "Pincode must contain only numbers and must be 6 digits long" });

            this.setState({ PincodeRequired: "dispBlock" });
        }


        let saveData = JSON.stringify({
            "city": this.state.city,
            "flat_building_name": this.state.flatnumber,
            "locality": this.state.locality,
            "pincode": this.state.pincode,
            "state_uuid": this.state.selectstate
        });

        let xhrSaveAddress = new XMLHttpRequest();
        let that = this;
        xhrSaveAddress.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                that.setState({
                    saveAddressSuccess: true
                });
                that.setState({ flatnumber: "" });
                that.setState({ locality: "" });
                that.setState({ city: "" });
                that.setState({ selectstate: "" });
                that.setState({ pincode: "" });
            }

        });

        xhrSaveAddress.open("POST", this.props.Url + "/address");
        xhrSaveAddress.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem('access-token')); //Accept-Encoding        
        xhrSaveAddress.setRequestHeader("Accept-Encoding", "application/json;charset=UTF-8");
        xhrSaveAddress.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhrSaveAddress.setRequestHeader("Cache-Control", "no-cache");
        xhrSaveAddress.send(saveData);


    }


    inputFlaNumberChangeHandler = (e) => {
        this.setState({ flatnumber: e.target.value });
    }

    inputLocalityChangeHandler = (e) => {
        this.setState({ locality: e.target.value })
    }

    inputSelectStateHandler = (e) => {

        this.setState({ selectstate: e.target.value })
    }

    inputCityChangeHandler = (e) => {
        this.setState({ city: e.target.value })
    }

    inputPincodeChangeHandler = (e) => {
        this.setState({ pincode: e.target.value })
    }


    render() {
        const { classes } = this.props;
        // console.log(this.state.addresses!== null)
        return (
            <div className="TabContainer">
                <AppBar position="static">
                    <Tabs aria-label="simple tabs example" value={this.state.value} onChange={this.tabChangeHandler}>
                        {/* value={value} onChange={handleChange} */}
                        <Tab label="Existing Address" />
                        {/* {...a11yProps(0)} */}
                        <Tab label="New Address" />
                        {/* {...a11yProps(1)} */}
                    </Tabs>
                </AppBar>



                {this.state.value === 0 && this.state.addresses !== null &&

                    <GridList cols={3} className={classes.gridListSavedAddress}>

                        {this.state.addresses.map(address => (

                            <GridListTile style={CustomStyles} onClick={() => this.iconClickHandler(address)} className={this.state.selectedAddress.id === address.id ? classes.addreesBorder + " AddressBorder " + " AddressContainer" : " AddressContainer"} key={"address" + address.id} cols={1}>
                                <Typography>
                                    {address.flat_building_name}<br />
                                    {address.locality}<br />
                                    {address.city}<br />
                                    {address.state.state_name}<br />
                                    {address.pincode}<br />
                                    <IconButton style={IconStyle} aria-label="SelectIcon">
                                        <CheckCircleIcon className={this.state.selectedAddress.id === address.id ? classes.green : ""} />
                                    </IconButton>
                                </Typography>

                            </GridListTile>


                        ))}

                    </GridList>

                }
                {this.state.value === 0 && this.state.addresses === null &&
                    <Typography>{this.state.addressMessage}</Typography>
                }

                {this.state.value === 1 &&
                    <TabContainer>
                        <FormControl required>
                            <InputLabel htmlFor="FlatNumber">Flat / Building No.</InputLabel>
                            <Input className="InputContainer" id="flatnumber" type="text" value={this.state.flatnumber} onChange={this.inputFlaNumberChangeHandler} />
                            <FormHelperText className={this.state.FlatNameRequired}>
                                <span className="red">required</span>
                            </FormHelperText>
                        </FormControl><br /><br />

                        <FormControl required>
                            <InputLabel htmlFor="Locality">Locality</InputLabel>
                            <Input className="InputContainer" id="locality" type="text" value={this.state.locality} onChange={this.inputLocalityChangeHandler} />
                            <FormHelperText className={this.state.LocalityRequired}>
                                <span className="red">required</span>
                            </FormHelperText>
                        </FormControl><br /><br />

                        <FormControl required>
                            <InputLabel htmlFor="City">City</InputLabel>
                            <Input className="InputContainer" id="city" type="text" value={this.state.city} onChange={this.inputCityChangeHandler} />
                            <FormHelperText className={this.state.CityRequired}>
                                <span className="red">required</span>
                            </FormHelperText>
                        </FormControl><br /><br />

                        <FormControl required>
                            <InputLabel htmlFor="State">State</InputLabel>
                            <Select style={UseStyles} value={this.state.selectstate} className="StateConatiner" onChange={this.inputSelectStateHandler}>
                                {this.state.states.map(_state => (
                                    <MenuItem key={_state.id} value={_state.id}>{_state.state_name}</MenuItem>
                                ))}
                            </Select>

                            <FormHelperText className={this.state.StateRequired} >
                                <span className="red">required</span>
                            </FormHelperText>
                        </FormControl><br /><br />


                        <FormControl required>
                            <InputLabel htmlFor="Pincode">Pincode</InputLabel>
                            <Input className="InputContainer" id="pinCode" type="text" value={this.state.pincode} onChange={this.inputPincodeChangeHandler} />
                            <FormHelperText className={this.state.PincodeRequired}>
                                <span className="red">{this.state.pincodeMessage}</span>
                            </FormHelperText>
                        </FormControl><br /><br /><br />

                        <Button variant="contained" color="secondary" onClick={this.saveAddressClcikHandler}>
                            Save Address
                    </Button><br /><br /><br />
                    </TabContainer>}

            </div>

        )
    }

}

export default withStyles(styles)(DeliveryAddress);

