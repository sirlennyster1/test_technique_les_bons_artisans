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

export default function Register () {

    const [email, setEmail] = React.useState('');
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [msg, setMsg] = React.useState('');
    const [error, setError] = React.useState(null);
    const [register, setRegister] = React.useState(false);
    const navigate = useNavigate();

    const onChangeEmail = (e) => {
        setEmail(e.target.value);
    }

    const onChangeUsername = (e) => {
        setUsername(e.target.value);
    }

    const onChangePassword = (e) => {
        setPassword(e.target.value);
    }

    React.useEffect(() => {
        if(localStorage.getItem('token')) {
            navigate('/');
        }
    }, [])

    const handleRegister = () => {
        axios.post('http://localhost:5000/users/register', {
            email: email,
            password: password,
            username: username
        })
        .then((response) => {
            console.log(response.data);
            if(response.data.register === true) {
                setRegister(true);
                setMsg(response.data.msg);
                setError(true);
                localStorage.setItem('token', response.data.token);
                setTimeout(() => {
                    navigate('/');
                }, 2500);
            }
            else if (response.data.register === false) {
                setError(false);
                setMsg(response.data.msg);
            }
            else {
                setError(true);
                setMsg('Something went wrong');
            }
        })
        .catch((error) => {
            if (error.response.status === 400) {
                setError(false);
                setMsg('Something went wrong');
            }
            console.log(error);
        })
    }
    
    return (
        <FirstSection>
            <Navbar />
            <ContentFirstSection>
                <FormDiv>
                    <Typography variant='h1' style={{ fontSize: 20 }}>Register</Typography>
                    <Alert style={{ display: error == null ? "none" : "flex", width: "200", marginTop: 20 }} severity={error != null && error === true ? "success" : "error"}>
                        {msg}
                    </Alert>
                    <TextField id="outlined-basic" label="Email" variant="outlined" onChange={(e) => onChangeEmail(e)} style={{ marginBottom: 20, marginTop: 20 }} value={email} />
                    <TextField id="outlined-basic" label="Username" variant="outlined" onChange={(e) => onChangeUsername(e)} style={{ marginBottom: 20,}} value={username} />
                    <TextField id="outlined-basic" label="Password" type={'password'} variant="outlined" onChange={(e) => onChangePassword(e)} style={{ marginBottom: 20 }} value={password} />
                    <Button variant="contained" onClick={() => handleRegister()} disabled={register}>Register</Button>
                    <div style={{ display: "flex", flexDirection: "column", }}>
                        <Typography variant='h6' style={{ marginBottom: 10, marginTop: 10 }}>Already have an account ?</Typography>
                        <Button variant="contained" onClick={() => navigate('/login')}>Login</Button>
                    </div>
                </FormDiv>
            </ContentFirstSection>
        </FirstSection>
    )
}