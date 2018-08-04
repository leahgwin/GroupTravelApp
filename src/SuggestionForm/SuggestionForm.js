import React, { Component } from "react";
import { Button, FormGroup, FormControl, ControlLabel, MenuItem, DropdownButton, ButtonToolbar } from "react-bootstrap";
import ApiManager from "../API/ApiManager";
import "./SuggestionForm.css";
import MyTripsCards from "../MyTripsPage/MyTripsCards";



export default class SuggestionForm extends Component {
    constructor(props) {
        super(props);
        //this is where I'm storing the input that the user inputs into the suggestion form
        this.state = {
            trip: "",
            name: "",
            cost: "",
            description: "",
            link: "",
            rank: 0,
            user: ApiManager.getIdofCurrentUser(),
            groups: [],
            title: "Select Group Trip"
        };
    }

    componentDidMount() {
        let dropdownGroupName;
        ApiManager.getAll("groups")
            .then((groups) => {
                console.log("groupS", groups);
                this.setState({ groups: groups })
                // console.log("group name", dropdownGroupName);
            })
    }


    //this is just making sure the field isn't empty. I can also add further requirements if I want to
    validateForm() {
        return this.state.name.length > 0 && this.state.cost.length > 0 && this.state.description.length > 0;
    }



    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
        console.log("event.target.id", event.target.id);
        console.log("value", event.target.value);
        console.log("event.target", event.target);
    };

    /* this is React's simple dropdown "handleChange" function from their forms documentation... still doesnt change state/ getting error */
    handleDropdown = (undefined, event) => {
        let key = event.target.getAttribute('val');
        console.log('event.target.title', event.target)
        this.setState({
            [event.target.getAttribute('val')]: event.target.getAttribute('value'),
            title: event.target.getAttribute('value')
        });
    }


    handleSubmit = event => {
        event.preventDefault();

        let signedInUser = JSON.parse(localStorage.getItem("credentials"));
        if (signedInUser === null) {
            signedInUser = JSON.parse(sessionStorage.getItem("credentials"));
            signedInUser = signedInUser.user;
        } else {
            signedInUser = signedInUser.user;
        }
        console.log("signed user", signedInUser);


        let newSuggestion = {
            name: this.state.name,
            cost: this.state.cost,
            description: this.state.description,
            link: this.state.link,
            tripId: this.state.tripId,
            userId: ApiManager.getIdofCurrentUser(),
            rank: 0

        }

        ApiManager.postItem("suggestions", newSuggestion)
            .then(() => {
                //redirects to "my trips" so they can see what they added
                this.props.history.push('/mytrips')
            })
    };




    render() {
        console.log("this.state.groups", this.state);



        return (
            <div className="suggestion">
                <form onSubmit={this.handleSubmit}>
                    <h2>Add a Suggestion for a Group Trip!</h2>
                    <FormGroup controlId="trip" bsSize="large"
                        value={this.state.trip}
                    >
                        <p>trip state: {this.state.trip}</p>
                        <ControlLabel>Select Which Trip You're Adding a Suggestion To:</ControlLabel>

                        <ButtonToolbar >
                            <DropdownButton title={this.state.title} id="dropdown-size-medium" onSelect={this.handleDropdown}>

                                {this.state.groups.map((group, i) => {
                                    return (<MenuItem key={i} val="trip" value={group.name}>
                                        {group.name}
                                    </MenuItem>)
                                })}
                            </DropdownButton>
                        </ButtonToolbar>
                    </FormGroup>
                    {/* this is React's simple dropdown from their forms documentation... still doesnt change state */}
                    {/* <label>
                        Select Which Trip You're Adding a Suggestion To:
          <select id="trip"
                            value={this.state.trip}
                            onChange={this.handleDropdown}> */}
                    {/* mapping through the state of groups and making each name a menu item */}
                    {/* {this.state.groups.map((group) => {
                                return (
                                    <option value={this.state.trip}>
                                        {group.name}
                                    </option>)
                            })}
                        </select>
                    </label> */}
                    <FormGroup controlId="name" bsSize="large">
                        <ControlLabel>Suggestion Name</ControlLabel>
                        <FormControl
                            //autofocus gives attn to the email input for the user to know where to type
                            autoFocus
                            type="text"
                            placeholder="(e.g., Visit the Eiffel Tower)"
                            //this sets the state each time when user inputs
                            value={this.state.name}
                            onChange={this.handleChange}
                        />
                    </FormGroup>
                    <FormGroup controlId="cost" bsSize="large">
                        <ControlLabel>Cost of Suggestion</ControlLabel>
                        <FormControl
                            value={this.state.cost}
                            onChange={this.handleChange}
                            placeholder="(e.g., $29.04)"
                            type="text"
                        />
                    </FormGroup>
                    <FormGroup controlId="description" bsSize="large">
                        <ControlLabel>Description</ControlLabel>
                        <FormControl
                            value={this.state.description}
                            onChange={this.handleChange}
                            placeholder="(e.g., 'It is THE eiffel tower. We MUST go!')"

                            type="text"
                        />
                    </FormGroup>
                    <FormGroup controlId="link" bsSize="large">
                        <ControlLabel>Link to Suggestion</ControlLabel>
                        <FormControl
                            value={this.state.link}
                            onChange={this.handleChange}
                            placeholder="(e.g., https://www.toureiffel.paris/)"
                            type="url"
                        />
                    </FormGroup>
                    <Button
                        block
                        bsSize="large"
                        disabled={!this.validateForm()}
                        type="submit"
                    >
                        Add New Suggestion
          </Button>
                </form>
            </div >
        );
    }
}
