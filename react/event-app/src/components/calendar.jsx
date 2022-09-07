import React, { Component } from "react";
import '../styles/calendar.css';

class EventCalendar extends Component{

    render(){
        return(
            <div>
               <h1>Hello EventCalendar</h1>
            </div>
        );
    }   
    
    click(){
        alert('hello world');
    }
}

export default EventCalendar;

