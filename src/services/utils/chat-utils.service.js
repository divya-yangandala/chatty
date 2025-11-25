import { chatService } from "@services/api/chat/chat.service";
import { socketService } from "@services/socket/socket.service";
import { cloneDeep, find, findIndex, remove } from "lodash";
import { createSearchParams } from "react-router-dom";

export class ChatUtils {
  static privateChatMessages = [];
  static chatUsers = [];
  static hasJoinedRoom = false;

  // this function, we use it to listen for the user online events and then add the added to this set.
  static usersOnline(setOnlineUsers) {
    socketService?.socket?.on('user online', (data) => {
      setOnlineUsers(data);
    })
  }

  // It will listen for an event, add chat users to know users around the chat page.
  // And then if a particular user that's sent a message or received a message, we want to know if they
  // are already on the chat page.
  static usersOnChatPage() {
    socketService?.socket?.on('add chat users', (data) => {
      ChatUtils.chatUsers = [...data];
    })
  }

  // this object is what we are going to send to the back end
  static joinRoomEvent(user, profile) {
    console.log("user, profile:  ", user, profile);
    const users = {
      receiverId: user.receiverId,
      receiverName: user.receiverUsername,
      senderId: profile?._id,
      senderName: profile?.username
    }
    socketService?.socket?.emit('join room', users);
  }

  // this is just going to be like a reusable function. We passing an events and the data we want to emit
  static emitChatPageEvent(event, data) {
    socketService?.socket?.emit(event, data);
  }

  static chatUrlParams(user, profile) {
    const params = {username: '', id: ''};
    if (user.receiverUsername === profile?.username) {
      params.username = user.senderUsername.toLowerCase();
      params.id = user.senderId;
    } else {
      params.username = user.receiverUsername.toLowerCase();
      params.id = user.receiverId;
    }
    return params;
  }


  // this function just to construct the objects that will contain the message data to be sent to the backend.
  static messageData({
    receiver,
    message,
    searchParamsId,
    conversationId,
    chatMessages,
    isRead,
    gifUrl,
    selectedImage
  }) {
    const chatConversationId = find(
      chatMessages,
      (chat) => chat.receiverId === searchParamsId || chat.senderId === searchParamsId
    );  // return document matching the chat paramsId and receiverId
    const messageData = {
      conversationId: chatConversationId ? chatConversationId.conversationId : conversationId,
      receiverId: receiver?._id,
      receiverUsername: receiver?.username,
      receiverAvatarColor: receiver?.avatarColor,
      receiverProfilePicture: receiver?.profilePicture,
      body: message.trim(),
      isRead,
      gifUrl,
      selectedImage
    };
    return messageData;
  }

  static updateSelectedChatUser({
    chatMessageList,
    profile,
    username,
    setSelectedChatUser,
    params,
    pathname,
    navigate,
    dispatch
  }) {
    if (chatMessageList.length) {
      dispatch(setSelectedChatUser({ isLoading: false, user: chatMessageList[0] }));
      navigate(`${pathname}?${createSearchParams(params)}`);
    } else {
      dispatch(setSelectedChatUser({ isLoading: false, user: null }));
      const sender = find(
        ChatUtils.chatUsers,
        (user) => user.userOne === profile?.username && user.userTwo.toLowerCase() === username
      );
      if (sender) {
        chatService.removeChatUsers(sender);
      }
    }
  }

  static socketIOChatList(profile, chatMessageList, setChatMessageList) {
    socketService?.socket?.on('chat list', (data) => {
      if (data.senderUsername === profile?.username || data.receiverUsername === profile?.username) {
        const messageIndex = findIndex(chatMessageList, ['conversationId', data.conversationId]);
        chatMessageList = cloneDeep(chatMessageList);
        if (messageIndex > -1) {
          remove(chatMessageList, (chat) => chat.conversationId === data.conversationId);
        } else {
          remove(chatMessageList, (chat) => chat.receiverUsername === data.receiverUsername);
        }
        chatMessageList = [data, ...chatMessageList];
        setChatMessageList(chatMessageList);
      }
    })
  }

  static socketIOMessageReceived(chatMessages, username, setConversationId, setChatMessages) {
    chatMessages = cloneDeep(chatMessages);
    socketService?.socket?.on('message received', (data) => {
      if (data.senderUsername.toLowerCase() === username || data.receiverUsername.toLowerCase() === username) {
        setConversationId(data.conversationId);
        ChatUtils.privateChatMessages.push(data);
        chatMessages = [...ChatUtils.privateChatMessages];
        setChatMessages(chatMessages);
      }
    });

    socketService?.socket?.on('message read', (data) => {
      if (data.senderUsername.toLowerCase() === username || data.receiverUsername.toLowerCase() === username) {
        const findMessageIndex = findIndex(ChatUtils.privateChatMessages, ['_id', data._id]);
        if (findMessageIndex > -1) {
          ChatUtils.privateChatMessages.splice(findMessageIndex, 1, data);
          chatMessages = [...ChatUtils.privateChatMessages];
          setChatMessages(chatMessages);
        }
      }
    });
  }

  static socketIOMessageReaction(chatMessages, username, setConversationId, setChatMessages) {
    socketService?.socket?.on('message reaction', (data) => {
      if (data.senderUsername.toLowerCase() === username || data.receiverUsername.toLowerCase() === username) {
        chatMessages = cloneDeep(chatMessages);
        setConversationId(data.conversationId);
        const messageIndex = findIndex(chatMessages, (message) => message?._id === data._id);
        if (messageIndex > -1) {
          chatMessages.splice(messageIndex, 1, data);
          setChatMessages(chatMessages);
        }
      }
    });
  }
}
