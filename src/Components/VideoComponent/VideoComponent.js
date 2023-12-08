
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Link } from 'react-router-dom';
import "./VideoComponent.css";
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardMedia, Avatar, IconButton, Menu, MenuItem } from '@mui/material';
import AuthService from '../AuthService/AuthService';
import API from '../Enviroment/API'
import URL from '../Enviroment/URL';
import { FormControlLabel, Checkbox }from '@mui/material';
  
export default function VideoComponent(props) {
    const creator = props.creator_username;
    const [menuAnchor, setMenuAnchor] = useState(null);
    const [edit, setEdit] = useState(false);
    const [titleLocal, setTitleLocal] = useState(props.title);
    const [descriptionLocal, setDescriptionLocal] = useState(props.description);
    const [publicLocal, setPublicLocal] = useState(Boolean(props.public));
    const mostrarTresPuntos = props.title.length > 14;
    const titleConst = mostrarTresPuntos ? `${props.title.slice(0, 15)}...` : props.title;
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const handleMenuOpen = (event) => {
        setMenuAnchor(event.currentTarget);
    };

    const handleMenuClose = () => {
        setMenuAnchor(null);
    };
    const avatar = creator.charAt(0).toUpperCase();

    const handleEdit = (vidid) => {
        AuthService.refresh();
        let formData = new FormData();
        formData.append('title', titleLocal);
        formData.append('description', descriptionLocal);
        formData.append('listed', publicLocal);
        AuthService.requestWithRefresh({
            method: 'PATCH',
            url: `${API}/videos/${vidid}/`,
            body: formData,
            headers:{
                'accept': 'application/json',
            }
        })
        .then(data => {  
            console.log(data)
            window.location.reload();
            //setEdit(!edit);
        })
        .catch(error => {
          console.log(error);
        });
        //window.location.reload();
    }

    const handleDelete = (vidid) => {
        AuthService.refresh();
        AuthService.requestWithRefresh({
            method: 'DELETE',
            url: `${API}/videos/${vidid}/`,
        })
        .then(data => {
            console.log(data)
            //window.location.reload();
            window.location.href = `/channel/${creator}`;
        })
        .catch(error => {
          console.log(error);
        });
    }

    const handleOptionEdit = () => {
        setEdit(!edit);
        handleMenuClose();
    }   

    useEffect(() => {
      // Función que se ejecuta cuando cambia el tamaño de la ventana
      const handleResize = () => {
        setWindowWidth(window.innerWidth);
      };
  
      // Agregar el event listener para manejar los cambios en el tamaño de la ventana
      window.addEventListener('resize', handleResize);
  
      // Limpiar el event listener al desmontar el componente
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, []);

    return (
    <div className='card'>
      <Card sx={{ bgcolor: "whitesmoke"}} >
        <CardHeader
          avatar={
            <Link to={`/channel/${props.creator_username}`} className='link'>
                <Avatar sx={{ bgcolor: '#409012' }} aria-label="avatar">
                
                {avatar}
                
                </Avatar>
            </Link>
          }
          action={

            (props.creator_video && props.channel) &&(
                <div>
                    {((props.creator_username === props.creator_video) && (props.channel)) && 
                        <>
                        <IconButton aria-label="settings" onClick={handleMenuOpen}>
                          <MoreVertIcon />
                        </IconButton>
                        <Menu
                          anchorEl={menuAnchor}
                          open={Boolean(menuAnchor)}
                          onClose={handleMenuClose}
                        >
                          <MenuItem onClick={() => handleOptionEdit()}>Editar Video</MenuItem>
                          <MenuItem onClick={() => handleDelete(props.id)}>Eliminar Video</MenuItem>
                        </Menu>
                      </>}
                </div>
            )
          }
          title={<Link to={`/video/${props.id}`} className='linkTitle'>
            {windowWidth <= 800 ? (
              <p>{props.title}</p>
            ) : (
              <p>{titleConst}</p>
            )}
            </Link>}
          subheader={<Link to={`/channel/${props.creator_username}`} className='linkChannel'>
                        {props.creator_username}
                    </Link>}
        />
        <a href={`${URL}/video/${props.id}`} className='link'>
            <CardMedia className='imagen'
            component="img"
            image={props.thumbnail}
            alt={props.thumbnail}
            />
        </a>
        {edit  &&
                    <div>
                        <div>
                        <p className='editTitle'>Editar título</p><input type='text' value={titleLocal} placeholder="Nuevo título..." onChange={e => setTitleLocal(e.target.value)}></input>
                        </div>
                        <div>
                        <p className='editTitle'>Editar descripción</p><input type='text' value={descriptionLocal} placeholder="Nueva descripción..." onChange={e => setDescriptionLocal(e.target.value)}></input>
                        </div>
                        <div className='editTitle'>
                          <p>Listar público</p>
                        <FormControlLabel className='checkvideos'
                          control={
                            <Checkbox
                              checked={publicLocal}
                              value={publicLocal}
                              onChange={e => setPublicLocal(e.target.checked)}
                            />
                          }
                          label="Público"
                        />
                        </div>
                        
                        <div className='options'>
                            <button onClick={() => handleEdit(props.id)}>
                                Guardar
                            </button>
                            <button onClick={() => setEdit(!edit)}>
                                Cancelar
                            </button>
                        </div>
                    </div>
                    }
      </Card>
    </div>
    );
  }
