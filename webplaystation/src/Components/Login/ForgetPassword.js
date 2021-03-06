import React, { Component } from 'react'
import { get } from '../../Utils/httpHelper';
import { withRouter } from 'react-router-dom';
import "./Login.css";

class ForgetPassword extends Component {
    constructor(props) {
		super(props);
		this.state = {
            email: "",
            Error: "",
		    key: ""
        };
    }
    
    handleChange(e){
        this.setState({
            [e.target.name]: e.target.value.trim()
        });
    }

    handleForget(e)
    {
        e.preventDefault();
        get(`/users/email/${this.state.email}`)
        .then((response) => {
            if (response.status === 200)
            {
                this.props.history.push("/WebPlayStation/confirm", {email: this.state.email});
            }
        })
        .catch((error) => {
            this.setState({
                key: 'email'
            })
            this.setState({
                Error: "Email không hợp lệ."
            });
        });
    }

    render() {
        return (
            <div>
                <div className="forget-form">
                    <h2>Quên Mật Khẩu</h2>
                    <p>Nhập email liên kết với tài khoản của bạn để nhận mã OTP xác nhận mật khẩu mới.</p>
                    <h4>Địa chỉ Email: </h4>
                    <form onSubmit={(e) => this.handleForget(e)}>
                        <input type="email" name="email" onChange={(e) => this.handleChange(e)} placeholder="Nhập Email..." required></input>
                        <br/>
                        {this.state.key === 'email' ? <span style={{ color: "red", fontStyle:"italic"}}>{this.state.Error}<br/></span> : '' }
                        <button className="btn btn-success" type="submit">Gửi</button>
                    </form>
                </div>
            </div>
        )
    }
}
export default withRouter(ForgetPassword);