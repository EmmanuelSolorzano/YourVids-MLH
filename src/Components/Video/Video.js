import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import Banner from "../Banner/Banner";
import NavScroll from "../NavScroll/NavScroll";
import ReactPlayer from 'react-player/lazy'
import { Link } from 'react-router-dom';
import './Video.css'
import PaginationResults from "../Pagination/PaginationResults";
import API from '../Enviroment/API'
import Plyr from 'plyr';
import 'plyr/dist/plyr.css';
import Comments from "../Comments/Comments";
import { Avatar } from "@mui/material";
import AuthService from "../AuthService/AuthService";
import { Button, ButtonGroup } from "react-bootstrap";
import { Api } from "@mui/icons-material";

function Video() {
  const { id } = useParams();
  const [videoData, setVideoData] = useState(null);
  const [avatar, setAvatar] = useState("");
  const [results, setResults] = useState(null);
  const videoRef = useRef(null);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [activeLike, setActiveLike] = useState(false);
  const [activeDislike, setActiveDislike] = useState(false);
  const [disableLikes, setDisableLikes] = useState(true);
  const [notUpdated, setNotUpdated] = useState(false);
  const [seen, setSeen] = useState(false);
  const [messageShare, setMessageShare] = useState(null);

  useEffect(() => {
    if(localStorage.getItem('userData') !== null){
      setDisableLikes(false);
    }
    fetch(`${API}/videos/list/${id}`)
      .then(res => res.json())
      .then(data => {
        fetchResults(data.title)
        setVideoData(data);
        if(data.description === ""){
          setMessageShare(`${data.title}\nhttps://yourvids.live/video/${data.id}`)
        }
        else{
        setMessageShare(`${data.title}\n${data.description}\nhttps://yourvids.live/video/${data.id}`)
        }
        setLikes(data.likes.length);
        setDislikes(data.dislikes.length);
        if(localStorage.getItem('userData') !== null){
          if(data.likes.includes(JSON.parse(localStorage.getItem('userData')).id)){
            setActiveLike(true);
          }
          if(data.dislikes.includes(JSON.parse(localStorage.getItem('userData')).id)){
            setActiveDislike(true);
          }
          if(localStorage.getItem('userData').id === null){
            setNotUpdated(true);
          }
        }
        setAvatar(data.creator.charAt(0).toUpperCase());
      })
      .catch(err => {
        console.log(err);
      });
  }, [id]);

  const fetchResults = (title) =>{
    fetch(`${API}/videos/?title=${title}`)
    .then(res => res.json())
    .then(data => {
      setResults(data.results);
      console.log(data.results);
    })
    .catch(err => {
      console.log(err);
    });
  }


  function likeVideo () {
    if (activeDislike){
      dislikeVideo();
    }
    let formData = new FormData();
    formData.append('user', JSON.parse(localStorage.getItem('userData')).id);
    AuthService.requestWithRefresh({
      method: 'PATCH',
      url: `${API}/videos/likes/${id}/`,
      body: formData,
      headers:{
          'accept': 'application/json',
      }
  })
  .then(res => {
    console.log("res:",res);
    setLikes(res.likes.length);
    setActiveLike(!activeLike);
  })
  .catch(err => {
    console.log("error:",err);
  })
  }

  function dislikeVideo () {
    if(activeLike){
      likeVideo();
    }
    let formData = new FormData();
    formData.append('user', JSON.parse(localStorage.getItem('userData')).id);
    AuthService.requestWithRefresh({
      method: 'PATCH',
      url: `${API}/videos/dislikes/${id}/`,
      body: formData,
      headers:{
          'accept': 'application/json',
      }
  })
  .then(res => {
    console.log("res:",res);
    setDislikes(res.dislikes.length);
    setActiveDislike(!activeDislike);
  })
  .catch(err => {
    console.log("error:",err);
  })
  }

    const handleCompartirClick = () => {
      const videoUrl = `https://yourvids.live/video/${id}`;
      if (navigator.share) {
        navigator.share({
          text: messageShare,
          url: videoUrl,
        })
        .then(() => console.log('Video compartido con éxito'))
        .catch((error) => console.error('Error al compartir:', error));
      } else {
        console.warn('La API de uso compartido no está disponible en este navegador.');
        const whatsappLink = `https://api.whatsapp.com/send?text=${encodeURIComponent(messageShare)}`;
        window.open(whatsappLink, '_blank');
      }
    };

  useEffect(() => {
    if(seen){
      fetch(`${API}/videos/views/${id}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error en la solicitud GET');
        }
        return response.json();
      })
      .then(data => {                  
        console.log("VIDEO VISTO");
      })
      .catch(error => {
        console.error('Error al realizar la solicitud GET', error);
      });
    }
  }, [seen]);
  
  useEffect(() => {
    let player;
    
    const initializePlayer = () => {
      player = new Plyr(videoRef.current, {
        controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'settings' , 'fullscreen'],
        ratio: '16:9',
        speed: { selected: 1, options: [0.5, 1, 1.5, 2] },
      });
        const handleControlsHidden = () => {
          setSeen(true);
        };
        player.on('controlshidden', handleControlsHidden);
    };

    if (videoRef.current) {
      initializePlayer();
    } else {
      const observer = new MutationObserver(() => {
        if (videoRef.current) {
          initializePlayer();
          observer.disconnect();
        }
      });

      observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
      });
    }

    return () => {
      if (player) {
        player.destroy();
      }
    };
  }, []);

  return (
    <div>
      <NavScroll />
      <Banner />
      {videoData && (
        <div className="videoContainer">
          <p className="titleCard">{videoData.title}</p>
          <div className="player">
          <video ref={videoRef} controls={false}>
            <source src={videoData.video_file} type="video/mp4"/>
            <source src={videoData.video_file} type="video/avi"/>
            <source src={videoData.video_file} type="video/webm"/>
            <source src={videoData.video_file} type="video/mov"/>
            <source src={videoData.video_file} type="video/hevc"/>
            <source src={videoData.video_file} type="video/mpeg-4"/>
          </video>
          </div>
          
          <div className="channelavatar">
              <div>
                <Link className="channelCard" to={`/channel/${videoData.creator}`}>
                  <Avatar sx={{ bgcolor: '#480442' }} aria-label="avatar">     
                        {avatar}
                  </Avatar>
                </Link>
              </div>
              <div className="channelavatarletter">
                <Link className="channelCard" to={`/channel/${videoData.creator}`}>
                  <h4>{videoData.creator}</h4>
                </Link>
              </div>

            <div className="viewsbox">
                <div>
                  <svg className="viewssvg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M1.5 12c0-2.25 3.75-7.5 10.5-7.5S22.5 9.75 22.5 12s-3.75 7.5-10.5 7.5S1.5 14.25 1.5 12zM12 16.75a4.75 4.75 0 1 0 0-9.5 4.75 4.75 0 0 0 0 9.5zM14.7 12a2.7 2.7 0 1 1-5.4 0 2.7 2.7 0 0 1 5.4 0z" fill="#000000"/></svg>
                </div>
                <div className="viewsletter">
                  <h4>{videoData.views_count}</h4>
                </div>
            </div>
          </div>

          {videoData.description !== "" &&
          <>
            <div className="descriptionvideotitle">
              Descripción
            </div>
            <div className="descriptionvideo">
              {videoData.description}
            </div>
          </>
          }
          <div className="likes">
            <ButtonGroup aria-label="Basic example">
              <button className={activeLike ? "buttonlikeactive" : "buttonlike"} onClick={likeVideo} disabled={disableLikes || notUpdated}><svg xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" viewBox="0 0 64 80" x="0px" y="0px" fill="#ffffff"><path d="M40.428,25.061l.834-6.675c.64-5.117-3.35-9.637-8.507-9.637h0c-1.77,0-3.206,1.435-3.206,3.206l-.691,5.415c-.391,3.067-1.708,5.942-3.774,8.243l-4.321,4.811c-.165,.184-.256,.422-.256,.668v23.16c0,.552,.448,1,1,1h26.094c1.778,0,3.328-1.21,3.76-2.935l4.521-18.084c.611-2.446-1.238-4.815-3.76-4.815h-7.849c-2.331,0-4.134-2.043-3.845-4.356Z"/><path d="M11.261,30.708h5.073c.552,0,1,.448,1,1v22.543c0,.552-.448,1-1,1h-5.073c-1.8,0-3.261-1.461-3.261-3.261v-18.021c0-1.8,1.461-3.261,3.261-3.261Z"/></svg>
              <p>{likes}</p>
              </button>
              
              <button className={activeDislike ? "buttonlikeactive" : "buttonlike"} onClick={dislikeVideo} disabled={disableLikes || notUpdated}><svg xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" viewBox="0 0 64 80" x="0px" y="0px" fill="#ffffff"><path d="M40.428,38.939l.834,6.675c.64,5.117-3.35,9.637-8.507,9.637h0c-1.77,0-3.206-1.435-3.206-3.206l-.691-5.415c-.391-3.067-1.708-5.942-3.774-8.243l-4.321-4.811c-.165-.184-.256-.422-.256-.668V9.749c0-.552,.448-1,1-1h26.094c1.778,0,3.328,1.21,3.76,2.935l4.521,18.084c.611,2.446-1.238,4.815-3.76,4.815h-7.849c-2.331,0-4.134,2.043-3.845,4.356Z"/><path d="M11.261,8.749h5.073c.552,0,1,.448,1,1v22.543c0,.552-.448,1-1,1h-5.073c-1.8,0-3.261-1.461-3.261-3.261V12.01c0-1.8,1.461-3.261,3.261-3.261Z"/></svg>
              <p>{dislikes}</p>
              </button>
            </ButtonGroup>
            {disableLikes &&
              <p className="infolikes">
                Para poder dar likes necesitas iniciar sesión.
              </p>
            }
            {notUpdated &&
              <p className="infolikes">
                Para usar esta nueva funcionalidad, cierra e inicia sesión nuevamente.
              </p>
            }
            </div>
            <div className="buttonsharebox">
                <button className="buttonshare" onClick={handleCompartirClick}>
                <p>Compartir</p>
                <svg fill="#ffffff"
                  viewBox="0 0 458.624 458.624">
                    <path d="M339.588,314.529c-14.215,0-27.456,4.133-38.621,11.239l-112.682-78.67c1.809-6.315,2.798-12.976,2.798-19.871
                      c0-6.896-0.989-13.557-2.798-19.871l109.64-76.547c11.764,8.356,26.133,13.286,41.662,13.286c39.79,0,72.047-32.257,72.047-72.047
                      C411.634,32.258,379.378,0,339.588,0c-39.79,0-72.047,32.257-72.047,72.047c0,5.255,0.578,10.373,1.646,15.308l-112.424,78.491
                      c-10.974-6.759-23.892-10.666-37.727-10.666c-39.79,0-72.047,32.257-72.047,72.047s32.256,72.047,72.047,72.047
                      c13.834,0,26.753-3.907,37.727-10.666l113.292,79.097c-1.629,6.017-2.514,12.34-2.514,18.872c0,39.79,32.257,72.047,72.047,72.047
                      c39.79,0,72.047-32.257,72.047-72.047C411.635,346.787,379.378,314.529,339.588,314.529z"/>
                </svg>
                </button>
            </div>
          <Comments id={id}/>
        </div>
      )}
      
      {results &&
      <>
      {results.length > 1 ? (
        <>
        <div className="marginh">
          <h2>Videos relacionados</h2>
        </div>
        
        <div>
            <PaginationResults searchLocal={videoData.title}/>
        </div>
        </>
      ): (
        <div className="marginh">
          <h2>Videos relacionados</h2>
          <h3 className="notf">No se encontraron videos relacionados.</h3>
        </div>
      )}
      </>
      }

    </div>
  );
}

export default Video;
