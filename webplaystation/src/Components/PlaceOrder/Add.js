import React, { Component } from 'react'
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { get } from '../../Utils/httpHelper';

export default class Add extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            total: 0,
            quantity: 0,
            user_id: localStorage.getItem('user_id'),
            supplier_id: "",
            suppliers: [],
            Error: "",
            key: "",
        }
    }
    
    componentDidMount(){
        get("/suppliers")
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({suppliers: response.data});
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
        await this.setState({
            supplier_id: event.target.supplier_id.value
        })
        this.props.onAdd(this.state);
    }

    handleClear = () => {
        this.setState({
            total: 0,
            quantity: 0,
            user_id: "",
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
                    <Label htmlFor="total">Tổng Tiền</Label>
                    <Input type="number" name="total" id="total" placeholder="VND" onChange={(e) => this.changeValue(e)} value = {this.state.total} disabled/>
                    {this.state.key === 'total' ? <span style={{ color: "red", fontStyle:"italic"}}>{this.state.Error}</span> : '' }
                </FormGroup>
                <FormGroup className="mb-2">
                    <Label htmlFor="supplier">Nhà Cung Cấp</Label>
                    <select name="supplier_id" id="supplier" className="form-control" size="5" onChange={(e) => this.changeValue(e)} required>
                        {
                            this.state.suppliers.map((sup) => (
                                <option key={sup.id} value={sup.id}>{sup.name}</option>
                            ))
                        }
                    </select>
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
