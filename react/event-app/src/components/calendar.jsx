import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import enUS from 'date-fns/locale/en-US'
import "react-big-calendar/lib/css/react-big-calendar.css"
import { Component } from 'react'
import { render } from '@testing-library/react'

const localizer = momentLocalizer(moment)


var events = []
class MyCalendar extends Component {
  
    state={
        events:[],
    }
    componentDidMount(){
        this.loadData();
    }

  render(){
    return(
        <div>
            <Calendar
            localizer={localizer}
            events={this.state.events}
            titleAccessor="name"
            startAccessor="start_datetime"
            endAccessor="end_datetime"
            onDoubleClickEvent={(element)=>{
                console.log(element);
            }}
            style={{ height: 900 }}
            />
        </div>
    );
  }

  loadData(){
    fetch(`http://localhost:3005/?action=get_all_event`)
    .then(res => res.json())
    .then(
    (result) => {
        for (let index = 0; index < result.length; index++) {
            result[index].start_datetime = new Date(result[index].start_datetime);
            result[index].end_datetime = new Date(result[index].end_datetime);
        }
        console.log(result)
        this.setState({
            events: result,
        });
    },
    (error) => {
    console.log(error);
    }
    );
}

}

export default MyCalendar