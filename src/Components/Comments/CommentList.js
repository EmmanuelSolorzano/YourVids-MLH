import React, { useEffect } from "react";
import Comment from "./Comment";


export default function CommentList(props) {
  return (
    <div className="commentList">
      <h5 className="text-muted mb-4">
        <span className="badge badge-success">{props.comments.length}</span>{" "}
        Comentario{props.comments.length > 0 ? "s" : ""}
      </h5>
  
      {props.comments.length === 0 && !props.loading ? (
        <div className="alert text-center alert-info">
          Sé el primero en comentar.
        </div>
      ) : null}
      
        {props.comments.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
    </div>
  );
}