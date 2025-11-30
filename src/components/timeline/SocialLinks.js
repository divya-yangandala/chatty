import { userService } from '@services/api/user/user.service';
import { Utils } from '@services/utils/utils.service';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import BasicInfoSkeleton from './BasicInfoSkeleton';
import InfoDisplay from './InfoDisplay';

const SocialLinks = ({ editableSocialInputs, username, profile, loading, setEditableSocialInputs }) => {

  const dispatch = useDispatch();
  const noBasicInfo = {
    quoteMsg: '',
    workMsg: '',
    schoolMsg: '',
    locationMsg: '',
  }

  const noSocialInfo = {
    instagramMsg: 'No link available',
    twitterMsg: 'No link available',
    facebookMsg: 'No link available',
    youtubeMsg: 'No link available'
  }

  const editableInputs = {
    instagram: '',
    twitter: '',
    facebook: '',
    youtube: ''
  }

  const editableSocialLinks = editableSocialInputs ?? {
    instagram: '',
    twitter: '',
    facebook: '',
    youtube: ''
  }

  const basicInfoPlaceholder = {
    quotePlaceholder: '',
    workPlaceholder: '',
    schoolPlaceholder: '',
    locationPlaceholder: ''
  }

  const socialLinksPlaceholder = {
    instagramPlaceholder: 'Add your Instagram account link',
    twitterPlaceholder: 'Add your Twitter account link',
    facebookPlaceholder: 'Add your Facebook account link',
    youtubePlaceholder: 'Add your Youtube account link'
  }

  const updateSocialLinks = async () => {
    try {
      const response = await userService.updateSocialLinks(editableSocialInputs);
      Utils.dispatchNotification(response.data.message, 'success', dispatch);
    } catch (error) {
      Utils.dispatchNotification(error.response.data.message, 'error', dispatch);
    }
  }

  return (
    <>
      {loading ? (
        <BasicInfoSkeleton />
      ) : (
        <InfoDisplay
          title="Social Links"
          type="social"
          isCurrentUser={username === profile?.username}
          noBasicInfo={noBasicInfo}
          noSocialInfo={noSocialInfo}
          basicInfoPlaceholder={basicInfoPlaceholder}
          socialLinksPlaceholder={socialLinksPlaceholder}
          editableInputs={editableInputs}
          editableSocialInputs={editableSocialLinks}
          loading={loading}
          setEditableSocialInputs={setEditableSocialInputs}
          updateInfo={updateSocialLinks}
        />
      )}
    </>
  )
}

SocialLinks.propTypes = {
  username: PropTypes.string,
  profile: PropTypes.object,
  loading: PropTypes.bool,
  editableSocialInputs: PropTypes.object,
  setEditableSocialInputs: PropTypes.func
}

export default SocialLinks;
