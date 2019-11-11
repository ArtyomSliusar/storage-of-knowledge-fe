import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from "@material-ui/core/Avatar";

export default function CommentList({
  username,
  comments,
  classes,
  renderForm,
  prefixId,
  handleFormOpen,
  handleFormClose,
  handleCommentDelete
}) {
  return (
    <List>
      {comments.map(item => {
        return (
          <React.Fragment key={item.id}>
            <ListItem dense={true}>
              <Card className={classes.commentCard}>
                <CardHeader
                  avatar={
                    <Avatar aria-label="recipe" className={classes.avatar}>
                      {item.username.charAt(0).toUpperCase()}
                    </Avatar>
                  }
                  title={item.username}
                  subheader={item.date_modified}
                />
                <CardContent>
                  <Typography component="p">{item.body}</Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => handleFormOpen(`${prefixId}${item.id}`)}
                  >
                    reply
                  </Button>
                  {username === item.username ? (
                    <Button
                      size="small"
                      color="secondary"
                      onClick={() => handleCommentDelete(item.id)}
                    >
                      delete
                    </Button>
                  ) : null}
                </CardActions>
                {renderForm(item.id, handleFormClose, true)}
              </Card>
            </ListItem>
            {item.reply_set.length > 0 && (
              <div className={classes.nestedReplies}>
                <CommentList
                  username={username}
                  comments={item.reply_set}
                  classes={classes}
                  renderForm={renderForm}
                  prefixId={prefixId}
                  handleFormOpen={handleFormOpen}
                  handleFormClose={handleFormClose}
                  handleCommentDelete={handleCommentDelete}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </List>
  );
}
