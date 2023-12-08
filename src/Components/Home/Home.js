import React, { Component } from "react";
import { Link } from 'react-router-dom';
import "./Home.css";
import Pagination from "../Pagination/Pagination";
import Banner from "../Banner/Banner";
import NavScroll from "../NavScroll/NavScroll";

class Home extends Component {

  render() {
    return (
      <div>
        
        <NavScroll />
        <Banner />
        <Pagination />
        
      </div>
    );
  }
}

export default Home;
