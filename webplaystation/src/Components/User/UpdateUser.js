import React, { Component } from 'react'
import { withRouter } from "react-router";
import { put, get } from '../../Utils/httpHelper';
import { Col, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { checkPhoneNumber } from '../../Utils/Utils';
import "../Category/Category.css";

class UpdateUser extends React.Component {
    state = {
        id: this.props.match.params.id,
        name: "",
        gender: "",
        address: "",
        email: "",
        phone: "",
        username: "",
        role_id: "",
        active_status: "",
        roles:[],
        Error: "",
        key: "",
        users: [],
    }

    componentDidMount(){
        get("/users")
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({users: response.data});
            }
        })
        .catch(error => {console.log(error)})

        get(`/users/${this.state.id}`)
        .then((response) => {
            console.log(response.data);
            if (response.status === 200)
            {
                this.setState({
                    name: response.data.name,
                    gender: response.data.gender,
                    address: response.data.address,
                    email: response.data.email,
                    phone: response.data.phone,
                    username: response.data.account,
                    active_status: response.data.active_status,
                    role_id: response.data.role_id,
                })
            }
        });
        get("/roles")
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({
                    roles: response.data
                });
            }
        })
    }

    componentWillUnmount() {
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state,callback)=>{
            return;
        };
    }

    changeValue(e){
        if (e.target.name === 'username' || e.target.name === 'phone' || e.target.name === 'email')
        {
            this.setState({
                [e.target.name]: e.target.value.trim()
            });
        }
        else
        {
            this.setState({
                [e.target.name]: e.target.value
            });
        }
    }

    handleUpdate(event){
        event.preventDefault();
        for (let i = 0; i < this.state.users.length; i++)
        {
            if (this.state.users[i].id != this.state.id)
            {
                if (this.state.users[i].account === event.target.username.value.trim())
                {
                    this.setState({
                        key: 'username'
                    })
                    this.setState({
                        Error: "T??n t??i kho???n n??y ???? ???????c s??? d???ng!"
                    });
                    return;
                }
                if (this.state.users[i].email === event.target.email.value.trim())
                {
                    this.setState({
                        key: 'email'
                    })
                    this.setState({
                        Error: "Email n??y ???? ???????c s??? d???ng!"
                    });
                    return;
                }
                if (this.state.users[i].phone === event.target.phone.value.trim())
                {
                    this.setState({
                        key: 'phone'
                    })
                    this.setState({
                        Error: "S??? ??i???n tho???i n??y ???? ???????c s??? d???ng!"
                    });
                    return;
                }
            }
        }
        if (!checkPhoneNumber(event.target.phone.value.trim()))
        {
            this.setState({
                key: 'phone'
            })
            this.setState({
                Error: "S??? ??i???n tho???i ph???i b???t ?????u b???ng s??? 0!"
            });
            return;
        }
        put(`/users/${this.state.id}`, {name: this.state.name.trim(), gender:this.state.gender, address: this.state.address.trim(), email: this.state.email.trim(),
                                        phone: this.state.phone, account: this.state.username, active_status: this.state.active_status, role_id: this.state.role_id})
        .then((response) => {
            if (response.status === 200)
            {
                this.props.history.push("/admin/user");
            }
        })
    }

    handleClear = () => {
        this.setState({
            name: "",
            gender: "",
            address: "",
            email: "",
            phone: "",
            username: "",
            password: "",
            role: ""
        });
        this.props.history.push("/admin/user");
    }

    render() {
        return (
            <div className="update-form">
                <h3>C???p Nh???t Ng?????i D??ng</h3>
                <Form onSubmit={(event) => this.handleUpdate(event)}>
                    <FormGroup>
                        <Label htmlFor="name">H??? T??n</Label>
                        <Input type="text" name="name" id="name" placeholder="Phu Le Gia" onChange={(e) => this.changeValue(e)} value = {this.state.name} required disabled={this.state.active_status === 'Inactive'}/>
                    </FormGroup>
                    <FormGroup tag="fieldset" row>
                        <legend className="col-form-label col-sm-2">Gi???i T??nh</legend>
                        <Col md={4}>
                        <FormGroup check>
                            <Label check>
                            <Input type="radio" name="gender" value = "Male" onChange={(e) => this.changeValue(e)} checked={this.state.gender === "Male"} disabled={this.state.active_status === 'Inactive'}/>{' '}
                            Nam
                            </Label>
                        </FormGroup>
                        <FormGroup check>
                            <Label check>
                            <Input type="radio" name="gender" value = "Female" onChange={(e) => this.changeValue(e)} checked={this.state.gender === "Female"} disabled={this.state.active_status === 'Inactive'}/>{' '}
                            N???
                            </Label>
                        </FormGroup>
                        </Col>
                    </FormGroup>
                            <FormGroup>
                                <Label htmlFor="username">T??i Kho???n</Label>
                                <Input type="text" name="username" id="username" placeholder="Football" onChange={(e) => this.changeValue(e)} value = {this.state.username} disabled/>
                                {this.state.key === 'username' ? <span style={{ color: "red", fontStyle:"italic"}}>{this.state.Error}</span> : '' }
                            </FormGroup>
                            <FormGroup>
                                <Label htmlFor="email">Email</Label>
                                <Input type="email" name="email" id="email" placeholder="abc@gmail.com" onChange={(e) => this.changeValue(e)} value = {this.state.email} required disabled={this.state.active_status === 'Inactive'}/>
                                {this.state.key === 'email' ? <span style={{ color: "red", fontStyle:"italic"}}>{this.state.Error}</span> : '' }
                            </FormGroup>
                    <FormGroup>
                        <Label htmlFor="address">?????a Ch???</Label>
                        <Input type="text" name="address" id="address" placeholder="1 ???????ng, Ph?????ng 2, Qu???n 3, Th??nh ph??? H??? Ch?? Minh" onChange={(e) => this.changeValue(e)} value = {this.state.address} required disabled={this.state.active_status === 'Inactive'}/>
                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="phone">S??? ??i???n Tho???i</Label>
                        <Input type="text" minLength={10} maxLength={10} name="phone" id="phone" placeholder="0987654321" onChange={(e) => this.changeValue(e)} value = {this.state.phone} required disabled={this.state.active_status === 'Inactive'}/>
                        {this.state.key === 'phone' ? <span style={{ color: "red", fontStyle:"italic"}}>{this.state.Error}</span> : '' }
                    </FormGroup>
                    <FormGroup className="mb-2">
                        <Label htmlFor="role">Vai Tr??</Label>
                        <Input type="select" name="role_id" id="role" value = {this.state.role_id} onChange={(e) => this.changeValue(e)} disabled={localStorage.getItem('role') === 'STAFF' || this.state.active_status === 'Inactive'}>
                            {
                                this.state.roles.map((r) => (
                                    <option key={r.id} value={r.id}>{r.name}</option>
                                ))
                            }
                        </Input>
                    </FormGroup>
                    <div className="mb-5">
                        <Button outline color="warning" disabled={this.state.active_status === 'Inactive'}>C???p Nh???t</Button>{' '}
                        <Button outline color="danger" onClick={this.handleClear.bind(this)}>H???y</Button>
                    </div>
                </Form>
            </div>
        )
    }
}

export default withRouter(UpdateUser);