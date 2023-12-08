import React, { Component } from "react";
import AuthService from "../AuthService/AuthService";
import API from "../Enviroment/API";
export default class CommentForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      error: "",

      comment: {
        nombre: "",
        anonimo: false,
        descripcion: "",
      }
    };

    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    this.setState({nombre: JSON.parse(localStorage.getItem('userData')).username});
  }
  
  handleFieldChange = event => {
    const { value, name } = event.target;

    this.setState({
      ...this.state,
      comment: {
        ...this.state.comment,
        [name]: value
      }
    });
  };

  /**
   * Form submit handler
   */
  onSubmit(e) {
    // prevent default form submission
    e.preventDefault();

    if (!this.isFormValid()) {
      this.setState({ error: "All fields are required." });
      return;
    }

    // loading status and clear error
    this.setState({ error: "", loading: true });
    let formData = new FormData();
    formData.append('creator', this.state.nombre);
    formData.append('message', this.state.comment.descripcion);
    formData.append('video', this.props.id);
    console.log(formData);

    AuthService.requestWithRefresh({
      method: 'POST',
      url: `${API}/videos/comments/create/`,
      body: formData,
      headers:{
          'accept': 'application/json',
      }
  })
  .then(res => {
    if (res.error) {
      this.setState({ loading: false, error: res.error });
    } else {
      // add time return from api and push comment to parent state
      formData.time = res.time;
      this.props.addComment(formData);

      this.setState({
        loading: false,
        comment: { ...formData, descripcion: "" }
      });
    }
  })
  .catch(err => {
    console.log(err)
    this.setState({
      error: "Something went wrong while submitting form.",
      loading: false
    });
  });

}

  /**
   * Simple validation
   */
  isFormValid() {
    return ((this.state.comment.nombre !== "") || this.state.anonimo !== false) && this.state.comment.descripcion !== "";
  }

  renderError() {
    return this.state.error ? (
      <div className="alert alert-danger">{this.state.error}</div>
    ) : null;
  }

  render() {
    return (
      <React.Fragment>
        <form method="post" onSubmit={this.onSubmit}>
          <div className="form-group">
            <b>{this.state.nombre}</b>
          </div>

          <div className="form-group botoncomment">
            <textarea
              onChange={this.handleFieldChange}
              value={this.state.comment.descripcion}
              className="form-control"
              placeholder="Comentario"
              name="descripcion"
              rows="5"
            />
          </div>

          {this.renderError()}

          <div className="form-group botoncomment">
            <button disabled={this.state.loading} className="btn btn-primary">
              Comentar &#10148;
            </button>
          </div>
        </form>
      </React.Fragment>
    );
  }
}
