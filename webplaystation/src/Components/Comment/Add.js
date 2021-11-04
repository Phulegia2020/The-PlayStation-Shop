import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { get } from '../../Utils/httpHelper';

export default class Add extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            user_id: '',
            users: [],
            product_id: "",
            products: [],
            content: '',
            Error: "",
            key: "",
        }
    }
    
    componentDidMount(){
        get("/users/customer")
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({users: response.data});
            }
        })
        .catch(error => {console.log(error)})

        get("/products")
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({
                    products: response.data
                })
            }
        })
        .catch(error => {console.log(error)})
    }

    changeValue(e){
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleCreate(event){
        event.preventDefault();
        this.setState({
            product_id: event.target.product_id.value,
            content: ''
        })
        //console.log(this.state.content);
        this.props.onAdd(this.state);
        //console.log(this.state.content);
    }

    handleClear = () => {
        this.setState({
            content: '',
        });
        this.props.onCloseForm();
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
                <Form onSubmit={(event) => this.handleCreate(event)}>
                <FormGroup>
                    <Label htmlFor="content">Content</Label>
                    <textarea style={{resize: 'none', width: '470px'}} rows="3" type="text" name="content" id="content" placeholder="Content..." onChange={(e) => this.changeValue(e)} value = {this.state.content} required="required"/>
                </FormGroup>
                
                    
                <FormGroup className="mb-2">
                    <Label htmlFor="user">Customer</Label>
                    <Input type="select" name="user_id" id="user" onChange={(e) => this.changeValue(e)} multiple required>
                        {
                            this.state.users.map((u) => (
                                <option key={u.id} value={u.id}>{u.name}</option>
                            ))
                        }
                    </Input>
                </FormGroup>
                    
                <FormGroup className="mb-2">
                    <Label htmlFor="product">Product</Label>
                    <Input type="select" name="product_id" id="product" onChange={(e) => this.changeValue(e)} required multiple>
                        {
                            this.state.products.map((p) => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))
                        }
                    </Input>
                </FormGroup>
                <div className="mb-5">
                    <Button type="submit" outline color="warning" >Thêm</Button>{' '}
                    <Button outline color="danger" onClick={this.handleClear.bind(this)}>Hủy</Button>
                </div>
                </Form>
            </div>
        )
    }
}