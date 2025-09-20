import { closeModal } from "@redux/reducers/modal/modal.reducer";
import { clearPost, updatePostItem } from "@redux/reducers/post/post.reducer";
import { postService } from "@services/api/post/post.service";
import { socketService } from "@services/socket/socket.service";
import { Utils } from "@services/utils/utils.service";
import { findIndex, cloneDeep, remove, find } from 'lodash';

export class PostUtils {
  static selectBackground(bgColor, postData, setTextareaBackground, setPostData) {
    postData.bgColor = bgColor;
    setTextareaBackground(bgColor);
    setPostData(postData);
    // setDisable(false);
  }

  static postInputEditable(textContent, postData, setPostData) {
    postData.post = textContent;
    setPostData(postData);
    // setDisable(false);
  }

  static closePostModal(dispatch) {
    dispatch(closeModal());
    dispatch(clearPost());
  }

  static clearImage(postData, post, inputRef, dispatch, setSelectedPostImage, setPostImage, setPostData) {
    postData.gifUrl = '';
    postData.image = '';
    setSelectedPostImage(null);
    setPostImage('');
    // setDisable(false);
    setTimeout(() => {
      if (inputRef?.current) {
        inputRef.current.textContent = !post ? postData?.post : post;
        // this will preserve the textContent along with slected image/gif for a post
        if (post) {
          postData.post = post;
        }
        setPostData(postData);
        PostUtils.positionCursor('editable');
      }
    });
    dispatch(updatePostItem({ gifUrl: '', image: '', imgId: '', imgVersion: '' }));
  }

  static dispatchNotification(message, type, setApiResponse, setLoading, dispatch) {
    setApiResponse(type);
    setLoading(false);
    // setDisable(false);
    Utils.dispatchNotification(message, type, dispatch)
  }

  static postInputData(imageInputRef, postData, post, setPostData) {
    setTimeout(() => {
      if (imageInputRef?.current) {
        imageInputRef.current.textContent = !post ? postData?.post : post;
        // this will preserve the textContent along with slected image/gif for a post
        if (post) {
          postData.post = post;
        }
        setPostData(postData);
        PostUtils.positionCursor('editable');
      }
    });
  }

  static async sendUpdatePostRequest(postId, postData, setApiResponse, setLoading, dispatch) {
    const response = await postService.updatePost(postId,postData);
    if (response) {
      PostUtils.dispatchNotification(
        response.data.message,
        'success',
        setApiResponse,
        setLoading,
        dispatch
      )
      setTimeout(() => {
        setApiResponse('success');
        setLoading(false);
      }, 3000);
    }
    PostUtils.closePostModal(dispatch);
  }

  static async sendPostWithImageRequest(
    fileResult,
    postData,
    imageInputRef,
    setApiResponse,
    setLoading,
    dispatch
  ) {
    try {
      postData.image = fileResult;
      if (imageInputRef?.current) {
        imageInputRef.current.textContent = postData.post;
      }
      const response = await postService.createPostWithImage(postData);
      if (response) {
        setApiResponse('success');
        setLoading(false);
      }
    } catch (error) {
      PostUtils.dispatchNotification(
        error.response.data.message,
        'error',
        setApiResponse,
        setLoading,
        dispatch
      )
    }
  }

  // Function if user wants to update the image in a post or add new image in a post
  static async sendUpdatePostWithImageRequest(
    fileResult,
    postId,
    postData,
    setApiResponse,
    setLoading,
    dispatch
  ) {
    try {
      postData.image = fileResult;
      postData.gifUrl = '';
      postData.imgId = '';
      postData.imgVersion = '';
      const response = await postService.updatePostWithImage(postId, postData);
      if (response) {
        PostUtils.dispatchNotification(
          response.data.message,
          'success',
          setApiResponse,
          setLoading,
          dispatch
        )
      }
      setTimeout(() => {
        setApiResponse('success');
        setLoading(false);
      }, 3000);
      PostUtils.closePostModal(dispatch);
    } catch (error) {
      PostUtils.dispatchNotification(
        error.response.data.message,
        'error',
        setApiResponse,
        setLoading,
        dispatch
      )
    }
  }

  static positionCursor(elementId) {
    const element = document.getElementById(`${elementId}`);
    const selection = window.getSelection();
    const range = document.createRange();
    selection.removeAllRanges();
    range.selectNodeContents(element);
    range.collapse(false);
    selection.addRange(range);
    element.focus();
  }

  static socketIOPost(posts, setPosts) {
    posts = cloneDeep(posts);
    socketService?.socket?.on('add post', (post) => {
      posts = [post , ...posts];
      setPosts(posts);
    });

    socketService?.socket?.on('update post', (post) => {
      PostUtils.updateSinglePost(posts, post, setPosts);
    });

    socketService?.socket?.on('delete post', (postId) => {
      const index = findIndex(posts, (postData) => postData._id === postId);
      if (index > -1) {
        posts = cloneDeep(posts);
        remove(posts, { _id: postId });
        setPosts(posts);
      }
    });

    socketService?.socket?.on('update like', (reactionData) => {
      const postData = find(posts, (post) => post._id === reactionData?.postId);
      if (postData) {
        postData.reactions = reactionData.postReactions;
        PostUtils.updateSinglePost(posts, postData, setPosts);
      }
    });

    socketService?.socket?.on('update comment', (commentData) => {
      const postData = find(posts, (post) => post._id === commentData?.postId);
      if (postData) {
        postData.commentsCount = commentData.commentsCount;
        PostUtils.updateSinglePost(posts, postData, setPosts);
      }
    });

  }

  static updateSinglePost(posts, post, setPosts) {
    posts = cloneDeep(posts);
    // const index = findIndex(posts, (data) => data?._id === post?._id); // can be written as below
    const index = findIndex(posts, ['_id', post?._id]);
    if (index > -1) {
      posts.splice(index, 1, post);   // here we are using slice to replace the post object based on index returned above
      setPosts(posts);
    }
  }


}
