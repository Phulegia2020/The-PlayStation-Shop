import React, { Component } from 'react'
import { Col, Row, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { get } from '../../Utils/httpHelper';

export default class Add extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            name: "",
            description: "",
            quantity: 0,
            price: 0,
            imageurl: null,
            category_id: "1",
            supplier_id: "1",
            categories: [],
            suppliers: [],
            base64: "",
            products: [],
            Error: "",
            key: "",
        }
    }
    
    componentDidMount(){
        get("/products")
        .then((response) => {
            if (response.status === 200)
            {
                //console.log(response.data);
                this.setState({products: response.data});
            }
        })
        .catch(error => {console.log(error)})

        get("/categories")
        .then((response) => {
            if (response.status === 200)
            {
                //console.log(response.data);
                this.setState({
                    categories: response.data
                });
            }
        })

        get("/suppliers")
        .then((response) => {
            if (response.status === 200)
            {
                //console.log(response.data);
                this.setState({
                    suppliers: response.data
                });
            }
        })
    }

    convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = () => {
        resolve(fileReader.result);
        };
        fileReader.onerror = (error) => {
        reject(error);
        };
    });
    };

    uploadImage = async (e) => {
        const file = e.target.files[0];
        const base64 = await this.convertBase64(file);
        this.setState({
            base64: base64
        });
        const byteArr = this.state.base64.split(",");
        let photo = byteArr[1];
        this.setState({
            imageurl: photo
        });
    };

    changeValue(e){
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleCreate(event){
        event.preventDefault();

        if (event.target.quantity.value.trim() <= 0)
        {
            this.setState({
                key: 'quantity'
            })
            this.setState({
                Error: "Quantity is not less than 1!"
            });
            return;
        }
        if (event.target.price.value.trim() <= 0)
        {
            this.setState({
                key: 'price'
            })
            this.setState({
                Error: "Price is not less than 1!"
            });
            return;
        }
        for (let i = 0; i < this.state.products.length; i++)
        {
            if (this.state.products[i].name === event.target.name.value.trim())
            {
                this.setState({
                    key: 'name'
                })
                this.setState({
                    Error: "This name is existed!"
                });
                return;
            }
        }

        this.props.onAdd(this.state);
    }

    handleClear = () => {
        this.setState({
            name: "",
            description: "",
            quantity: 0,
            price: 0,
            //imageurl: null,
            category_id: "",
            supplier_id: "",
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
                    <Label for="name">Name</Label>
                    <Input type="text" name="name" id="name" placeholder="PlayStation 4" onChange={(e) => this.changeValue(e)} value = {this.state.name} required="required"/>
                    {this.state.key === 'name' ? <span style={{ color: "red", fontStyle:"italic"}}>{this.state.Error}</span> : '' }
                </FormGroup>
                <FormGroup>
                    <Label for="description">Description</Label>
                    <Input type="text" name="description" id="description" placeholder="PlayStation 4 Pro" onChange={(e) => this.changeValue(e)} value = {this.state.description} required="required"/>
                </FormGroup>
                <FormGroup>
                    <Label for="quantity">Quantity</Label>
                    <Input type="number" name="quantity" id="quantity" placeholder="1000" onChange={(e) => this.changeValue(e)} value = {this.state.quantity} required="required"/>
                    {this.state.key === 'quantity' ? <span style={{ color: "red", fontStyle:"italic"}}>{this.state.Error}</span> : '' }
                </FormGroup>
                <FormGroup>
                    <Label for="price">Price</Label>
                    <Input type="number" name="price" id="price" placeholder="1.000.000 VNĐ" onChange={(e) => this.changeValue(e)} value = {this.state.price} required="required"/>
                    {this.state.key === 'price' ? <span style={{ color: "red", fontStyle:"italic"}}>{this.state.Error}</span> : '' }
                </FormGroup>
                <FormGroup>
                    <Label for="image">Image</Label>
                    <br></br>
                    <Input type="file" name="image" id="image" accept=".jpeg, .png, .jpg" onChange={(e) => {this.uploadImage(e);}} required="required"/>
                </FormGroup>
                <FormGroup className="mb-2">
                    <Label for="category">Category</Label>
                    <Input type="select" name="category_id" id="category" value = {this.state.category_id} onChange={(e) => this.changeValue(e)}>
                        {
                            this.state.categories.map((c) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))
                        }
                    </Input>
                </FormGroup>
                <FormGroup className="mb-5">
                    <Label for="supplier">Supplier</Label>
                    <Input type="select" name="supplier_id" id="supplier" value = {this.state.supplier_id} onChange={(e) => this.changeValue(e)}>
                        {
                            this.state.suppliers.map((s) => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))
                        }
                    </Input>
                </FormGroup>
                <div className="mb-5">
                    <Button type="submit" outline color="warning" >Add</Button>{' '}
                    <Button outline color="danger" onClick={this.handleClear.bind(this)}>Cancel</Button>
                </div>
                </Form>
            </div>
        )
    }
}
