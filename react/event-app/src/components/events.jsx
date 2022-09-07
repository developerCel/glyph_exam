import React, { Component } from "react";
import '../styles/events.css';
import Modal from 'react-modal';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TimePicker from 'react-time-picker';
import axios from 'axios';

class EventList extends Component{

    state={
        succes_modal_flg: false,
        selected_event_modal_title: "Event Details",
        edittingMode: false,
        event_details_modal_flg: false,
        details_userListModal_flg: false,
        alert_msg: "",
        success_msg: "",
        user_list: [],
        events: [],
        createEventModal_flg: false,
        userListModal_flg: false,
        selected_date: new Date(Date.now()),
        selected_start: new Date(Date.now()).getHours()+':'+new Date(Date.now()).getMinutes(),
        selected_end:  new Date(Date.now()).getHours()+':'+new Date(Date.now()).getMinutes(),
        tagged_user: [],
        event_details_backup: {},
        details_name: "",
        details_selected_date: new Date(Date.now()),
        details_selected_start: new Date(Date.now()).getHours()+':'+new Date(Date.now()).getMinutes(),
        details_selected_end:  new Date(Date.now()).getHours()+':'+new Date(Date.now()).getMinutes(),
        details_tagged_user: [],
    }
    componentDidMount(){
        this.loadData();
    }
    componentDidUpdate(){
        this.loadData();
    }

