import React, { Component } from 'react'
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { get } from '../../Utils/httpHelper';

export default class Add extends Component {

    constructor(props)
    {
        super(props);
        this.state = {
            name: "",
            description: "",
            Error: "",
            key: "",
            categories: [],
        }
    }
    
    componentDidMount(){
        get("/categories")
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({categories: response.data});
            }
        })
        .catch(error => {console.log(error)})
    }

    changeName(e){
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    changeDescription(e){
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleCreate(event){
        event.preventDefault();

        for (let i = 0; i < this.state.categories.length; i++)
        {
            if (this.state.categories[i].name === event.target.name.value.trim())
            {
                this.setState({
                    key: 'name'
                })
                this.setState({
                    Error: "Tên loại này đã được sử dụng!"
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
            name: '',
            description: ''
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
                        <Label htmlFor="name">Tên</Label>
                        <Input type="text" name="name" id="name" placeholder="PS5" onChange={(e) => this.changeName(e)} value = {this.state.name} required="required"/>
                        {this.state.key === 'name' ? <span style={{ color: "red", fontStyle:"italic"}}>{this.state.Error}</span> : '' }
                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="description">Mô Tả</Label>
                        <Input type="text" name="description" id="description" placeholder="PlayStation 5" onChange={(e) => this.changeDescription(e)} value = {this.state.description} required="required"/>
                    </FormGroup>
                    
                    <div className="mt-3">
                        <Button type="submit" outline color="warning" >Thêm</Button>{' '}
                        <Button outline color="danger" onClick={this.handleClear.bind(this)}>Hủy</Button>
                    </div>
                </Form>
            </div>
        )
    }
}
