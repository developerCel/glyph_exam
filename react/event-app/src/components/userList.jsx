import React, { Component } from "react";
import '../styles/userList.css';
import Modal from 'react-modal';

class UserList extends Component{
    
    state = {
        users:[],
        show_add_user_modal: false,
        new_user_name: "",
        succes_modal_flg: false,
    }
    
    componentDidMount(){
        this.getAllUser();
    }
    componentDidUpdate(){
        this.getAllUser();
    }

    render(){
        

        return(
       <div className="center-body">
            <div className="d-flex add-div">
                <button className="btn btn-primary" onClick={this.toggle_add_user_modal.bind(this)}>+ Add User</button>
            </div>
             <div>
                <table className="table shadow-lg">
                    <thead className={"thead-dark"} key={"thead_user"}>
                        <tr key={"tr"}>
                        <th key={"th1"} scope="col"><center>User #</center></th>
                        <th key={"th2"} scope="col"><center>User Name</center></th>
                        <th key={"th3"} scope="col"></th>
                        </tr>
                    </thead>
                    <tbody key={"tbody_user"}>
                    {this.state.users.map(user => 
                        <tr key={user.id+"_tr"}>
                            <td  key={user.id}> 
                                <center>{user.id} </center>
                            </td>
                            <td key={user.id+"_td_name"}> 
                                <center>
                                    {user.name} 
                                </center>
                            </td>
                        </tr>
                        )}                        
                    </tbody>
                </table> 
            </div> 
                <Modal
                    className={"modal-add-user table shadow-lg"}
                    isOpen={this.state.show_add_user_modal}
                    // onAfterOpen={afterOpenModal}
                    contentLabel="Example Modal"
                    ariaHideApp={false} 
                >
                    <div className="p-3">
                        <label >Add User</label>
                        <input type="input" className="form-control" id="name" value={this.setState.new_user_name}
                        onChange={this.handleChange} placeholder="Enter Name"/>
                    </div>
                    <div className="btn-container">
                                <button className={"btn btn-primary"} onClick={this.createUser.bind(this)}>confirm</button>
                                <button className={"btn btn-secondary"} onClick={this.toggle_add_user_modal.bind(this)}>cancel</button>
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
                          <h2>User Created Successfully!</h2>
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

    toggle_add_user_modal(){
        this.setState({ show_add_user_modal: !this.state.show_add_user_modal});
    }

    handleChange = (e) => {
      this.state.new_user_name =  e.target.value
    };

    getAllUser(){
        fetch(`http://localhost:3005/?action=get_all_user`)
        .then(res => res.json())
        .then(
          (result) => {
            this.setState({
                users: result,
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

    createUser(){
        const user_name = this.state.new_user_name;
        fetch(`http://localhost:3005/?action=create_user&user_name=${user_name}`)
        .then(res => res.json())
        .then(
          (result) => {
            console.log(result[0]);
            if(result[0]=="0"){
                this.toggle_add_user_modal();
                this.setState({
                    succes_modal_flg: true
                })
            }
          },
          (error) => {
            this.setState({
              isLoaded: true,
              error
            });
          }
        );
    }
}

export default UserList;

