import React from 'react'
import { Container, Typography, useMediaQuery, createTheme } from '@mui/material';
import styled from 'styled-components';
import axios from 'axios';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import bg from '../Assets/Images/bg.jpg'; 
import 'burger-menu/lib/index.css';
import Navbar from '../Components/Navbar';
import { useNavigate } from 'react-router-dom';
import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:5000');


function Home() {

    const [products, setProducts] = React.useState([]);
    const navigate = useNavigate();
    const theme = createTheme({
        breakpoints: {
          values: {
            xs: 0,
            sm: 600,
            md: 900,
            lg: 1200,
            xl: 1536,
          },
        },
    });
    const matchDownMd = useMediaQuery(theme.breakpoints.down('sm'));

    React.useEffect(() => {
        axios.get('http://localhost:5000/products')
        .then((response) => {
            console.log(response.data);
            setProducts(response.data.all);
        })
        .catch((error) => {
            console.log(error);
        })
        if (localStorage.getItem('token')) {
            axios.get('http://localhost:5000/users/get-infos', {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            })
            .then((response) => {
                if(response.data.loggedIn === false) {
                    localStorage.removeItem('token');
                }
            })
        }
        socket.on('created', (products) => {
            setProducts(products)
        })
        socket.on('deleted', (products) =>{
            setProducts(products)
        })
        socket.on('updated', (products) => {
            setProducts(products)
        })
    }, []);

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

    const TitleFirstSection = styled(Typography)`
        color: #394d9c;
        font-weight: 900 !important;
        font-size: 110px !important;
        @media only screen and (max-width: 768px) {
            font-size: 60px !important;
        }
        @media only screen and (max-width: 480px) {
            font-size: 40px !important;
        }
    `;

    const SecondSection = styled(Container)`
        background-color: #fff;
        height: 100vh;
        width: 100vw;
        padding-top: 20px;
        display: flex;
        flex-direction: row;
        justify-content: center;
        @media only screen and (max-width: 480px) {
            
        }
    `;

    const TitleSecondSection = styled(Typography)`
        color: #394d9c;
        font-weight: 900 !important;
        font-size: 55px !important;
        @media only screen and (max-width: 768px) {
            font-size: 20px !important;
        }

    `;  

    const ListOfProducts = styled.div`
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 90%;
        width: 100%;
    `;

    const ImageListStyled = styled(ImageListItem)`
        &:hover {
            cursor: pointer;
        }
    `;

    return (
        <>
            <FirstSection>
                <Navbar />
                <ContentFirstSection>
                    <TitleFirstSection variant='h1'>
                        Telephones
                    </TitleFirstSection>
                </ContentFirstSection>
            </FirstSection>
            <SecondSection>
                <TitleSecondSection variant='h3'>
                    Last Products
                </TitleSecondSection>
                <p>Click on a item to see the product</p>
                <ListOfProducts>
                    {products.length > 0 ? (
                    <ImageList sx={{ columnCount: { xs: '1 !important', sm: '2 !important', md: '3 !important', lg: '4 !important', xl: '5 !important' } }}  rowHeight={164} cols={matchDownMd ? 1 : 2}>
                        {products.map((item) => (
                            <ImageListStyled key={item.img} onClick={() => navigate("/product/" + item._id) }>
                                <img
                                    srcSet={`${bg}?w=164&h=164&fit=crop&auto=format 1x,`}
                                    alt={item.title}
                                    loading="lazy"
                                    style={{ objectFit: 'cover', objectPosition: 'center', width: '100%', height: '100%' }}
                                />
                                <ImageListItemBar
                                    title={item.name + ' - ' + item.price + ' €'}
                                    subtitle={<span style={{ paddingTop: 25, paddingBottom: 25 }}>Rating: {item.rating}/5 - Garantie: {item.warranty_years} {item.warranty_years > 1 ? "years" : "year"}</span>}
                                />
                            </ImageListStyled>
                        ))}
                    </ImageList>
                    ) : (
                        <Typography variant='h5'>
                            No products
                        </Typography>
                    )}
                </ListOfProducts>
            </SecondSection>
        </>
    )
}

export default Home;