import { v4 as uuidv4 } from 'uuid';
import React, { Component } from 'react'
import Dropzone from 'react-dropzone';
import { Button, Spinner } from 'react-bootstrap';
import "./Create.css";
import AuthService from '../AuthService/AuthService';
import NavScroll from '../NavScroll/NavScroll';
import API from '../Enviroment/API'
import API_ROOT from '../Enviroment/API_ROOT'
import { FormControlLabel, Checkbox } from '@mui/material';
class Create extends Component {
  state = { 
    isLoading: false,
    title: "",
    description: "",
    creator: "",
    video: [],
    idefault:[],
    error: false,
    isPublic: true,
 }

 componentDidMount() {
  this.setState({creator: JSON.parse(localStorage.getItem('userData')).username});
  fetch(`${API_ROOT}/media/thumbnails/default.png`)
  .then(response => response.blob())
  .then(blob => {
    this.setState({idefault: new File([blob], 'thumbnail.png', { type: blob.type })})
    console.log(new File([blob], 'thumbnail.png', { type: blob.type }))
  })
  .catch(err => {
    console.log(err);
  });
}

 onDropVideo = (video) => {
  this.setState({isLoading:true,video:[],error:false})
  this.loadVideo(video)
}

loadVideo = (video) => {
    setTimeout(()=> {
        this.setState({video,isLoading:false}, () => console.log(this.state.video[0]))
    }, 1000)
}

sendVideo = () => {
  this.setState({error: false})
  this.activateSpinner();
  const boundary = uuidv4();
  let formData = new FormData();
  formData.append('title', this.state.title);
  formData.append('description', this.state.description);
  formData.append('creator', this.state.creator);
  formData.append('video_file', this.state.video[0]);
  formData.append('listed', this.state.isPublic);
  formData.append('thumbnail', this.state.idefault);
  console.log(formData);
  console.log(this.state.video[0]);
  console.log(this.state.video[0] instanceof File);
  console.log(this.state.idefault);
  console.log(this.state.idefault instanceof File);
    AuthService.requestWithRefresh({
      method: 'POST',
      url: `${API}/videos/`,
      body: formData,
      headers:{
          'accept': 'application/json',
      }
  })
  .then(data => {
    console.log(data);
    window.location.href = `/`;
  })
  .catch(error => {
    console.log(error);
    this.setState({error: true, video: [],})
  });
}

 handleSpinner = () => {
    this.deactivateSpinner()
 }

 activateSpinner = () => {
    this.setState({isLoading:true, video:[]})
 }

 deactivateSpinner = () => {
    this.setState({isLoading:false})
 }



render() { 
    const filesVideo = this.state.video.map(file => (
        <li key={file.name}>
          {file.name} - {file.size} bytes
        </li>
      ));
    return (
      <>
        <NavScroll />
      <div className='login'>
        <h2 className="separation">Título de tu video</h2>
        <input
            type="text"
            value={this.state.title}
            onChange={e => this.setState({title:e.target.value})}
            placeholder='Título de tu video'
        />

        <h2 className="separation">Descripción de tu video</h2>
          <textarea
            value={this.state.description}
            onChange={(e) => this.setState({ description: e.target.value })}
            placeholder="Descripción de tu video"
            maxlength="1000"
          />

        <h2 className="separation">¡Sube tu video!</h2>
        <Dropzone onDrop={this.onDropVideo} accept="video/mp4, video/avi, video/hevc, video/webm, video/mov, video/mpeg-4">
            {({isDragActive, getRootProps, getInputProps}) => (
                <section className="container">
                    <div {...getRootProps({className: 'dropzone back'})}>
                    <input {...getInputProps()} />
                    <p>{isDragActive ? "Drop a video" : "Suelta un archivo aquí o haz click para seleccionar tu video."}</p>
                    </div>
                    <FormControlLabel className='checkvideo'
                      control={
                        <Checkbox
                          checked={this.state.isPublic}
                          onChange={(e) => this.setState({ isPublic: e.target.checked })}
                        />
                      }
                      label="Público: Se publicará en la página de inicio si esta casilla está activada, de lo contrario, se mantendrá privado."
                    />

                    {this.state.video.length > 0 &&
                      <>
                        <p className='videoname'>{this.state.video[0].name}</p>
                        <Button variant='info' size='lg' onClick={this.sendVideo}>Subir Video</Button>
                      </>
                    }
                    
                    {this.state.isLoading && !this.state.error &&
                    <Spinner animation="border" role="status" variant='light'>
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                    }
                    {this.state.error &&
                    <p className='errorp'>Ha ocurrido un error. Intenta cerrando e iniciando sesión o inténtalo de nuevo.</p>
                    }
                </section>
            )}
        </Dropzone>
      </div>
      </>
    );
}
}

export default Create;
