import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.css';
import UserList from './components/userList';
import NavBar from './components/navbar';
import EventList from './components/events';
import EventCalendar from './components/calendar';

const root = ReactDOM.createRoot(document.getElementById('root'));
var body = <UserList/>;
switch (window.location.pathname) {
  case "/":
    body =  <UserList/>;
    break;
  case "/events":
    body =  <EventList/>;
    break;
  case "/calendar":
    body =  <EventCalendar/>;
    break;
  default:
    break;
}
root.render(
  <React.Fragment>
    <NavBar/>
    {body}
  </React.Fragment>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