    render(){
        return(
            <div className="center-body">
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
                    isOpen={this.state.event_details_modal_flg}
                    // onAfterOpen={afterOpenModal}
                    contentLabel="Example Modal"
                    ariaHideApp={false} 
                >
                    <div className="p-3">
                        <h1 >{this.state.selected_event_modal_title}</h1>
                        <br></br>
                        {
                            this.showAlert()
                        }
                        <label >Event Name:</label>
                        <input 
                            value={this.state.details_name}
                            onChange={(val) => {
                                this.setState({
                                    details_name : val.target.value
                                })
                            }}
                            type="input" 
                            className="form-control" 
                            id="new_event_name" 
                            placeholder="Enter Name" 
                            disabled={!this.state.edittingMode}/>
                        <label >Event Date:</label>
                        <DatePicker 
                            disabled={!this.state.edittingMode} 
                            selected={new Date(this.state.details_selected_date)} 
                            onSelect={(date)=>{this.setState({
                                details_selected_date: date
                            });}} 
                            className="form-control"/>

                            <div className="d-flex">
                                <div>
                                    <label >Start Time:</label>
                                    <br />
                                    <TimePicker 
                                        disabled={!this.state.edittingMode}
                                        disableClock={true}
                                        className="form-control" 
                                        onChange={(start)=>{
                                            this.setState({
                                                details_selected_start: start,
                                            });
                                        }} 
                                        value={this.state.details_selected_start} />
                                </div>
                                <div>
                                    <label >End Time:</label>
                                    <br />
                                    <TimePicker 
                                        disabled={!this.state.edittingMode}
                                        disableClock={true}
                                        className="form-control" 
                                        onChange={(end)=>{
                                            this.setState({
                                                details_selected_end: end
                                            });
                                        }} 
                                        value={this.state.details_selected_end} />
                                </div>
                            </div>

                        <label>Tagged Users: </label>
                        <div className="tag_div">
                            {this.state.details_tagged_user.map(user => 
                                <div key={user.id+"_div"} className="tag-user">
                                    {user.name}
                                    <button 
                                        hidden={!this.state.edittingMode}
                                        key={user.id+"_button"} 
                                        onClick={this.details_removeTagUser.bind(this,user)} 
                                        className="tag-user-btn">X</button>

                                </div>
                            )}
                            <button 
                            key={"add_tag_div"} 
                            className="add-tag-btn"
                            hidden={!this.state.edittingMode}
                            onClick={this.toggleUserListModal.bind(this)}>
                                    <span>+ tag user </span>
                            </button>
                        </div>
                        <div className="btn-container" >
                            <button 
                                hidden={this.state.edittingMode}
                                onClick={this.closeEventDetails.bind(this)} 
                                className="btn btn-secondary">
                                close
                            </button>
                            <button 
                                hidden={this.state.edittingMode}
                                onClick={this.enableEditing.bind(this)} 
                                className="btn btn-primary">
                                Edit
                            </button>
                            <button 
                                hidden={!this.state.edittingMode}
                                onClick={this.onCancelEditing.bind(this)}
                                className="btn btn-secondary">
                                Cancel
                            </button>
                            <button 
                                onClick={this.submitEventUpdate.bind(this)}
                                hidden={!this.state.edittingMode}
                                className="btn btn-danger">
                                Save
                            </button>
                            <button 
                                onClick={this.deleteEvent.bind(this)}
                                hidden={this.state.edittingMode}
                                className="btn btn-danger">
                                Delete
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
                    className={"modal-add-success shadow-lg"}
                    // isOpen={true}
                    isOpen={this.state.succes_modal_flg}
                    // onAfterOpen={afterOpenModal}
                    contentLabel="Example Modal"
                    ariaHideApp={false} 
                >
                    <div className="p-5 pb-0">
                        <div className="alert alert-success" role="alert">
                          <h2>Event Created Successfully!</h2>
                        </div>                        
                    </div>
                    <div className="user-list-btn-div p-5 pt-1">
                        <button 
                            className="btn btn-primary" 
                            onClick={()=>{
                                this.setState({
                                    succes_modal_flg: false
                                });
                            }}>
                            Confirm
                        </button>
                    </div>
                </Modal>
                
            </div>
        );
    }
    async deleteEvent(){
        const response = await axios.get(
            'http://localhost:3005',
            { 
                params:{
                    action: "delete_event",
                    event_id: this.state.event_details_backup.id,
                }
            },
          )
          if(response.data != "0"){
            this.setState({
                alert_msg: response.data
            });
          }else{
            this.setState({
                edittingMode: false,
                event_details_modal_flg: false,
                success_msg: "",
                alert_msg: ""
            });
          }
        console.log(response.data);    
    }
    async submitEventUpdate(){
        this.setState({
            alert_msg: "",
            success_msg: ""
        });
        var date_data = this.state.details_selected_date.toString().split(" ");
        var date = `${date_data[0]} ${date_data[1]} ${date_data[2]} ${date_data[3]}`;
        var start_time = this.state.details_selected_start;
        var end_time = this.state.details_selected_end;
        var event_name = this.state.details_name;
        console.log(event_name);
        if(event_name.trim() == ""){
            this.setState({
                alert_msg: "Event Name is required!"
            });
            return;
        }
        var action = `update_event`;
        var event_name = `${event_name}`;
        var start_datetime = `${date} ${start_time}`;
        var end_datetime = `${date} ${end_time}`;
        var tag_user = (this.state.details_tagged_user);
        
        const response = await axios.get(
            'http://localhost:3005',
            { 
                params:{
                    action: action,
                    event_id: this.state.event_details_backup.id,
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
                edittingMode: false,
                success_msg: "Data Updated Successfully"
            });
          }
        console.log(response.data);    
    }
    enableEditing(){
        var modal_tltle = this.state.edittingMode? "Event Details" : "Update Event Details";
        this.setState({
            edittingMode: !this.state.edittingMode,
            selected_event_modal_title: modal_tltle,
            alert_msg: "",
            success_msg: ""
        })
    }
    onCancelEditing(){
        this.setState({
            edittingMode: false,
            details_name: this.state.event_details_backup.name,
            details_selected_date: this.state.event_details_backup.start_datetime,
            details_selected_start: new Date(this.state.event_details_backup.start_datetime).getHours()+':'+new Date(this.state.event_details_backup.start_datetime).getMinutes(),
            details_selected_end:  new Date(this.state.event_details_backup.end_datetime).getHours()+':'+new Date(this.state.event_details_backup.end_datetime).getMinutes(),
            details_tagged_user: this.state.event_details_backup.tag_user,
            alert_msg: "",
            success_msg: ""
        });
    }
    showEventDetails(event){
        var s_hours = new Date(event.start_datetime).getHours();
        var s_minutes = new Date(event.start_datetime).getMinutes();
        s_minutes = s_minutes < 10 ? `0${s_minutes}` : s_minutes;
        var e_hours = new Date(event.end_datetime).getHours();
        var e_minutes = new Date(event.end_datetime).getMinutes();
        e_minutes = e_minutes < 10 ? `0${e_minutes}` : e_minutes;

        console.log(s_hours+":"+s_minutes);
        console.log(e_hours+":"+e_minutes);

        this.setState({
            event_details_backup:event,
            event_details_modal_flg: true,
            details_name: event.name,
            details_selected_date: event.start_datetime,
            details_selected_start: s_hours+":"+s_minutes,
            details_selected_end:  e_hours+":"+e_minutes,
            details_tagged_user: event.tag_user
        });
    }
    closeEventDetails(){
        this.setState({
            event_details_modal_flg: false,
            edittingMode: false,
            alert_msg: "",
            success_msg: ""
        });
    }
    showAlert(){
        if(this.state.alert_msg !== ""){
            return <div className="alert alert-danger" role="alert">
                        {this.state.alert_msg}
                    </div>
        }else if(this.state.success_msg !== ""){
            return <div className="alert alert-success" role="alert">
                        {this.state.success_msg}
                    </div>
        }else{
            return "";
        }
        
    }
    checkIfAlreadyTagged(user) {
        var tag_list = this.state.edittingMode ? this.state.details_tagged_user : this.state.tagged_user;
        for (let index = 0; index < tag_list.length; index++) {
            const element = tag_list[index];
            if (element.id == user.id) {
                return true;
            }
        }
        return false;
    }
    removeSelectedEventTagUser(user){
        var user_list = this.state.selected_event.user_tag;
        for (let index = 0; index < user_list.length; index++) {
            const element = user_list[index];
            if (user.id == element.id) {
                user_list.splice(index, 1); 
            }
        }
        this.setState({
            user_tag: user_list
        });
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
    details_removeTagUser(user){
        var user_list = this.state.details_tagged_user;
        for (let index = 0; index < user_list.length; index++) {
            const element = user_list[index];
            if (user.id == element.id) {
                user_list.splice(index, 1); 
            }
        }
        this.setState({
            details_tagged_user: user_list
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
        if(this.state.edittingMode){
            this.setState({
                details_tagged_user: this.state.details_tagged_user.concat(user)
            });

        }else{
            this.setState({
                tagged_user: this.state.tagged_user.concat(user)
            });
        }
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
                alert_msg: response.data,
            });
          }else{
            this.setState({
                createEventModal_flg: false,
                succes_modal_flg: true,
                success_msg: "",
                alert_msg: ""
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
            alert_msg: "",
            success_msg: "",
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

