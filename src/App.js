import React from "react";
import { Routes ,Route, BrowserRouter } from 'react-router-dom';
import Index from "./pages/Index/Index";
import Home from "./pages/Home/Home";
import Layout from "./components/Layout";
import './App.css';

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route>
            <Route path="/" element={<Index />}/>
          </Route>
            <Route element={<Layout />}>
                <Route path="/home" element={<Home />} />
            </Route>
        </Routes>
      </BrowserRouter>
  );
}

export default App;
