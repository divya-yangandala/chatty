import PropTypes from 'prop-types'
import CommentArea from '@components/posts/comment-area/CommentArea';
import ReactionsAndCommentsDisplay from '@components/posts/reactions/reactions-and-comments-display/ReactionsAndCommentsDisplay';

const PostCommentSection = ({ post }) => {
  return (
    <div data-testid="comment-section">
      <ReactionsAndCommentsDisplay post={post} />
      <CommentArea post={post} />
    </div>
  )
}

PostCommentSection.propTypes = {
  post: PropTypes.object
}

export default PostCommentSection;


// Now, you might say this is like props drilling because you are passing one post into another and then
// into another.
// Yeah, it makes sense.
// In this case we are not for this.
// We are using this component for multiple or this post comment section for multiple components so it
// wouldn't make sense to add all of the posts.
// So if we have like a million posts, it wouldn't make sense to add them in the store.
// So instead just pass them as a props.
