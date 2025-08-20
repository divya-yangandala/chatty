import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { Utils } from '@services/utils/utils.service';
import Post from '@components/posts/post/Post';
import '@components/posts/Posts.scss';
import { PostUtils } from '@services/utils/post-utils.service';

const Posts = ({ allPosts, userFollowing, postsLoading }) => {
  const { profile } = useSelector((state) => state.user);
  const [posts, setPosts] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // console.log()
    setPosts(allPosts);
    setFollowing(userFollowing);
    setLoading(postsLoading);
  }, [allPosts, userFollowing, postsLoading]);
  return (
    <div className="posts-container" data-testid="posts">
      {posts.map((post) => (
        <div key={Utils.generateString(10)} data-testid="posts-item">
          {(Utils.checkIfUserIsFollowed(profile?.blockedBy, post?.userId) || post?.userId === profile?._id) &&
            (
              <>
                {Utils.checkPrivacy(post, profile, following) && (
                  <>
                    <Post post={post} showIcons={false} loading={loading} />
                  </>
                )}
              </>
            )
          }
        </div>
      ))}
    </div>
  )
}

Posts.propTypes = {
  allPosts: PropTypes.array.isRequired,
  userFollowing: PropTypes.array.isRequired,
  postsLoading: PropTypes.bool,
}

export default Posts
