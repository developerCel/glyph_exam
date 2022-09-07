const Express = require('express');
const app = new Express();
const fs = require('fs');
const process = require('process');
const port = process.env.PORT || 3005;
const cors = require('cors');

app.use(cors());

app.get('/', (req, res)=>{
    switch (req.query.action) {

        case "create_user": // for creating a new user
            // check if name is provided
            if(!req.query.user_name){ res.send(JSON.stringify(["user name not provided!"])); return; }
            if(checkIfUserNameExist(req.query.user_name)){ res.send(JSON.stringify(["user already exist!"])); return; }
            res.send(JSON.stringify([insertNewUser(req.query.user_name)]));
            break;
    
        case "create_event":
            // check if complete args is provided
            if(!req.query.start_datetime){ res.send(JSON.stringify(["event start is required!"])); return; }
            if(!req.query.end_datetime){ res.send(JSON.stringify(["event end is required!"])); return; }
            if(!req.query.event_name){ res.send(JSON.stringify(["event name is required!"])); return; }
            if(!req.query.tag_user){ res.send(JSON.stringify(["event tag user is required!"])); return; }
            var start_datetime = req.query.start_datetime;
            var end_datetime = req.query.end_datetime;
            var event_name = req.query.event_name;
            var tag_user = JSON.parse(req.query.tag_user);
            
            //limit tagged user to 10
            if(tag_user.length > 10 || tag_user.length == 0){
              res.send(`You can only tag a maximum of 10 users and minimum of 1 user per event.`); return; 
            }
            //check each user name if it exist
            for (let index = 0; index < tag_user.length; index++) {
                const user = tag_user[index];
                if(!checkIfUserNameExist(user)){ res.send(`there is no user named '${user}'.`); return; }
            }
            var e_validity = verifyNewEventValidity(start_datetime, end_datetime);
            if(e_validity != "0") { res.send(e_validity); return;  }

            res.send(insertNewEvent(event_name,start_datetime,end_datetime,tag_user));
            break;
        
        case "update_event":
            
            // check if complete args is provided
            if(!req.query.start_datetime){ res.send("event start is required!"); return; }
            if(!req.query.end_datetime){ res.send("event end is required!"); return; }
            if(!req.query.event_name){ res.send("event name is required!"); return; }
            if(!req.query.tag_user){ res.send("tagged user is required!"); return; }
            if(!req.query.event_id){ res.send("event id is required!"); return; }
            var start_datetime = req.query.start_datetime;
            var end_datetime = req.query.end_datetime;
            var event_name = req.query.event_name;
            var event_id = req.query.event_id;
            var tag_user = JSON.parse(req.query.tag_user);
            
            //limit tagged user to 10
            if(tag_user.length > 10 || tag_user.length == 0){
              res.send(`You can only tag a maximum of 10 users and minimum of 1 user per event.`); return; 
            }
            //check each user name if it exist
            for (let index = 0; index < tag_user.length; index++) {
                const user = tag_user[index];
                if(!checkIfUserNameExist(user)){ res.send(`there is no user named '${user}'.`); return; }
            }
            var e_validity = verifyNewEventValidity(start_datetime, end_datetime, event_id);
            if(e_validity != "0") { res.send(e_validity); return;  }
            res.send(updateEvent(event_id, event_name,start_datetime,end_datetime,tag_user));
            break;
        
        case "delete_event":
            if(!req.query.event_id){ res.send("event id is required!"); return; }
            res.send(deleteEvent(req.query.event_id));
            break;
       
        case "get_all_event":
            var event_list = [];
            // get list of events from json file
            event_list = fs.readFileSync('events.json').length > 0 ? JSON.parse(fs.readFileSync('events.json')) : [];
            res.send(JSON.stringify(event_list));
            break;
        
        case "get_all_user":
            var user_list = [];
            // get list of users from json file
            user_list = fs.readFileSync('events.json').length > 0 ? JSON.parse(fs.readFileSync('users.json')) : [];
            res.send(JSON.stringify(user_list));
            break;
            break;
        default:
            res.send("invalid data provided.");
            break;
    }
});



app.listen(port, ()=>{
    console.log(`now listening to port ${port}`);
});

function checkIfUserNameExist(user_name) {
    // get list of users from json file
    user_list = fs.readFileSync('users.json').length > 0 ? JSON.parse(fs.readFileSync('users.json')) : [];
    
    for (let index = 0; index < user_list.length; index++) {
        const element = user_list[index];
        if(element.name == user_name.name){ return true; }
    }

    return false;
}

