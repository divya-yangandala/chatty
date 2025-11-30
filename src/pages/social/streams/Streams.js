import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '@pages/social/streams/Streams.scss';
import useEffectOnce from '@hooks/useEffectOnce';
import Suggestions from '@components/suggestions/Suggestions';
import { getUserSuggestions } from '@redux/api/suggestion';
import PostForm from '@components/posts/post-form/PostForm';
import Posts from '@components/posts/Posts';
import { postService } from '@services/api/post/post.service';
import { Utils } from '@services/utils/utils.service';
import {orderBy, uniqBy} from 'lodash';
import useInfiniteScroll from '@hooks/useInfiniteScroll';
import { getPosts } from '@redux/api/posts';
import { PostUtils } from '@services/utils/post-utils.service';
import useLocalStorage from '@hooks/useLocalStorage';
import { addReactions } from '@redux/reducers/post/user-post-reaction.reducer';
import { followerService } from '@services/api/followers/follower.service';

const Streams = () => {
  const { allPosts } = useSelector((state) => state);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPostsCount, setTotalPostsCount] = useState(0);
  const [following, setFollowing] = useState();
  const bodyRef = useRef(null);
  const bottomLineRef = useRef();
  let appPosts = useRef([]);
  const storedUsername = useLocalStorage('username', 'get');
  const [deleteSelectedPostId] = useLocalStorage('selectedPostId', 'delete');
  const dispatch = useDispatch();
  useInfiniteScroll(bodyRef, bottomLineRef, fetchPostData);
  const PAGE_SIZE = 4;

  function fetchPostData() {
    let pageNum = currentPage;
    console.log(totalPostsCount, currentPage, Math.round(totalPostsCount / PAGE_SIZE))
    if (currentPage <= Math.round(totalPostsCount / PAGE_SIZE)) {
      pageNum += 1;
      setCurrentPage(pageNum);
      getAllPosts();
    }
  }

  const getAllPosts = async () => {
    try {
      const response = await postService.getAllPosts(1);
      if (response.data.posts.length > 0) {
        appPosts = [...posts, ...response.data.posts];
        const allPosts = uniqBy(appPosts, '_id');   //remove all duplicates post based on unique key _id
        const orderedPost = orderBy(allPosts, ['createdAt'], ['desc']);
        setPosts(allPosts);
      }
      setLoading(false);
    } catch (error) {
      Utils.dispatchNotification(error.response.data.message, 'error', dispatch);
    }
  }

  const getUserFollowing = async () => {
    try {
      const response = await followerService.getUserFollowing();
      setFollowing(response.data.following);
    } catch (error) {
      Utils.dispatchNotification(error.response.data.message, 'error', dispatch);
    }
  }

  const getReactionsByUsername = async() => {
    try {
      const response = await postService.getReactionsByUsername(storedUsername);
      dispatch(addReactions(response.data.reactions));
    } catch (error) {
      Utils.dispatchNotification(error.response.data.message, 'error', dispatch);
    }
  }

  useEffectOnce(() => {
    getUserFollowing();
    getReactionsByUsername();
    deleteSelectedPostId();
    dispatch(getPosts());
    dispatch(getUserSuggestions());
  });

  // useEffect(() => {
  //   dispatch(getPosts());
  //    dispatch(getUserSuggestions());
  // }, [dispatch]);

  useEffect(() => {
    setLoading(allPosts?.isLoading);
    const orderedPost = orderBy(allPosts?.posts, ['createdAt'], ['desc']);  //either we do it on the backend or frontend
    setPosts(orderedPost);
    setTotalPostsCount(allPosts?.totalPostsCount);
  }, [allPosts]);

  useEffect(() => {
    PostUtils.socketIOPost(posts, setPosts);
  }, [posts]);

  return (
    <div className="streams" data-testid="streams">
      <div className="streams-content">
        <div className="streams-post" ref={bodyRef} style={{ backgroundColor: 'white' }}>
          <PostForm />
          <Posts allPosts={posts} postsLoading={loading} userFollowing={following} />
          <div ref={bottomLineRef} style={{ marginBottom: '50px', height: '50px' }}></div>
        </div>
        <div className="streams-suggestions">
          <Suggestions />
        </div>
      </div>
    </div>
  )
}

export default Streams;
