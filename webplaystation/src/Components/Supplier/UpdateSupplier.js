import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { checkPhoneNumber } from '../../Utils/Utils';
import { get, put } from '../../Utils/httpHelper';
import "../Category/Category.css";

class UpdateSupplier extends Component {
    state = {
        id: this.props.match.params.id,
        name: "",
        address: "",
        phone: "",
        status: "",
        Error: "",
        key: "",
        suppliers: []
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

        get(`/suppliers/${this.state.id}`)
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({
                    name: response.data.name,
                    address: response.data.address,
                    phone: response.data.phone,
                    status: response.data.status
                })
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

        for (let i = 0; i < this.state.suppliers.length; i++)
        {
            if (this.state.suppliers[i].id != this.state.id)
            {
                if (this.state.suppliers[i].name === event.target.name.value.trim())
                {
                    this.setState({
                        key: 'supplier'
                    })
                    this.setState({
                        Error: "Tên nhà cung cấp đã có tại cửa hàng!"
                    });
                    return;
                }
                if (this.state.suppliers[i].address === event.target.address.value.trim())
            {
                this.setState({
                    key: 'address'
                })
                this.setState({
                    Error: "Địa chỉ nhà cung cấp đã có tại của hàng!"
                });
                return;
            }
                if (this.state.suppliers[i].phone === event.target.phone.value.trim())
                {
                    this.setState({
                        key: 'phone'
                    })
                    this.setState({
                        Error: "Số điện thoại nhà cung cấp đã có tại cửa hàng!"
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
                Error: "Số điện thoại nên bắt đầu bằng số 0!"
            });
            return;
        }
        put(`/suppliers/${this.state.id}`, {name: this.state.name.trim(), address: this.state.address.trim(), phone: this.state.phone.trim(), status: this.state.status})
        .then((response) => {
            if (response.status === 200)
            {
                this.props.history.push("/admin/supplier");
            }
        })
        .catch((error) => {console.log(error)});
    }

    handleClear = () => {
        this.setState({
            name: '',
            address: '',
            phone: '',
        });
        this.props.history.push("/admin/supplier");
    }

    componentWillUnmount() {
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state,callback)=>{
            return;
        };
    }

    render() {
        return (
            <div className="update-form">
                <h3>Cập Nhật Nhà Cung Cấp</h3>
                <Form onSubmit={(event) => this.handleUpdate(event)}>
                    <FormGroup>
                        <Label htmlFor="name">Tên</Label>
                        <Input type="text" name="name" id="name" placeholder="PS5" onChange={(e) => this.changeValue(e)} value = {this.state.name} required="required" disabled={this.state.status === 'Inactive'}/>
                        {this.state.key === 'supplier' ? <span style={{ color: "red", fontStyle:"italic"}}>{this.state.Error}</span> : '' }
                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="address">Địa Chỉ</Label>
                        <Input type="text" name="address" id="address" placeholder="1 Đường, Phường 2, Quận 3, Thành phố Hồ Chí Minh" onChange={(e) => this.changeValue(e)} value = {this.state.address} required="required" disabled={this.state.status === 'Inactive'}/>
                        {this.state.key === 'address' ? <span style={{ color: "red", fontStyle:"italic"}}>{this.state.Error}</span> : '' }
                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="phone">Số Điện Thoại</Label>
                        <Input type="text" name="phone" id="phone" minLength="10" maxLength="10" placeholder="0123456789" onChange={(e) => this.changeValue(e)} value = {this.state.phone} required="required" disabled={this.state.status === 'Inactive'}/>
                        {this.state.key === 'phone' ? <span style={{ color: "red", fontStyle:"italic"}}>{this.state.Error}</span> : '' }
                    </FormGroup>
                    <div className="mt-3">
                        <Button type="submit" outline color="warning">Cập Nhật</Button>{' '}
                        <Button outline color="danger" onClick={this.handleClear.bind(this)}>Hủy</Button>
                    </div>
                </Form>
            </div>
        )
    }
}
export default withRouter(UpdateSupplier);