import { BrowserRouter, Route, Routes } from "react-router";
import HomeScreen from "./pages/HomeScreen";
import CartScreen from "./pages/CartScreen";
import DetailScreen from "./pages/DetailScreen";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React from 'react';
import { ToastContainer } from 'react-toastify';

export default function App() {
  return (
    <BrowserRouter>
     <ToastContainer />
      <Routes >
        <Route path="/" element={<HomeScreen />} />
        <Route path="/product/:id" element={<DetailScreen />} />
        <Route path="/cart" element={<CartScreen />} />
      </Routes>
    </BrowserRouter>
  )
}
