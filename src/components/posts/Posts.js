import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { Utils } from '@services/utils/utils.service';
import Post from '@components/posts/post/Post';
import '@components/posts/Posts.scss';
import PostSkeleton from '@components/posts/post/PostSkeleton';

const Posts = ({ allPosts, userFollowing, postsLoading }) => {
  const { profile } = useSelector((state) => state.user);
  const [posts, setPosts] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setPosts(allPosts);
    setFollowing(userFollowing);
    setLoading(postsLoading);
  }, [allPosts, userFollowing, postsLoading]);

  return (
    <div className="posts-container" data-testid="posts">
      {!loading &&
        posts.length > 0 &&
        posts.map((post) => (
        // <div key={Utils.generateString(10)} data-testid="posts-item">
        <div key={post?._id} data-testid="posts-item">
          {(!Utils.checkIfUserIsBlocked(profile?.blockedBy, post?.userId) || post?.userId === profile?._id) &&
            (
              <>
                {Utils.checkPrivacy(post, profile, following) && (
                  <>
                    {/* <Post post={post} showIcons={false} loading={loading} /> */}
                    <Post post={post} showIcons={false} />
                  </>
                )}
              </>
            )
          }
        </div>
      ))}

      {!loading && !posts.length &&
        [1, 2, 3, 4, 5, 6].map((index) => (
          <div key={index}>
            <PostSkeleton />
          </div>
        ))
      }
    </div>
  )
}

Posts.propTypes = {
  allPosts: PropTypes.array.isRequired,
  userFollowing: PropTypes.array.isRequired,
  postsLoading: PropTypes.bool,
}

export default Posts
