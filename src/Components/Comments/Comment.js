import React, { useState } from "react";
import "./Comments.css";
import { Link } from "react-router-dom";
import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useEffect } from "react";
import AuthService from "../AuthService/AuthService";
import API from "../Enviroment/API";

export default function Comment(props) {
  const { creator, date, message, id } = props.comment;
  const [menuAnchor, setMenuAnchor] = useState(null);

  const handleMenuOpen = (event) => {
      setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
      setMenuAnchor(null);
  };

  const handleDelete = (commentid) => {
    AuthService.refresh();
    AuthService.requestWithRefresh({
        method: 'DELETE',
        url: `${API}/videos/comments/delete/${commentid}`,
    })
    //.then(res => res.json())
    .then(res => {
    })
    .catch(error => {
    })
    .finally(() => {
      window.location.reload();
    });
  }

  return (
    <div className="media mb-3 containercomment">
      <img
        className="mr-3 bg-light rounded profilephoto"
        width="48"
        height="48"
        src={`https://ui-avatars.com/api/?name=${creator}&background=409012&size=128`}
        alt={creator}
      />
      <b className="nombrecreador">{creator}</b>
      <div className="media-body p-2 shadow-sm rounded bg-light border">
        <div className="controlsbutton">
          <div>
          <small className="float-right text-muted">{date}</small>
          <p>{message}</p>  
          </div>
          {localStorage.getItem('userData') && (
          <>
            {(creator === JSON.parse(localStorage.getItem('userData')).username) && (
              <div className="buttonpoints">
              <IconButton aria-label="settings" onClick={handleMenuOpen}>
                <MoreVertIcon />
              </IconButton>
              <Menu
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={() => handleDelete(id)}>Eliminar Comentario</MenuItem>
              </Menu>
              </div>
            )}
          </>
          )}
      </div>
      </div>
      
    </div>
  );
}