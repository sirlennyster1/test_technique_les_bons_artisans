import React from 'react';
import { Route, Routes } from "react-router-dom";
import CreateProduct from "./Pages/CreateProduct";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Logout from "./Pages/Logout";
import Register from "./Pages/Register";
import SingleProduct from "./Pages/SingleProduct";


function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/product/:id" element={<SingleProduct />} />
        <Route path="/create-product" element={<CreateProduct />} />
        <Route path='/logout' element={<Logout />} />
        <Route path="*" element={<h1>404</h1>} />
      </Routes>
    </>
  );
}

export default App;
