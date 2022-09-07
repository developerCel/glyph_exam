import React, { Component } from "react";
import '../styles/events.css';
import Modal from 'react-modal';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TimePicker from 'react-time-picker';
import axios from 'axios';

class EventList extends Component{

    state={
        selected_event:{},
        event_details_modal_flg: false,
        alert_msg: "",
        user_list: [],
        events: [],
        createEventModal_flg: false,
        userListModal_flg: false,
        selected_date: new Date(Date.now()),
        selected_start: new Date(Date.now()).getHours()+':'+new Date(Date.now()).getMinutes(),
        selected_end:  new Date(Date.now()).getHours()+':'+new Date(Date.now()).getMinutes(),
        tagged_user: [],
    }

    render(){
        this.loadData();
        return(
            <div className="m-5">
                <div className="d-flex add-div">
                    <button className="btn btn-primary" onClick={this.ToggleCreateEventModal.bind(this)}>+ Add Event</button>
                </div>
                <table className="table">
                    <thead key={"thead"} className="thead-dark">
                        <tr>
                            <th key={'th1'}><center>id</center></th>
                            <th key={'th2'}><center>Event</center></th>
                            <th key={'th3'}><center>Date & Time</center></th>
                        </tr>
                    </thead>
                    <tbody key={"tbody"}>
                        {this.state.events.map(event => 
                            <tr onClick={this.showEventDetails.bind(this, event)}
                                className="selectable-tr" 
                                key={event.name+"_tr"}>
                                
                                <td key={event.id}> 
                                    <center>
                                        {event.id} 
                                    </center>
                                </td>
                                <td key={event.name}> 
                                    <center>
                                        {event.name} 
                                    </center>
                                </td>
                                <td key={event.start_datetime}> 
                                    <center>
                                        {event.start_datetime} 
                                    </center>
                                </td>
                            </tr>
                        )}    
                    </tbody>
                </table>
                
                <Modal
                    className={"modal-add-event shadow-lg"}
                    isOpen={this.state.createEventModal_flg}
                    // onAfterOpen={afterOpenModal}
                    contentLabel="Example Modal"
                    ariaHideApp={false} 
                >
                    <div className="p-3">
                        <label >Add Event</label>
                        <br></br>
                        {
                            this.showAlert()
                        }
                        <label >Event Name:</label>
                        <input type="input" className="form-control" id="new_event_name" placeholder="Enter Name"/>
                        <label >Event Date:</label>
                        <DatePicker selected={this.state.selected_date} onSelect={(date)=>{this.setState({selected_date: date});}} className="form-control"/>
                        <div className="d-flex">
                            <div>
                                <label >Start Time:</label>
                                <br />
                                <TimePicker 
                                    disableClock={true}
                                    className="form-control" 
                                    onChange={(start)=>{
                                        this.setState({
                                            selected_start: start,
                                        });
                                    }} 
                                    value={this.state.selected_start} />
                            </div>
                            <div>
                                <label >End Time:</label>
                                <br />
                                <TimePicker 
                                    disableClock={true}
                                    className="form-control" 
                                    onChange={(end)=>{
                                        this.setState({
                                            selected_end: end
                                        });
                                    }} 
                                    value={this.state.selected_end} />
                            </div>
                        </div>
                        <label>Tagged Users: </label>
                        <div className="tag_div">
                            {this.state.tagged_user.map(user => 
                                <div key={user.id+"_div"} className="tag-user">
                                    {user.name}
                                    <button key={user.id+"_button"} onClick={this.removeTagUser.bind(this,user)} className="tag-user-btn">X</button>
                                </div>
                            )}
                            
                            <button 
                            key={"add_tag_div"} 
                            className="add-tag-btn"
                            onClick={this.toggleUserListModal.bind(this)}>
                                    <span>+ tag user </span>
                            </button>
                        </div>
                        <div className="btn-container">
                            <button 
                                className={"btn btn-primary"} 
                                onClick={this.submitCreateEvent.bind(this)} >
                                confirm
                            </button>
                            <button 
                                className={"btn btn-secondary"} 
                                onClick={this.ToggleCreateEventModal.bind(this)}>
                                cancel
                            </button>
                        </div>
                    </div>
                </Modal>

                <Modal
                    className={"modal-add-event shadow-lg"}
                    // isOpen={true}
                    isOpen={this.state.userListModal_flg}
                    // onAfterOpen={afterOpenModal}
                    contentLabel="Example Modal"
                    ariaHideApp={false} 
                >
                   <h1>USER LIST</h1>
                    <div className="table-div">
                        <table className="table">
                            <thead className="thead-dark">
                                <tr key={"thead_tr"}>
                                    <th key={"th1"}><center>Id</center></th>
                                    <th key={"th2"}><center>Name</center></th>
                                    <th key={"th3"}></th>
                                </tr>
                            </thead>
                            <tbody className="user-">
                            {this.state.user_list.map(user =>
                                {
                                    return this.checkIfAlreadyTagged(user) ? "" :
                                    <tr key={user.id+"_tr"}>
                                        <td key={user.id+"_td"}>
                                            <center>
                                                {user.id}
                                            </center>
                                        </td>
                                        <td key={user.name+"_id"}>
                                            <center>
                                                {user.name}
                                            </center>
                                        </td>
                                        <td key={user.id+"_td-btn"}>
                                            <div className="td-btn">
                                                <button key={user.id+"_add_btn"} onClick={this.tagUserInEvent.bind(this,user)} className="btn btn-primary">
                                                    add
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                }
                            )}
                            </tbody>
                        </table>
                    </div>
                        <div className="user-list-btn-div">
                            <button className="btn btn-primary" onClick={this.toggleUserListModal.bind(this)}>Confirm</button>
                        </div>
                </Modal>
                
                
                <Modal
                    className={"modal-add-event shadow-lg"}
                    isOpen={this.state.event_details_modal_flg}
                    // onAfterOpen={afterOpenModal}
                    contentLabel="Example Modal"
                    ariaHideApp={false} 
                >
                    <div className="p-3">
                        <h1 >Event Details</h1>
                        <br></br>
                        {
                            this.showAlert()
                        }
                        <label >Event Name:</label>
                        <input 
                            value={this.state.selected_event.name}
                            type="input" 
                            className="form-control" 
                            id="new_event_name" 
                            placeholder="Enter Name" 
                            disabled={true}/>
                        <label >Event Date:</label>
                        <DatePicker 
                            disabled={true} 
                            selected={new Date(this.state.selected_event.start_datetime)} 
                            onSelect={(date)=>{this.setState({selected_date: date});}} 
                            className="form-control"/>

                            <div className="d-flex">
                                <div>
                                    <label >Start Time:</label>
                                    <br />
                                    <TimePicker 
                                        disabled={true}
                                        disableClock={true}
                                        className="form-control" 
                                        onChange={(start)=>{
                                            this.setState({
                                                selected_start: start,
                                            });
                                        }} 
                                        value={new Date(this.state.selected_event.start_datetime).getHours()+':'+new Date(this.state.selected_event.start_datetime).getMinutes()} />
                                </div>
                                <div>
                                    <label >End Time:</label>
                                    <br />
                                    <TimePicker 
                                        disabled={true}
                                        disableClock={true}
                                        className="form-control" 
                                        onChange={(end)=>{
                                            this.setState({
                                                selected_end: end
                                            });
                                        }} 
                                        value={new Date(this.state.selected_event.end_datetime).getHours()+':'+new Date(this.state.selected_event.end_datetime).getMinutes()} />
                                </div>
                            </div>

                        <label>Tagged Users: </label>
                        <div className="tag_div">
                            {this.state.tagged_user.map(user => 
                                <div key={user.id+"_div"} className="tag-user">
                                    {user.name}
                                    <button key={user.id+"_button"} onClick={this.removeTagUser.bind(this,user)} className="tag-user-btn">X</button>
                                </div>
                            )}
                            
                            <button 
                            key={"add_tag_div"} 
                            className="add-tag-btn"
                            hidden={true}
                            onClick={this.toggleUserListModal.bind(this)}>
                                    <span>+ tag user </span>
                            </button>
                        </div>
                        <div>
                            <button onClick={this.closeEventDetails.bind(this)} className="btn btn-primary">close</button>
                        </div>
                    </div>
                </Modal>

            </div>
        );
    }
    showEventDetails(event){
        this.setState({
            selected_event:event,
            event_details_modal_flg: true,
        });
    }
    closeEventDetails(){
        this.setState({
            selected_event:{
                start_datetime: Date.now(),
                end_datetime: Date.now()
            },
            event_details_modal_flg: false,
        });
    }
    showAlert(){
        return this.state.alert_msg == "" ? "" : 
                    <div className="alert alert-danger" role="alert">
                        {this.state.alert_msg}
                    </div>
    }
    checkIfAlreadyTagged(user) {
        var tag_list = this.state.tagged_user;
        for (let index = 0; index < tag_list.length; index++) {
            const element = tag_list[index];
            if (element.id == user.id) {
                return true;
            }
        }
        return false;
    }
    removeTagUser(user){
        var user_list = this.state.tagged_user;
        for (let index = 0; index < user_list.length; index++) {
            const element = user_list[index];
            if (user.id == element.id) {
                user_list.splice(index, 1); 
            }
        }
        this.setState({
            tagged_user: user_list
        });
    }
    async getAllUser(){
        fetch(`http://localhost:3005/?action=get_all_user`)
        .then(res => res.json())
        .then(
          (result) => {
            console.log(result);
            this.setState({
                user_list: result,
            });
          },
          (error) => {
            this.setState({
              isLoaded: true,
              error
            });
          }
        );
    }
    tagUserInEvent(user){
        console.log(user);
        this.setState({
            tagged_user: this.state.tagged_user.concat(user)
        });
    }
    clearData(){
        this.setState({
            user_list: [],
            events: [],
            userListModal_flg: false,
            selected_date: new Date(Date.now()),
            selected_start: new Date(Date.now()).getHours()+':'+new Date(Date.now()).getMinutes(),
            selected_end:  new Date(Date.now()).getHours()+':'+new Date(Date.now()).getMinutes(),
            tagged_user: [],
        })
    }
    async submitCreateEvent(){
        var date_data = this.state.selected_date.toString().split(" ");
        var date = `${date_data[0]} ${date_data[1]} ${date_data[2]} ${date_data[3]}`;
        var start_time = this.state.selected_start;
        var end_time = this.state.selected_end;
        var event_name = document.getElementById("new_event_name").value;
        if(event_name.trim() == ""){
            this.setState({
                alert_msg: "Event Name is required!"
            });
            return;
        }
        var action = `create_event`;
        var event_name = `${event_name}`;
        var start_datetime = `${date} ${start_time}`;
        var end_datetime = `${date} ${end_time}`;
        var tag_user = (this.state.tagged_user);
        
        const response = await axios.get(
            'http://localhost:3005',
            { 
                params:{
                    action: action,
                    start_datetime: start_datetime,
                    end_datetime: end_datetime,
                    event_name: event_name,
                    tag_user: JSON.stringify(tag_user)
                }
            },
          )
          if(response.data != "0"){
            this.setState({
                alert_msg: response.data
            });
          }else{
            this.setState({
                createEventModal_flg: false
            });
          }
        console.log(response.data);    
    }

    loadData(){
        fetch(`http://localhost:3005/?action=get_all_event`)
        .then(res => res.json())
        .then(
          (result) => {
            this.setState({
                events: result,
            });
          },
          (error) => {
            this.setState({
              isLoaded: true,
              error
            });
          }
        );
    }
    ToggleCreateEventModal(){
        if (this.state.createEventModal_flg) {
            this.clearData();
        }
        this.setState({
            createEventModal_flg: !this.state.createEventModal_flg,
        });
    }
    async toggleUserListModal(){
        await this.getAllUser();
        this.setState({
            userListModal_flg: !this.state.userListModal_flg,
        });
    }
}
export default EventList;

