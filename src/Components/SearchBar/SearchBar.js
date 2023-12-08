import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import ReactSearchBox from "react-search-box";
import './SearchBar.css'
import API from '../Enviroment/API'
import URL from '../Enviroment/URL'

function SearchBar() {    
    const { id } = useState(1);
    const [results, setResults] = useState(null);
    const [place, setPlace] = useState("Search Something...");
    const [search, setSearch] = useState(null);

    useEffect(() => {
    fetch(`${API}/videos/list`)
      .then(res => res.json())
      .then(res => {
        setResults(res.results.slice(0,3));
      })
      .catch(err => {
        console.log(err);
      });
    }, [id]);

    const setSearchUser = (searchUser) =>{
        setSearch(searchUser);
        setPlace(searchUser);
      }
    
    const fetchSuggestions = (suggestion) =>{
        setSearchUser(suggestion)
        setPlace(suggestion);
        fetch(`${API}/videos/?title=${suggestion}`)
        .then(res => res.json())
        .then(res => {
        setResults(res.results.slice(0,3));
        })
        .catch(err => {
        console.log(err);
        });
    }

    const reloadPage = () =>{
        window.location.href = `${URL}/search/${search}`;
      }

  return (
    <div className="searchbar">
        {results &&
        <div>

        <div className="searchbar-container">
            <div className="searchbar">
                <ReactSearchBox
                    placeholder={place}
                    data={       
                        results.map(video => ({
                            key: video.id,
                            value: video.title
                        }))
                        
                        }
                    value={search}
                    onSelect={(value) => setSearchUser(value.item.value)}
                    onChange={(value) => fetchSuggestions(value)}
                    autoFocus
                />
            </div>
            <Link className="search-buttonP"  onClick={reloadPage}>
            <div className="search-button">
                Buscar
            </div>
            </Link>
        </div>
        </div>
        }

    </div>
  );
}

export default SearchBar;
