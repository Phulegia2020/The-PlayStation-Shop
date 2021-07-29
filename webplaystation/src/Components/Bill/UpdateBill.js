import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Col, Row, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { get, put } from '../../Utils/httpHelper';

class UpdateBill extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            id: this.props.match.params.id,
            total: 0,
            user_id: "",
            billStatus_id: "",
            users: [],
            billStatus: [],
            Error: "",
            key: "",
        }
    }
    
    componentDidMount(){
        get("/users")
        .then((response) => {
            if (response.status === 200)
            {
                //console.log(response.data);
                this.setState({users: response.data});
            }
        })
        .catch(error => {console.log(error)})

        get(`/bills/${this.state.id}`)
        .then((response) => {
            //console.log(response.data);
            if (response.status === 200)
            {
                this.setState({
                    total: response.data.total,
                    user_id: response.data.user_id,
                    billStatus_id: response.data.billStatus_id
                })
            }
        });

        get("/billstatuses")
        .then((response) => {
            if (response.status === 200)
            {
                //console.log(response.data);
                this.setState({
                    billStatus: response.data
                });
            }
        })
    }

    changeValue(e){
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleUpdate(event){
        event.preventDefault();
        if (event.target.total.value.trim() <= 0)
        {
            this.setState({
                key: 'total'
            })
            this.setState({
                Error: "Total price is not less than 1!"
            });
            return;
        }
        put(`/bills/${this.state.id}`, {total: this.state.total, user_id: this.state.user_id, billStatus_id: this.state.billStatus_id})
        .then((response) => {
            if (response.status === 200)
            {
            //console.log(response.data);
                this.props.history.push("/admin/bill");
            }
        })
    }

    handleClear = () => {
        this.setState({
            total: 0,
            user_id: "",
            billStatus_id: "",
        });
        this.props.history.push("/admin/bill");
    }

    componentWillUnmount() {
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state,callback)=>{
            return;
        };
    }

    render() {
        return (
            <div>
                <h3>Update Bill</h3>
                <Form onSubmit={(event) => this.handleUpdate(event)}>
                <FormGroup>
                    <Label for="total">Total</Label>
                    <Input type="number" name="total" id="total" placeholder="VND" onChange={(e) => this.changeValue(e)} value = {this.state.total} required="required"/>
                    {this.state.key === 'total' ? <span style={{ color: "red", fontStyle:"italic"}}>{this.state.Error}</span> : '' }
                </FormGroup>
                
                <FormGroup className="mb-2">
                    <Label for="user">User</Label>
                    <Input type="select" name="user_id" id="user" value = {this.state.user_id} onChange={(e) => this.changeValue(e)}>
                        {
                            this.state.users.map((u) => (
                                <option key={u.id} value={u.id}>{u.name}</option>
                            ))
                        }
                    </Input>
                </FormGroup>
                <FormGroup className="mb-5">
                    <Label for="status">Status</Label>
                    <Input type="select" name="billStatus_id" id="status" value = {this.state.billStatus_id} onChange={(e) => this.changeValue(e)}>
                        {
                            this.state.billStatus.map((bs) => (
                                <option key={bs.id} value={bs.id}>{bs.description}</option>
                            ))
                        }
                    </Input>
                </FormGroup>
                <div className="mb-5">
                    <Button type="submit" outline color="warning" >Update</Button>{' '}
                    <Button outline color="danger" onClick={this.handleClear.bind(this)}>Cancel</Button>
                </div>
                </Form>
            </div>
        )
    }
}

export default withRouter(UpdateBill);