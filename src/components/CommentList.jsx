import React from "react";
import List from "@material-ui/core/List";

export default function CommentList({ comments }) {
  // const renderCommentsTree = (comments, marginLeft = 0) => {
  //   return comments.map(comment => {
  //     return (
  //       <div key={comment.id} style={{ marginLeft: marginLeft }}>
  //         {comment.body}
  //       </div>
  //     );
  //   });
  // };

  return (
    <List>
      {comments.map(item => {
        return (
          <li key={item.id}>
            {item.body}
            <CommentList comments={item.reply_set} />
          </li>
        );
      })}
    </List>
  );
}
