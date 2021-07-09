import React, { useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import Spinner from "../layout/Spinner";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { getPost } from "../../action/post";
import PostItems from "./PostItems";
import CommentForm from "./CommentForm";
import PostComment from "./PostComment";
const Post = ({ getPost, match, post: { loading, post } }) => {
  useEffect(() => {
    getPost(match.params.id);
  }, [getPost, match]);

  return loading || post === null ? (
    <Spinner />
  ) : (
    <Fragment>
      <Link to="/posts" className="btn">
        Go Previous
      </Link>
      <PostItems key={post._id} post={post} showAction={false} />
      <CommentForm postId={post._id} />
      <div className="comments">
        {post.comments.map((comment) => (
          <PostComment key={comment._id} comment={comment} postId={post._id} />
        ))}
      </div>
    </Fragment>
  );
};

Post.propTypes = {
  post: PropTypes.object.isRequired,
  getPost: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
  post: state.post,
});

export default connect(mapStateToProps, { getPost })(Post);
