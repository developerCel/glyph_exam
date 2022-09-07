import React, { Component } from "react";
import '../styles/navbar.css';

class NavBar extends Component{

    render(){
        return(
            <div>
                <nav className="bg-dark d-flex navbar">
                    <div className="d-flex justify-content-start">
                        <span className="app-title">Event Manager</span>
                    </div>
                    <div className="">
                        <a className="btn btn-dark" href="/">Users</a>
                        <a className="btn btn-dark" href="/events">Events</a>
                        <a className="btn btn-dark" href="/calendar">Calendar</a>
                    </div>
                </nav>
            </div>
        );
    }   
    
    click(){
        alert('hello world');
    }
}

export default NavBar;

