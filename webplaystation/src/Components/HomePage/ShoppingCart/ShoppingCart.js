import React, {Component} from 'react';
import { Header, Grid, Modal, Button, Icon } from 'semantic-ui-react';
import { get } from '../../../Utils/httpHelper';
import ShoppingCartDetails from "./ShoppingCartDetails";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class ShoppingCart extends Component {
    constructor (props){
        super(props);

        this.state = {
            open: true,
            bill: {},
            billDetails: [],
            user: {},
        }
        this.onCheckOut = this.onCheckOut.bind(this);
    }

    componentDidMount(){
        if (localStorage.getItem('user_id') !== null)
        {
            get(`/users/${localStorage.getItem('user_id')}`)
            .then((response) => {
                if (response.status === 200)
                {
                    this.setState({
                        user: response.data
                    })
                }
            })
        }
    }

    onCheckOut(){
        const shoppingCartItems = JSON.parse(localStorage.getItem('shopping-cart') || '[]');
        if (shoppingCartItems.length == 0)
        {
            toast.warning('Giỏ hàng trống!');
            return;
        }
        if (localStorage.getItem('user_id') === null)
        {
            toast.error('Hãy đăng nhập tài khoản để thanh toán giỏ hàng!');
            return;
        }
        window.location.href='/WebPlayStation/order';
    }

    handleNumberCart(data)
    {
        this.props.handleNumberCart(data);
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
                <Modal trigger={<Button animated='vertical' inverted style={{marginRight: '0.5em'}} className="shopping-cart">
                    <i
					class="fas fa-shopping-cart fa-x text-white"></i><span
                    class="cart-number">{this.props.numberCart}</span>
                                    <Button.Content visible>Giỏ Hàng</Button.Content>
                                    <Button.Content hidden>
                                        <Icon name='shop' />
                                        
                                    </Button.Content>
                                </Button>} >
                    <Modal.Header>Giỏ Hàng</Modal.Header>
                    <Modal.Content image>
                        <Modal.Description>
                            <Header>Chi Tiết</Header>
                            <Grid.Row>
                                <Grid.Column>
                                    <ShoppingCartDetails handleNumberCart={this.props.handleNumberCart}/>
                                </Grid.Column>
                            </Grid.Row>
                        </Modal.Description>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button positive icon='checkmark' labelPosition='right' content="Thanh Toán" onClick={this.onCheckOut}/>
                    </Modal.Actions>
                </Modal>
            </div>
        );
    }
}
export default ShoppingCart;