function updateEvent(event_id, event_name, start_datetime, end_datetime, tag_user) {
    var event_list = [];
    // get list of events from json file
    event_list = fs.readFileSync('events.json').length > 0 ? JSON.parse(fs.readFileSync('events.json')) : [];
    for (let index = 0; index < event_list.length; index++) {
        const element = event_list[index];
        if (element.id == event_id) {
            event_list[index].name = event_name;
            event_list[index].start_datetime = start_datetime;
            event_list[index].end_datetime = end_datetime;
            event_list[index].tag_user = tag_user;
                    
            var json = JSON.stringify(event_list).replaceAll("},","},\n");
            fs.writeFile('events.json', json, 'utf8', ()=>{
                console.log('event updated successfully!');
            });

            return `0`;
        }
    }
}

function deleteEvent(event_id) {
    var event_list = [];
    // get list of events from json file
    event_list = fs.readFileSync('events.json').length > 0 ? JSON.parse(fs.readFileSync('events.json')) : [];
    for (let index = 0; index < event_list.length; index++) {
        const element = event_list[index];
        if (element.id == event_id) {
            event_list.splice(index,1);

            var json = JSON.stringify(event_list).replaceAll("},","},\n");
            fs.writeFile('events.json', json, 'utf8', ()=>{
                console.log('event deleted successfully');
            });

            return `0`;
        }
    }
    return `something went wrong.`;
}

function insertNewUser(user_name) { // insert new user
    var user_list = [];
    // get list of users from json file
    user_list = fs.readFileSync('users.json').length > 0 ? JSON.parse(fs.readFileSync('users.json')) : [];
    var user = {};
    user.id = user_list.length+1;
    user.name = user_name;
    user_list.push(user);
    var json = JSON.stringify(user_list).replaceAll("},","},\n");
    fs.writeFile('users.json', json, 'utf8', ()=>{
        console.log('user created successfully');
    });
    return '0';
}

function verifyNewEventValidity(start_datetime, end_datetime, event_id=0){
    var event_list = [];
    // get list of ecents from json file
    event_list = fs.readFileSync('events.json').length > 0 ? JSON.parse(fs.readFileSync('events.json')) : [];
    for (let index = 0; index < event_list.length; index++) {
        const element = event_list[index];
        if(element.id != event_id){
            //
            if(new Date(element.start_datetime) >= new Date(start_datetime) 
            && new Date(element.start_datetime) <= new Date(end_datetime)){ 
                return `event overlaps with ${element.name} (${element.start_datetime} - ${element.end_datetime})!`;
            }
            //
            if(new Date(element.end_datetime) >= new Date(start_datetime) 
            && new Date(element.end_datetime) <= new Date(end_datetime)){ 
                return `event overlaps with ${element.name} (${element.start_datetime} - ${element.end_datetime})!`;
            }
            //
            if(new Date(element.start_datetime) <= new Date(start_datetime) 
            && new Date(element.end_datetime) >= new Date(start_datetime)){ 
                return `event overlaps with ${element.name} (${element.start_datetime} - ${element.end_datetime})!`;
            }
            //
            if(new Date(element.start_datetime) <= new Date(end_datetime) 
            && new Date(element.end_datetime) >= new Date(end_datetime)){ 
                return `event overlaps with ${element.name} (${element.start_datetime} - ${element.end_datetime})!`;
            }
        }
    }
    
    if(new Date(start_datetime) <= new Date()){
        return `selected start time already past the currest time!`;
    }
    if(new Date(start_datetime) >= new Date(end_datetime)){
        return `invalid schedule time!`;
    }

    if(new Date(start_datetime).getHours() < 8 
    || new Date(start_datetime).getHours() > 20){
        return `Events to be set are only between 8:00AM - 8:00PM.`;
    }
    if(new Date(end_datetime).getHours() < 8 
    || new Date(end_datetime).getHours() > 20){
        return `Events to be set are only between 8:00AM - 8:00PM.`;
    }
    return '0';
}

function insertNewEvent(event_name, start_datetime, end_datetime, tag_user) { // insert new user
    var event_list = [];
    // get list of events from json file
    event_list = fs.readFileSync('events.json').length > 0 ? JSON.parse(fs.readFileSync('events.json')) : [];
    var event = {};
    event.id = event_list.length+1;
    event.name = event_name;
    event.start_datetime = start_datetime;
    event.end_datetime = end_datetime;
    event.tag_user = tag_user;
    event_list.push(event);
    
    var json = JSON.stringify(event_list);

    fs.writeFile('events.json', json, 'utf8', ()=>{
        console.log('event created successfully');
    });
    return '0';
}