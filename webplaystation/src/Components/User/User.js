import React, { Component } from 'react'
import "./../Category/Category.css";
import {del, get, post, put} from "./../../Utils/httpHelper";
import { Link } from 'react-router-dom';
import Add from "./Add"

export default class User extends Component {
    state = {
        users: [],
        isDisplayForm: false,
    }

    componentDidMount(){
        get("/users")
        .then((response) => {
            if (response.status === 200)
            {
                console.log(response.data);
                this.setState({users: response.data});
            }
        })
        .catch(error => {console.log(error)})
    }

    find(id){
        get(`/users/${id}`)
        .then((response) => {
            if (response.status === 200)
            {
                console.log(response.data);
                // alert(`${id} is found`);
            }
        })
    }

    delUser = (id) =>
    {
        del(`/users/${id}`)
        .then((response) => {
            console.log(response.data);
            this.setState({users: this.state.users.filter(u => u.id !== id)})
        })
        .catch(error => {console.log(error)})
    }

    createUser(newUser){
        post(`/auth/signup`, {name: newUser.name, gender: newUser.gender, address: newUser.address,
                        email: newUser.email, phone: newUser.phone, username: newUser.username,
                        password: newUser.password, role: newUser.role})
        .then((response) => {
            console.log(response.data);
            this.setState({
                users: [...this.state.users, response.data],
            });
        });
    }

    onToggleForm = () => {
        this.setState({
            isDisplayForm: !this.state.isDisplayForm
        });
    }

    onCloseForm = () => {
        this.setState({
            isDisplayForm: false,
        });
    }

    onAdd = (data) => {
        console.log(data);
        this.createUser(data);
    }


    render() {
        return (
            <div>
                <button type="button" className="btn btn-primary" onClick={this.onToggleForm}>
                    <span className="fa fa-plus mr-5"></span>
                    Creat New User
                </button>
                <table id="table">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Name</th>
                            <th>Gender</th>
                            <th>Address</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Username</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.users.map((u) => (
                                <tr key={u.id}>
                                    <td>{u.id}</td>
                                    <td>{u.name}</td>
                                    <td>{u.gender}</td>
                                    <td>{u.address}</td>
                                    <td>{u.email}</td>
                                    <td>{u.phone}</td>
                                    <td>{u.account}</td>
                                    <td>{u.role_id}</td>
                                    <td>{u.active_status}</td>
                                    <td><button onClick={() => this.delUser(u.id)}>Del</button></td>
                                    <td>
                                        <Link to={`user/update/${u.id}`}>
                                            <button className="btn btn-success">
                                                Update
                                            </button>
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                <div className="container">
                    {this.state.isDisplayForm ? <Add onAdd={this.onAdd} onCloseForm={this.onCloseForm}/> : ''}
                </div>
            </div>
        )
    }
}
