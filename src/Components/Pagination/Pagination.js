import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import VideoComponent from "../VideoComponent/VideoComponent";
import API from '../Enviroment/API'
import './Pagination.css'

function Pagination() {
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const itemsPerPage = 6;
  const [pageCount, setPageCount] = useState(Math.ceil(100 / itemsPerPage));

  useEffect(() => {
    fetch(`${API}/videos/?page=${currentPage}`)
      .then((res) => res.json())
      .then((res) => {
        setData(res.results);
      })
      .catch((err) => {
        console.log(err);
      });
      
      fetch(`${API}/videos/num`)
      .then((data) => data.json())
      .then((data) => {
        setPageCount(Math.ceil(data.length / itemsPerPage));
      })
      .catch((error) => {
        console.log(error);
      });


  }, [currentPage]);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected + 1);
  };

  return (
    <div>
      {data.length > 0 && (
          <div className="videos">
            {data.map(video => (
                <div className="video" key={video.id}>

                <VideoComponent channel={false} id={video.id} title={video.title} thumbnail={video.thumbnail} creator_username={video.creator} />
                
                </div>
            ))}
            <footer className="footer">
            <ReactPaginate
                pageCount={pageCount}
                marginPagesDisplayed={1}
                pageRangeDisplayed={3}
                onPageChange={handlePageChange}
                containerClassName={"pagination"}
                activeClassName={"active"}
            />
            </footer>
        </div>
      )}
    </div>
  );
}

export default Pagination;
