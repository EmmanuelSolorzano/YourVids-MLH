import "./Channel.css";
import { useParams } from "react-router-dom";
import React from "react";
import PaginationChannel from "../Pagination/PaginationChannel";
import Banner from "../Banner/Banner";
import NavScroll from "../NavScroll/NavScroll";

function Channel() {
    const { creator } = useParams();
    

    return (
      <div>
        <NavScroll />
        <Banner />
        <PaginationChannel creator={creator} />
      </div>
    );
}

export default Channel;
