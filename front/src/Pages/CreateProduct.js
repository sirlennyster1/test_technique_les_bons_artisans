import React from 'react'
import Navbar from '../Components/Navbar'
import styled from 'styled-components'
import { Alert, Button, Container, MenuItem, Select, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const FirstSection = styled(Container)`
    background-color: #cfe8fc;
    height: 100vh;
    width: 100vw;
    padding-top: 20px;
    display: flex;
    flex-direction: row;
    justify-content: center;
`;

const ContentFirstSection = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 90%;
`;

const FormDiv = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: auto;
    background-color: white;
    padding-left: 25px;
    padding-right: 25px;
    padding-top: 25px;
    padding-bottom: 25px;
`;

function CreateProduct() {

    const [msg, setMsg] = React.useState('');
    const [error, setError] = React.useState(null);
    const navigate = useNavigate();
    const [name, setName] = React.useState('');
    const [warranty_years, setWarranty_years] = React.useState('');
    const [price, setPrice] = React.useState('');
    const [rating, setRating] = React.useState('');
    const [type, setType] = React.useState('phone');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name === '' || warranty_years === '' || price === '' || rating === '') {
            setMsg('Please fill all the fields');
            setError(false);
            return;
        }
        
        axios.post('http://localhost:5000/products/create', {
            name: name,
            warranty_years: warranty_years,
            price: price,
            rating: rating,
            type: type
        },
        {
            headers: {
                'Content-Type': 'application/json', 
                'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
        })
        .then((response) => {
            console.log(response.data);
            if (response.data.createdProduct === true) {
                setError(response.data.createdProduct);
                setMsg(response.data.msg);
                setTimeout(() => {
                    navigate('/product/' + response.data.product._id);
                }, 2000);
            }
        })
        .catch((error) => {
            setError(error.response.data.error);
            setMsg(null);
        })
    }
        

    return (
        <FirstSection>
            <Navbar />
            <ContentFirstSection>
                <FormDiv>
                    <h1>Create Product</h1>
                    <Alert style={{ display: error == null ? "none" : "flex", width: "200", marginTop: 20, marginBottom: 20 }} severity={error != null && error === true ? "success" : "error"}>
                        {msg}
                    </Alert>
                    <TextField label="Name" style={{ marginBottom: 20 }} onChange={(e) => setName(e.target.value)} required /> 
                    <TextField label="Price" style={{ marginBottom: 20 }} type="number" onChange={(e) => setPrice(e.target.value)} required />
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
                    <TextField label="Warranty Years" type="number" style={{ marginBottom: 20 }} onChange={(e) => setWarranty_years(e.target.value)} />
                    <TextField label="Rating" type="number" style={{ marginBottom: 20 }} onChange={(e) => setRating(e.target.value)} InputProps={{ inputProps: { min: 0, max: 5 } }} />
                    <Button onClick={handleSubmit} variant="contained">Create Product</Button>
                </FormDiv>
            </ContentFirstSection>
        </FirstSection>
    )
}

export default CreateProduct