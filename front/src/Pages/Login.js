import React from 'react';
import styled from 'styled-components';
import { Container, Typography, Button, TextField, Alert } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Components/Navbar';

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

export default function Login () {

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [msg, setMsg] = React.useState('');
    const [error, setError] = React.useState(null);
    const [login, setLogin] = React.useState(false);
    const navigate = useNavigate();

    const onChangeEmail = (e) => {
        setEmail(e.target.value);
    }

    const onChangePassword = (e) => {
        setPassword(e.target.value);
    }

    React.useEffect(() => {
        if(localStorage.getItem('token')) {
            navigate('/');
        }
    }, [])

    const handleLogin = () => {
        axios.post('http://localhost:5000/users/login', {
            email: email,
            password: password
        })
        .then((response) => {
            console.log(response.data);
            if(response.data.login === true) {
                setLogin(true);
                setMsg(response.data.msg);
                setError(true);
                localStorage.setItem('token', response.data.token);
                setTimeout(() => {
                    navigate('/');
                }, 2000);
            }
            else if (response.data.login === false) {
                setError(false);
                setMsg(response.data.msg);
            }
            else {
                setError(false);
                setMsg('Something went wrong');
            }
        })
        .catch((error) => {
            if (error.response.status === 400) {
                setError(false);
                setMsg('Veuillez remplir tous les champs');
            }
            console.log(error);
        })
    }
    
    return (
        <FirstSection>
            <Navbar />
            <ContentFirstSection>
                <FormDiv>
                    <Typography variant='h1' style={{ fontSize: 20 }}>Login</Typography>
                    <Alert style={{ display: error == null ? "none" : "flex", width: "200", marginTop: 20 }} severity={error != null && error === true ? "success" : "error"}>
                        {msg}
                    </Alert>
                    <TextField id="outlined-basic" label="Email" variant="outlined" onChange={(e) => onChangeEmail(e)} style={{ marginBottom: 20, marginTop: 20 }} value={email} />
                    <TextField id="outlined-basic" label="Password" type={'password'} variant="outlined" onChange={(e) => onChangePassword(e)} style={{ marginBottom: 20 }} value={password} />
                    <Button variant="contained" onClick={() => handleLogin()} disabled={login}>Login</Button>
                    <div style={{ display: "flex", flexDirection: "column", }}>
                        <Typography variant='h6' style={{ marginBottom: 10, marginTop: 10 }}>You do not have an account?</Typography>
                        <Button variant="contained" onClick={() => navigate('/register')}>Register</Button>
                    </div>
                </FormDiv>
            </ContentFirstSection>
        </FirstSection>
    )
}
