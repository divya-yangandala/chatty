import '@pages/social/profile/Profile.scss';
import BackgroundHeader from '@components/background-header/BackgroundHeader';
import { userService } from '@services/api/user/user.service';
import { tabItems } from '@services/utils/static.data';
import { Utils } from '@services/utils/utils.service';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';
import { imageService } from '@services/api/image/image.service';
import Timeline from '@components/timeline/Timeline';
import FollowerCard from '../followers/FollowerCard';
import GalleryImage from '@components/gallery-image/GalleryImage';
import { toggleDeleteDialog } from '@redux/reducers/modal/modal.reducer';
import ChangePassword from '@components/background-header/change-password/ChangePassword';
import NotificationSettings from '@components/notification-settings/NotificationSettings';

const Profile = () => {
  const { profile } = useSelector((state) => state.user);
  const { deleteDialogIsOpen, data } = useSelector((state) => state.modal);
  const [user, setUser] = useState();
  const [rendered, setRendered] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [hasImage, setHasImage] = useState(false);
  const [selectedBackgroundImage, setSelectedBackgroundImage] = useState('');
  const [selectedProfileImage, setSelectedProfileImage] = useState('');
  const [bgUrl, setBgUrl] = useState('');
  const [galleryImages, setGalleryImages] = useState([]);
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [userProfileData, setUserProfileData] = useState(null);
  const [displayContent, setDisplayContent] = useState('timeline');
  const dispatch = useDispatch();
  const { username } = useParams();
  const [searchParams] = useSearchParams();

  const getUserProfileByUsername = useCallback(async () => {
    try {
      const response = await userService.getUserProfileByUsername(
        username,
        searchParams.get('id'),
        searchParams.get('uId')
      );
      setUser(response.data.user);
      setUserProfileData(response.data);
      setBgUrl(Utils.getImage(response.data?.user?.bgImageId, response.data?.user?.bgImageVersion));
      setLoading(false);
    } catch (error) {
      Utils.dispatchNotification(error.response.data.message, 'error', dispatch);
    }
  }, [dispatch, searchParams, username]);

  const getUserImages = useCallback(async () => {
    try {
      const imagesResponse = await imageService.getUserImages(searchParams.get('id'));
      setGalleryImages(imagesResponse.data.images);
    } catch (error) {
      Utils.dispatchNotification(error.response.data.message, 'error', dispatch);
    }
  }, [dispatch, searchParams]);

  const changeTabContent = (data) => {
    setDisplayContent(data);
  };

  const selectedFileImage = (data, type) => {
    setHasImage(!hasImage);
    if (type === 'background') {
      setSelectedBackgroundImage(data);
    } else {
      setSelectedProfileImage(data);
    }
  };

  const cancelFileSelection = () => {
    setHasImage(!hasImage);
    setSelectedBackgroundImage('');
    setSelectedProfileImage('');
    setHasError(false);
  };

  const saveImage = (type) => {
    const reader = new FileReader();
    reader.addEventListener('load', async () => addImage(reader.result, type), false);
    // user can select same image or a new image in that case new image must be a string
    if (selectedBackgroundImage && typeof selectedBackgroundImage !== 'string') {
      reader.readAsDataURL(Utils.renameFile(selectedBackgroundImage));
    } else if (selectedFileImage && typeof selectedProfileImage !== 'string') {
      reader.readAsDataURL(Utils.renameFile(selectedProfileImage));
    } else {
      // for profile image ther's no option for user to select existing image only New Image
      addImage(selectedBackgroundImage, type);
    }
  };

  const addImage = async (result, type) => {
    try {
      const url = type === 'background' ? '/images/background' : '/images/profile';
      const response = await imageService.addImage(url, result);
      if (response) {
        Utils.dispatchNotification(response.data.message, 'success', dispatch);
        setHasError(false);
        setHasImage(false);
      }
    } catch (error) {
      setHasError(true);
      Utils.dispatchNotification(error.response.data.message, 'error', dispatch);
    }
  };

  const removeImage = async (url) => {
    const response = await imageService.removeImage(url);
    Utils.dispatchNotification(response.data.message, 'success', dispatch);
  };

  const removeBackgroundImage = async (bgImageId) => {
    try {
      setBgUrl('');
      await removeImage(`/images/background/${bgImageId}`);
    } catch (error) {
      setHasError(true);
      Utils.dispatchNotification(error.response.data.message, 'error', dispatch);
    }
  };

  useEffect(() => {
    if (rendered) {
      getUserProfileByUsername();
      getUserImages();
    }
    if (!rendered) setRendered(true);
  }, [rendered, getUserProfileByUsername, getUserImages]);

  return (
    <div className="profile-wrapper">
      <div className="profile-wrapper-container">
        <div className="profile-header">
          <BackgroundHeader
            user={user}
            loading={loading}
            hasImage={hasImage}
            hasError={hasError}
            url={bgUrl}
            onClick={changeTabContent}
            selectedFileImage={selectedFileImage}
            saveImage={saveImage}
            cancelFileSelection={cancelFileSelection}
            removeBackgroundImage={removeBackgroundImage}
            tabItems={tabItems(username === profile?.username, username === profile?.username)}
            tab={displayContent}
            hideSettings={username === profile?.username}
            galleryImages={galleryImages}
          />
        </div>

        <div className="profile-content">
          {displayContent === 'timeline' && <Timeline />}
          {displayContent === 'followers' && <FollowerCard />}
          {displayContent === 'gallery' && (
            <>
              {galleryImages.length > 0 && (
                <>
                  <div className="imageGrid-container">
                    {galleryImages.map((image) => {
                      <div key={image._id}>
                        <GalleryImage
                          showCaption={false}
                          showDelete={true}
                          imgSrc={Utils.getImage(image?.imgId, image?.imgVersion)}
                          onClick={() => {
                            setImageUrl(Utils.getImage(image?.imgId, image?.imgVersion));
                            setShowImageModal(!showImageModal);
                          }}
                          onRemoveImage={(event) => {
                            event.stopPropogation();
                            dispatch(toggleDeleteDialog({ toggle: !deleteDialogIsOpen, data: image?._id }));
                          }}
                        />
                      </div>;
                    })}
                  </div>
                </>
              )}
            </>
          )}
          {displayContent === 'change password' && <ChangePassword />}
          {displayContent === 'notifications' && <NotificationSettings />}
        </div>
      </div>
    </div>
  );
};

export default Profile;
