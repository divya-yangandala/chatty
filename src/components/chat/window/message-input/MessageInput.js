import PropTypes from 'prop-types';
import '@components/chat/window/message-input/MessageInput.scss';
import Input from '@components/input/Input';
import Button from '@components/button/Button';
import { FaPaperPlane } from 'react-icons/fa';
import gif from '@assets/images/gif.png';
import photo from '@assets/images/photo.png';
import feeling from '@assets/images/feeling.png';
import loadable from '@loadable/component';
import { useState, useRef, useEffect } from 'react';
import GiphyContainer from '@components/chat/giphy-container/GiphyContainer';
import ImagePreview from '@components/chat/image-preview/ImagePreview';
import { ImageUtils } from '@services/utils/image-utils.service';


const EmojiPickerComponent = loadable(() => import('./EmojiPicker'), {
  fallback: <p id="loading">Loading...</p>
});

const MessageInput = ({ setChatMessage }) => {
  let [message, setMessage] = useState('');
  const [showEmojiContainer, setShowEmojiContainer] = useState(false);
  const [showGifContainer, setShowGifContainer] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [file, setFile] = useState();
  const [base64File, setBase64File] = useState('');
  const [hasFocus, setHasFocus] = useState(false);
  const fileInputRef = useRef();
  const messageInputRef = useRef();

  const handleClick = (event) => {  // this function is used when a user clicks on enter button
    event.preventDefault();
    message = message || 'Sent an Image';
    setChatMessage(message.replace(/ +(?= )/g, ''), '', base64File);
    setMessage('');
    reset();
  }

  const handleGiphyClick = () => {  // this is when one of the gif item is selected
    setChatMessage('Sent a GIF', URL, '');
    reset();
  }

  const addToPreview = async (file) => {
    ImageUtils.checkFileSize(file);
    setFile(URL.createObjectURL(file));   // converting file to string
    const result = await ImageUtils.readAsBase64(file);
    setBase64File(result);
    setShowImagePreview(!showImagePreview);
    setShowEmojiContainer(false);
    setShowGifContainer(false);
  }

  const handleImageClick = () => {  // while this function is used when user clics on sent message Icon
    message = message || 'Sent an Image';
    setChatMessage(message.replace(/ +(?= )/g, ''), '', base64File);
    reset();
  }

  const fileInputClicked = () => {
    fileInputRef.current.click();
  }

  const reset = () => {
    setBase64File('');
    setShowImagePreview(false);
    setShowEmojiContainer(false);
    setShowGifContainer(false);
    setFile('');
  }

  useEffect(() => {
    if (messageInputRef?.current) {
      messageInputRef.current.focus;
    }
  }, [setChatMessage]);

  return (
    <>
      {showEmojiContainer && (
        <EmojiPickerComponent
          onEmojiClick={(emojiObject, event) => {
            console.log("eventObject  ", emojiObject);
            setMessage((text) => (text += `${emojiObject.emoji}`));
          }}
          pickerStyle={{ width: '352px', height: '447px' }}
        />
      )}
      {showGifContainer && <GiphyContainer handleGiphyClick={handleGiphyClick}/>}
      <div className="chat-inputarea" data-testid="chat-inputarea">
        {showImagePreview && (
          <ImagePreview
            image={file}
            onRemoveImage={() => {
              setFile('');
              setBase64File('');
              setShowImagePreview(!showImagePreview)
            }}
          />
        )}
        <form onSubmit={handleClick}>
            <ul className="chat-list" style={{ borderColor: `${hasFocus ? '#50b5ff' : '#f1f0f0'}` }}>
                <li className="chat-list-item"
                  onClick={() => {
                    fileInputClicked();
                    setShowEmojiContainer(false);
                    setShowGifContainer(false);
                  }}
                >
                    <Input
                      ref={fileInputRef}
                      id="image"
                      name="image"
                      type="file"
                      className="file-input"
                      placeholder="Select file"
                      onClick={() => {
                        if (fileInputRef.current) {
                          fileInputRef.current.value = null;
                        }
                      }}
                      handleChange={(event) => addToPreview(event.target.files[0])}
                    />
                    <img src={photo} alt="" />
                </li>
                <li className="chat-list-item"
                  onClick={() => {
                    setShowEmojiContainer(false);
                    setShowGifContainer(!showGifContainer);
                    setShowImagePreview(false);
                  }}
                >
                    <img src={gif} alt="" />
                </li>
                <li className="chat-list-item"
                  onClick={() => {
                    setShowEmojiContainer(!showEmojiContainer);
                    setShowGifContainer(false);
                    setShowImagePreview(false);
                  }}
                >
                    <img src={feeling} alt="" />
                </li>
            </ul>
            <Input
              ref={messageInputRef}
              id="message"
              name="message"
              type="text"
              value={message}
              className="chat-input" labelText=""
              placeholder="Enter your message..."
              onFocus={() => setHasFocus(true)}
              onBlur={() => setHasFocus(false)}
              handleChange={(event) => setMessage(event.target.value)}
            />
        </form>
        {showImagePreview && !message && (
          <Button label={<FaPaperPlane />} className="paper" handleClick={handleImageClick} />
        )}
      </div>
    </>
  )
}

MessageInput.propTypes = {
  setChatMessage: PropTypes.func
}

export default MessageInput;
