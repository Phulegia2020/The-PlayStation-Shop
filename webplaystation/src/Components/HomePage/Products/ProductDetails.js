import React, {Component} from 'react';
import {Icon, Segment, Grid, Header, Rating, Divider, Table, Message, Comment, Button, Form} from 'semantic-ui-react'
import ButtonAddToCart from "./ButtonAddToCart";
import { get, post, put } from '../../../Utils/httpHelper';
import { formatCurrency, formatQuantity } from '../../../Utils/Utils';
import { withRouter } from "react-router";
import './style.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class ProductDetails extends Component {
    constructor(props) {
        super(props);

        this.state = {
            Product: {},
            rate: 0,
            user_id: '',
            product_id: this.props.match.params.id,
            proByRate: [],
            totalrating: 0,
            comments: [],
            content: '',
            proHint: [],
            redirect : false,
            image: '',
            images: []
        };
        this.onRating = this.onRating.bind(this);
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        this.state.ShoppingCartItems = JSON.parse(localStorage.getItem('shopping-cart') || '[]');
        get(`/products/${this.props.match.params.id}`)
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({
                    Product: response.data,
                    totalrating: response.data.totalrating,
                    image: response.data.url_image
                });
                get(`/products/search?categoryId=${this.state.Product.category.id}`)
                .then((response) => {
                    this.setState({
                        proHint: response.data.slice(0, 5)
                    });
                })
                .catch(error => console.log(error));
            }
        })

        this.setState({
            user_id: localStorage.getItem('user_id'),
        })

        get(`/ratings/product/${this.state.product_id}`)
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({
                    proByRate: response.data
                })
            }
        })
        .catch(error => console.log(error));

        if (localStorage.getItem('user_id') != null)
        {
            get(`/ratings/search?userId=${localStorage.getItem('user_id')}&productId=${this.state.product_id}`)
            .then((response) => {
                if (response.status === 200)
                {
                    this.setState({
                        rate: response.data
                    })
                }
            })
            .catch((error) => {console.log(error)});
        }
        
        get(`/comments/product/${this.state.product_id}`)
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({
                    comments: response.data
                })
            }
        })
        .catch(error => console.log(error));

        get(`/productImages/product/${this.props.match.params.id}`)
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({
                    images: response.data
                }, () => console.log(this.state.images));
            }
        })
        .catch(error => console.log(error));
    }

    onCheckRated(user_id)
    {
        for (var i = 0; i < this.state.proByRate.length; i++)
        {
            if (this.state.proByRate[i].user_id === user_id)
            {
                return true;
            }
        }
    }

    async onRating(event, data){
        event.preventDefault();
        if (localStorage.getItem('user_id') === null)
        {
            toast.warning("Vui l??ng ????ng nh???p ????? ????nh gi?? s???n ph???m!")
            return;
        }
        if (data.rating !== 0)
        {
            await this.setState({
                rate: data.rating,
            });
            if (this.state.rate !== 0)
            {
                if (this.onCheckRated(this.state.user_id) === true)
                {
                    toast.warning("B???n ???? ????nh gi?? s???n ph???m n??y. C??m ??n!")
                }
                else
                {
                    post("/ratings", {ratingPoint: this.state.rate, user_id: this.state.user_id, product_id: this.state.product_id})
                    .then((response) => {
                        if (response.status === 200)
                        {
                            this.handleTotalRating();
                            this.handleUpdateRating(this.state.product_id, this.state.Product);
                            toast.success("C??m ??n ???? ????nh gi?? ??i???m");
                        }
                    })
                }
            }
        }
    }

    handleUpdateRating(id, data){
        put(`/products/${id}`, {name: data.name, description: data.description, quantity: data.quantity, price: data.price,
                                url_image: data.url_image ,totalrating: this.state.totalrating ,category_id: data.category.id, supplier_id: data.supplier.id,
                                status: data.status})
        .then((response) => {
            if (response.status === 200)
            {
            }
        })
    }

    handleTotalRating = () => {
        var sumrating = this.state.rate;
        for (var i = 0; i < this.state.proByRate.length; i++)
        {
            if (this.state.proByRate[i].user_id !== this.state.user_id)
            {
                sumrating = sumrating + this.state.proByRate[i].ratingPoint;
            }
        }
        var total = Math.round((sumrating) / (this.state.proByRate.length+1));
        this.setState({
            totalrating: total,
        });
    }

    changeValue(e){
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleComment = (e) => {
        e.preventDefault();
        const body = JSON.stringify({
            content: e.target.content.value.trim(),
            user_id: localStorage.getItem('user_id'),
            username: localStorage.getItem('username'),
            product_id: this.state.product_id
        });
        post('/comments', body)
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({
                    comments: [...this.state.comments, response.data],
                    content: ''
                });
            }
        })
        .catch((error) => toast.warning("Vui l??ng ????ng nh???p ????? b??nh lu???n!"));
    }

    notification = () => toast.success("???? th??m s???n ph???m v??o gi??? h??ng");

    handleProductHint = (e, id) => {
        e.preventDefault();
        this.props.history.push(`/WebPlayStation/product/${id}`)
    }

    handlePicture = (e, data) => {
        this.setState({
            image: data
        });
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
        const product = this.state.Product;
        return (
            <div className="product-detail">
            <Segment style={{padding: '2em 0em', minHeight: 500}} vertical>
                <Grid container stackable verticalAlign='middle'>
                    <Grid.Row className="table-product">
                        <Grid.Column width={4}>
                            <img src={this.state.image} alt='PlayStation' className='img-border'/>
                            <div className={this.state.images.length > 3 ? "sub-picture-more" : 'sub-picture'}>
                                {this.state.images.length > 0 && <img src={product.url_image} alt='PlayStation' onClick={(e) => this.handlePicture(e, product.url_image)} className="image-main"/>}
                                {this.state.images.map((picture, index) => (
                                    <img src={picture.imagePath} alt='PlayStation' onClick={(e) => this.handlePicture(e, picture.imagePath)} key={index}/>
                                ))}
                            </div>
                        </Grid.Column>
                        <Grid.Column width={12}>
                            <Header as="h1">{product.name}</Header>
                            <hr/>
                            <p style={{ fontSize: '1.33em' }} className="figure-description"><b>Th??ng Tin: </b>{product.description}</p>
                            <hr/>
                            <p style={{ fontSize: '1.33em' }} className="figure"><b>Gi??: </b>{formatCurrency(product.price)}</p>
                            <hr/>
                            <p style={{ fontSize: '1.33em' }} className="figure"><b>????nh Gi??: </b><Rating icon='star'  maxRating={5} onRate={this.onRating} name="rate" rating={this.state.totalrating} disabled/>({product.totalrating} / 5)</p>
                            <Message info>
                                <Message.Header>Li??n h??? Mua S???n Ph???m: (028) 38.295.258</Message.Header>
                                <p>Vui L??ng Ki???m Tra S??? L?????ng C???a S???n Ph???m Tr?????c Khi T???i C???a H??ng!</p>
                            </Message>
                            <Message warning>
                            <Message.Header>CAM K???T & CH??NH S??CH</Message.Header>
                                <p>Gi?? ??p d???ng khi mua k??m game b???t k???. 
                                    Giao h??ng mi???n ph?? trong v??ng 1 - 2 ng??y t???i n???i th??nh HCM (*)</p>
                            </Message>
                            <Header as="h4">
                                <ButtonAddToCart product={product} notification={this.notification} handleNumberCart={this.props.handleNumberCart}/>
                            </Header>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Divider horizontal >
                            <Header as='h4'>
                                <Icon name='tag' />
                                M???T S??? M?? T??? KH??C
                            </Header>
                        </Divider>

                        <Table definition>
                            <Table.Body>
                                <Table.Row>
                                    <Table.Cell width={3}>Nh?? S???n Xu???t</Table.Cell>
                                    <Table.Cell>{this.state.Product.supplier?.name}</Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>Lo???i M??y</Table.Cell>
                                    <Table.Cell>{product.category?.description}</Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>Th???i H???n B???o H??nh</Table.Cell>
                                    <Table.Cell>3 N??m</Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>S??? L?????ng C??n L???i</Table.Cell>
                                    <Table.Cell>{product.quantity === 0 ? 'H???t H??ng' : `${formatQuantity(product.quantity)} M??y`}</Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        </Table>
                    </Grid.Row>

                    <Grid.Row>
                        <Divider horizontal >
                                <Header as='h4'>
                                    <Icon name='star' />
                                    ????NH GI?? C???A B???N
                                </Header>
                        </Divider>
                        <Grid.Column width={12} style={{marginLeft: '36em'}}>
                            
                            <Rating icon='star' maxRating={5} name="rate" size="huge" rating={this.state.rate} onRate={this.onRating}/>
                            
                        </Grid.Column>
                    </Grid.Row>

                    <Grid.Row>
                        <Divider horizontal >
                                <Header as='h4'>
                                    <Icon name='comment' />
                                    B??NH LU???N ({this.state.comments.length})
                                </Header>
                        </Divider>
                        <Grid.Column className="grid-comments" width={16} style={{marginLeft: '18em'}}>
                            <Comment.Group>
                                <div className='scroll-table'>
                                    {this.state.comments.map((comment, index) => (
                                        this.state.comments.length > 0 && (
                                            
                                                <Comment key={index}>
                                                    <Comment.Avatar as='a' src='https://www.kindpng.com/picc/m/130-1300217_user-icon-member-icon-png-transparent-png.png' />
                                                    <Comment.Content>
                                                        <Comment.Author>{comment.username}</Comment.Author>
                                                        <Comment.Metadata>{comment.date_comment}
                                                        </Comment.Metadata>
                                                        <Comment.Text>{comment.content}
                                                        </Comment.Text>
                                                    </Comment.Content>
                                                </Comment>
                                        )
                                    ))}    
                                </div>
                                <Form reply onSubmit={(e) => this.handleComment(e)}>
                                    <textarea name='content' rows='3' style={{ resize: 'none', marginBottom: '5px' }} onChange={(e) => this.changeValue(e)} value={this.state.content} required></textarea>
                                    <Button content='????ng' labelPosition='left' icon='edit' primary/>
                                </Form>
                            </Comment.Group>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <div className="product-hint">
                            <Icon name='tags' size="large"></Icon>{' '}
                            <span><b>G???i ??: </b></span>
                            {this.state.proHint.map((p, index) => (
                                p.id !== parseInt(this.state.product_id) &&
                                <a href={`/WebPlayStation/product/${p.id}`} key={index}>M??y {p.name} </a>
                            ))}
                            <span>...</span>
                        </div>
                    </Grid.Row>
                </Grid>
            </Segment>
            <ToastContainer position="top-right"
                    autoClose={1500}
                    hideProgressBar
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover/>
            </div>
        );
    }
}

export default withRouter(ProductDetails);
