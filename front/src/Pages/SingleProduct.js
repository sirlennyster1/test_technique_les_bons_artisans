import React from 'react'
import { Container, Typography, Button, Modal, TextField, Box, Select, MenuItem, Alert, Switch } from '@mui/material';
import styled from 'styled-components';
import axios from 'axios';
import { useParams } from 'react-router';
import Navbar from '../Components/Navbar';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import iPhone from '../Assets/Images/iphonejpg.jpg';
import openSocket from 'socket.io-client';
import { Link } from 'react-router-dom';
const socket = openSocket('http://localhost:5000');

const FirstSection = styled(Container)`
    background-color: #cfe8fc;
    height: 100vh;
    width: 100vw;
    padding-top: 20px;
    display: flex;
    flex-direction: column;
`;

const ContentFirstSection = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 90%;
`;

function SingleProduct() {

    const [product, setProduct] = React.useState({});
    const { id } = useParams();
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [name, setName] = React.useState('');
    const [warranty_years, setWarranty_years] = React.useState('');
    const [price, setPrice] = React.useState('');
    const [rating, setRating] = React.useState('');
    const [type, setType] = React.useState('');
    const [msg, setMsg] = React.useState('');
    const [error, setError] = React.useState(null);
    const [deleted, setDeleted] = React.useState(false);
    const [toggled, setToggled] = React.useState(false);

    React.useEffect(() => {
        axios.get('http://localhost:5000/products/' + id)
        .then((response) => {
            setProduct(response.data.product);
            setType(response.data.product.type);
            setName(response.data.product.name);
            setWarranty_years(response.data.product.warranty_years);
            setPrice(response.data.product.price);
            setRating(response.data.product.rating);
            setToggled(response.data.product.available);
        })
        .catch((error) => {
            console.log(error);
        })
        socket.on('update', (product) => {
            setProduct(product);
        })
    }, [id]);

    const handleUpdate = () => {
        axios.put('http://localhost:5000/products/' + product._id, {
            name: name,
            warranty_years: warranty_years,
            price: price,
            rating: rating,
            type: type, 
            available: toggled
        }, 
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
        .then((response) => {
            console.log(response.data);
            handleClose();
        })
        .catch((error) => {
            console.log(error);
        })
    }

    const handleDelete = () => {
        axios.delete('http://localhost:5000/products/' + product._id, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
        .then((response) => {
            console.log(response.data);
            setError(true);
            setDeleted(true);
            setMsg('Product deleted successfully, you will be redirected to the home page');
            setTimeout(() => {
                window.location.href = '/';
            }, 3000);
        })
        .catch((error) => {
            console.log(error);
        })
    }

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: '#fff',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
        display: 'flex',
        flexDirection: 'column',
    };

    if(!product) {
        return(
            <>
                <h1>404</h1>
                <Link to={'/'}>Back to the Homepage</Link>
            </>
        )
    }

    return (
        <FirstSection>
            <Navbar />
            <ContentFirstSection>
                <Alert severity="success" style={{ display: error === null ? "none" : "flex", marginBottom: 15 }}>{msg}</Alert>
                <Card sx={{ maxWidth: 345 }}>
                        <CardMedia
                            component="img"
                            height="140"
                            image={iPhone}
                            alt="green iguana"
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                            {product.name} - {product.price}€
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Type: {product.type}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Warranty: {product.warranty_years} years
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Rating: {product.rating} / 5 
                            </Typography>
                        </CardContent>
                        {localStorage.getItem('token') ? (
                            
                        <CardActions>
                            <Button size="small" onClick={handleOpen}>Edit</Button>
                            <Button size="small" onClick={() => handleDelete()} disabled={deleted}>Delete</Button>
                        </CardActions>
                        ) : null}
                    </Card>
            </ContentFirstSection>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <h1>Edit Product</h1>
                    <p>Veuillez remplir tous les champs</p>
                    <TextField id="outlined-basic" label="Name" variant="outlined" style={{ marginBottom: 20 }} value={name} onChange={(e) => setName(e.target.value)} />
                    <TextField id="outlined-basic" type="number" label="Price" variant="outlined" style={{ marginBottom: 20 }} value={price} onChange={(e) => setPrice(e.target.value)} />
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={type}
                        label="Type"
                        onChange={(e) => setType(e.target.value)}
                        style={{ marginBottom: 20 }}
                    >
                        <MenuItem value={'phone'}>Phone</MenuItem>
                        <MenuItem value={'computer'}>Computer</MenuItem>
                    </Select>
                    <TextField id="outlined-basic" label="Warranty Years" type="number" variant="outlined" style={{ marginBottom: 20 }} value={warranty_years} onChange={(e) => setWarranty_years(e.target.value)}  />
                    <TextField id="outlined-basic" label="Rating" type="number" variant="outlined" style={{ marginBottom: 20 }} value={rating} onChange={(e) => setRating(e.target.value)} />
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <p>Availability</p>
                        <Switch checked={toggled} onChange={() => setToggled(!toggled)} style={{ marginBottom: 20 }} /> 
                    </div>
                    <Button onClick={() => handleUpdate()}>Save</Button>
                </Box>
            </Modal>
        </FirstSection>
    )
}

export default SingleProduct