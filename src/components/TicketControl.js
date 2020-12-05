import React from 'react';
import NewTicketForm from './NewTicketForm';
import TicketList from './TicketList';
import TicketDetail from './TicketDetail';
import EditTicketForm from './EditTicketForm';
import { connect } from 'react-redux';
import PropTypes from "prop-types";
import * as a from './../actions';
import { withFirestore } from 'react-redux-firebase'

class TicketControl extends React.Component {

  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      selectedTicket: null,
      editing: false
    };
  }

  // componentDidMount() {
  //   this.waitTimeUpdateTimer = setInterval(() =>
  //     this.updateTicketElapsedWaitTime(),
  //   60000
  //   );
  // }

  // We won't be using this method for our help queue update - but it's important to see how it works.
  // componentDidUpdate() {
  //   console.log("component updated!");
  // }

  // componentWillUnmount(){
  //   clearInterval(this.waitTimeUpdateTimer);
  // }

  // updateTicketElapsedWaitTime = () => {
  //   const { dispatch } = this.props;
  //   Object.values(this.props.masterTicketList).forEach(ticket => {
  //     const newFormattedWaitTime = ticket.timeOpen.fromNow(true);
  //     const action = a.updateTime(ticket.id, newFormattedWaitTime);
  //     dispatch(action);
  //   });
  // }

  handleClick = () => {
    if (this.state.selectedTicket != null) {
      this.setState({
        selectedTicket: null,
        editing: false
      });
    } else {
        const { dispatch } = this.props;
        const action = a.toggleForm();
        dispatch(action);
    }
  }

  // handleAddingNewTicketToList = (newTicket) => {
  //   const newMasterTicketList = this.state.masterTicketList.concat(newTicket);
  //   this.setState({
  //     masterTicketList: newMasterTicketList,
  //     formVisibleOnPage: false
  //   });
  // }

  handleAddingNewTicketToList = () => {
    const { dispatch } = this.props;
    const action = a.toggleForm();
    dispatch(action);
  }

  // handleChangingSelectedTicket = (id) => {
  //   const selectedTicket = this.state.masterTicketList.filter(ticket => ticket.id === id)[0];
  //   this.setState({selectedTicket: selectedTicket});
  // }

  handleChangingSelectedTicket = (id) => {
    this.props.firestore.get({collection: 'tickets', doc: id}).then((ticket) => {
      const firestoreTicket = {
        names: ticket.get("names"),
        location: ticket.get("location"),
        issue: ticket.get("issue"),
        id: ticket.id
      }
      this.setState({selectedTicket: firestoreTicket });
    });
  }
  
  // handleChangingSelectedTicket = (id) => {
  //   const selectedTicket = this.props.masterTicketList[id];
  //   this.setState({selectedTicket: selectedTicket});
  // }
  // handleDeletingTicket = (id) => {
  //   const newMasterTicketList = this.state.masterTicketList.filter(ticket => ticket.id !== id);
  //   this.setState({
  //     masterTicketList: newMasterTicketList,
  //     selectedTicket: null
  //   });
  // }

  handleDeletingTicket = (id) => {
    this.props.firestore.delete({collection: 'tickets', doc: id});
    this.setState({selectedTicket: null});
  }

  // handleDeletingTicket = (id) => {
  //   const { dispatch } = this.props;
  //   const action = a.deleteTicket(id);
  //   dispatch(action);
  //   this.setState({selectedTicket: null});
  // }

  handleEditClick = () => {
    this.setState({editing: true});
  }

  handleEditingTicketInList = () => {
    this.setState({
      editing: false,
      selectedTicket: null
    });
  }

  // handleEditingTicketInList = (ticketToEdit) => {
  //   const editedMasterTicketList = this.state.masterTicketList
  //     .filter(ticket => ticket.id !== this.state.selectedTicket.id)
  //     .concat(ticketToEdit);
  //   this.setState({
  //     masterTicketList: editedMasterTicketList,
  //     editing: false,
  //     selectedTicket: null
  //   });
  // }

  // handleEditingTicketInList = (ticketToEdit) => {
  //   const { dispatch } = this.props;
  //   const { id, names, location, issue } = ticketToEdit;
  //   const action = a.addTicket(ticketToEdit);
  //   dispatch(action);
  //   this.setState({
  //     editing: false,
  //     selectedTicket: null
  //   });
  // }

  render(){
    let currentlyVisibleState = null;
    let buttonText = null;
    if (this.state.editing ) {      
      currentlyVisibleState = <EditTicketForm ticket = {this.state.selectedTicket} onEditTicket = {this.handleEditingTicketInList} />
      buttonText = "Return to Ticket List";
    } else if (this.state.selectedTicket != null) {
      currentlyVisibleState = 
      <TicketDetail 
        ticket = {this.state.selectedTicket} 
        onClickingDelete = {this.handleDeletingTicket} 
        onClickingEdit = {this.handleEditClick} />
      buttonText = "Return to Ticket List";
    } else if (this.props.formVisibleOnPage) {
      currentlyVisibleState = <NewTicketForm onNewTicketCreation={this.handleAddingNewTicketToList}  />;
      buttonText = "Return to Ticket List";
    } else {
      currentlyVisibleState = <TicketList ticketList={this.props.masterTicketList} onTicketSelection={this.handleChangingSelectedTicket} />;
      buttonText = "Add Ticket";
    }
    return (
      <React.Fragment>
        {currentlyVisibleState}
        <button onClick={this.handleClick}>{buttonText}</button>
      </React.Fragment>
    );
  }
}

TicketControl.propTypes = {
  masterTicketList: PropTypes.object,
  formVisibleOnPage: PropTypes.bool
};

const mapStateToProps = state => {
  return {
    masterTicketList: state.masterTicketList,
    formVisibleOnPage: state.formVisibleOnPage
  }
}

TicketControl = connect(mapStateToProps)(TicketControl);

// export default TicketControl;
export default withFirestore(TicketControl);