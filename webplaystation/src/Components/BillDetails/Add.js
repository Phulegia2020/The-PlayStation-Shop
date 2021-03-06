import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { get } from '../../Utils/httpHelper';

export default class Add extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            quantity: 0,
            bill_id: this.props.bill,
            product_id: "",
            products: [],
            billdetails: this.props.billDet,
            Error: "",
            key: "",
        }
    }
    
    componentDidMount(){
        get("/products/onSale")
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

    async handleCreate(event){
        event.preventDefault();
        var number = 0;
        await this.setState({
            product_id: event.target.product_id.value
        })
        await get(`/products/${this.state.product_id}`)
        .then((response) => {
            if (response.status === 200)
            {
                number = response.data.quantity;
            }
        })
        if (event.target.quantity.value.trim() <= 0)
        {
            this.setState({
                key: 'quantity'
            })
            this.setState({
                Error: "Số lượng không nhỏ hơn 1!"
            });
            return;
        }
        if (event.target.quantity.value.trim() > number)
        {
            this.setState({
                key: 'quantity'
            })
            this.setState({
                Error: "Máy này chỉ còn " + number + " máy"
            });
            return;
        }
        for (let i = 0; i < this.state.billdetails.length; i++)
        {
            if (event.target.product_id.value === this.state.billdetails[i].product_id)
            {
                this.setState({
                    key: 'product'
                })
                this.setState({
                    Error: "Máy này đã có trong hóa đơn!"
                });
                return;
            }
        }
        this.setState({
            key: '',
            Error: ''
        })
        this.props.onAdd(this.state);
    }

    handleClear = () => {
        this.setState({
            quantity: 0,
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
                    <Label htmlFor="quantity">Số Lượng</Label>
                    <Input type="number" name="quantity" id="quantity" placeholder="100" onChange={(e) => this.changeValue(e)} value = {this.state.quantity} required="required"/>
                    {this.state.key === 'quantity' ? <span style={{ color: "red", fontStyle:"italic"}}>{this.state.Error}</span> : '' }
                </FormGroup>
                
                <FormGroup className="mb-2">
                    <Label htmlFor="product">Máy</Label>
                    <select name="product_id" id="product" className="form-control" size="5" onChange={(e) => this.changeValue(e)} required>
                        {
                            this.state.products.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.name}
                                </option>
                            ))
                        }
                    </select>
                    {this.state.key === 'product' ? <span style={{ color: "red", fontStyle:"italic"}}>{this.state.Error}</span> : '' }
                </FormGroup>
                <div className="mb-5">
                    <Button type="submit" outline color="warning" >Tạo</Button>{' '}
                    <Button outline color="danger" onClick={this.handleClear.bind(this)}>Hủy</Button>
                </div>
                </Form>
            </div>
        )
    }
}
