import React, { Component } from "react";
import "./Comments.css";

import CommentList from "./CommentList";
import CommentForm from "./CommentForm";
import API from "../Enviroment/API";

class Comments extends Component {
  constructor(props) {
    super(props);

    this.state = {
      comments: [],
      loading: true
    };

    this.addComment = this.addComment.bind(this);
  }

  componentDidMount() {
    // loading
    this.setState({ loading: true });

    // get all the comments
    fetch(`${API}/videos/comments/${this.props.id}`)
      .then(res => res.json())
      .then(res => {
        console.log(res);
        this.setState({
          comments: res,
        });
      })    
      .catch(err => {
      })
      .finally(() => {
        this.setState({
          loading: false
        });
      })
  }
  

  /**
   * Add new comment
   * @param {Object} comment
   */
  addComment(comment) {
    fetch(`${API}/videos/comments/${this.props.id}`)
      .then(res => res.json())
      .then(res => {
        this.setState({
          comments: res,
        });
      })
      .catch(err => {
      })
      .finally(() => {
        this.setState({
          loading: false
        });
      })
  }

  render() {
    return (
      <div className="commsec bg-light shadow commentcontainer">
      {this?.state?.comments && (
        <div className="row">
          <div className="col-4  pt-3 border-right">
            <h6>¡Escribe un comentario!</h6>
            {localStorage.getItem("auth") ? (
              <CommentForm addComment={this.addComment} id={this.props.id}/>
            ) : (
              <b>Para agregar un comentario necesitas iniciar sesión.</b>
            )}
          </div>
          <div className="col-8  pt-3 bg-white scroll">
            <CommentList
              loading={this.state.loading}
              comments={this.state.comments}
            />
          </div>
        </div>
      )}
      </div>
    );
  }
}

export default Comments;
