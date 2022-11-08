import React from 'react'
import { Typography, Button } from '@mui/material';
import styled from 'styled-components';
import { Menu, Item } from "burger-menu";
import 'burger-menu/lib/index.css';
import jwt_decode from "jwt-decode";
import {IoPerson} from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';


const RowNavbar = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
`;

const TypographyHome = styled(Typography)`
    color: #394d9c;
    font-weight: 900 !important;
    font-size: 55px !important;
    &:hover {
        cursor: pointer;
    }
    @media only screen and (max-width: 768px) {
        font-size: 30px !important;
    }
`;

function Navbar() {
    const [isOpen, setIsOpen] = React.useState(false);
    const navigate = useNavigate();

   function Logout() {
        localStorage.removeItem('token');
        window.location.replace("/");
    }

    return (
        <RowNavbar>
            <TypographyHome variant='h1' onClick={() => navigate('/') }>
                Shop*
            </TypographyHome>
            <Button
                id="basic-button"
                onClick={() => setIsOpen(!isOpen)}
                style={{ color: '#394d9c', fontWeight: '900', fontSize: '15px', height: 60 }}
            >
                <IoPerson style={{ marginRight: 5 }} />
                {localStorage.getItem('token') ?  jwt_decode(localStorage.getItem('token')).email : "Menu"}
            </Button>
            <Menu className="burger-menu" isOpen={isOpen} selectedKey={'entry'} onClose={() => setIsOpen(false)}>
                {!localStorage.getItem('token') ? (
                    <>
                        <Item key="login" text='Login' onClick={() => navigate('/login')}>
                            <p>Login</p>
                        </Item>
                        <Item key="entry" text='Register' onClick={() => navigate('/register')}>Register</Item>
                    </>
                ) : (
                    <>
                        <Item key="entry" text='Logout' onClick={() => Logout()}>
                            <p>Logout</p>
                        </Item>
                    </>
                )}
            </Menu>
        </RowNavbar>
    )
  }
  
  export default Navbar;