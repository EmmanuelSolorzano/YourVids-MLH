import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import API from '../Enviroment/API'
import './Pagination.css'
import SearchBar from "../SearchBar/SearchBar";
import VideoComponent from "../VideoComponent/VideoComponent";
import NavScroll from "../NavScroll/NavScroll";


function PaginationChannel(props) {
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const itemsPerPage = 6;
  const [pageCount, setPageCount] = useState(Math.ceil(100 / itemsPerPage));
  const creator = props.creator;
const [userData, setUserData] = useState(null);


  useEffect(() => {
    setUserData(JSON.parse(localStorage.getItem('userData')));
    fetch(`${API}/videos/num/?creator__username=${creator}`)
      .then((data) => data.json())
      .then((data) => {
        setPageCount(Math.ceil(data.length / itemsPerPage));
      })
      .catch((error) => {
        console.log(error);
      });

    fetch(`${API}/videos/all/?creator__username=${creator}&page=${currentPage}`)
      .then((res) => res.json())
      .then((res) => {
        setData(res.results);
        
      })
      .catch((err) => {
        console.log(err);
      });
  }, [currentPage], [creator]);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected + 1);
  };

  return (
    <div>
        
      {data.length > 0 && (
          data && 
            <div className="videos">
                {data.map(video => (
                    <div className="video" key={video.id}>
                    {userData ? (
                        <VideoComponent channel={true} id={video.id} title={video.title} thumbnail={video.thumbnail} creator_username={video.creator} creator_video={userData.username} description={video.description} public={video.listed}/>                              
                    ) :
                    (
                        <VideoComponent channel={false} id={video.id} title={video.title} thumbnail={video.thumbnail} creator_username={video.creator} />                              
                    )}
                    
                    </div>                      
                ))}
            </div>
      )}

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
  );
}

export default PaginationChannel;
