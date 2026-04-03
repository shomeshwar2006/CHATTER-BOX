import React, { useEffect, useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import axios from "axios";
import {
  Box,
  Button,
  useToast,
  Stack,
  Text,
  Avatar,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

// If you created these files, import them correctly
import ChatLoading from "../components/ChatLoading";
import { getSender } from "../config/ChatLogics";
import GrouChatModal from "./miscellaneous/GrouChatModal";

const MyChats = ({fetchAgain}) => {
  const [loggedUser, setLoggedUser] = useState();

  const { 
    user, 
    selectedChat, 
    setSelectedChat, 
    chats, 
    setChats,
    notification,        // ✅ ADD THIS
    setNotification      // ✅ ADD THIS
  } = ChatState();

    
  const toast = useToast();

  const fetchChats = async () => {
    try {
      console.log("HEADER:", `Bearer ${user.token}`);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
          
        },
      };

      const { data } = await axios.get("/api/chat", config);

      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    
    if (user) {
      fetchChats();
    }
  }, [fetchAgain, user]); // ✅ ADD user here

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GrouChatModal>
        <Button
          display="flex"
          fontSize={{ base: "17px", md: "10px", lg: "17px" }}
          rightIcon={<AddIcon />}
        >
          New Group Chat
        </Button>
        </GrouChatModal>
      </Box>

      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats && chats.length > 0 ? (
          <Stack overflowY="scroll">
{chats.map((chat) => {
  const isUnread = notification.some(
    (notif) => notif.chat._id === chat._id
  );

  return (
    <Box
      onClick={() => {
        setSelectedChat(chat);

        // ✅ remove unread when opened
        setNotification(
          notification.filter((n) => n.chat._id !== chat._id)
        );
      }}
      cursor="pointer"
      bg={selectedChat?._id === chat._id ? "#191970" : "#E8E8E8"}
      color={selectedChat?._id === chat._id ? "white" : "black"}
      px={3}
      py={3}
      borderRadius="lg"
      key={chat._id}
      _hover={{
        background: "#4169E1",
        color: "white",
      }}
    >
      <Box display="flex" alignItems="center" justifyContent="space-between">
        
        {/* LEFT SIDE */}
        <Box display="flex" alignItems="center" gap={3}>
          <Avatar
            size="md"
            name={
              !chat.isGroupChat
                ? getSender(loggedUser, chat.users)
                : chat.chatName
            }
            src={
              !chat.isGroupChat
                ? chat.users.find((u) => u._id !== loggedUser._id)?.pic
                : undefined
            }
            bg={chat.isGroupChat ? "blue.500" : "gray.400"}
          />

          <Box>
            <Text fontWeight="600">
              {!chat.isGroupChat
                ? getSender(loggedUser, chat.users)
                : chat.chatName}
            </Text>

            {/* Latest Message */}
{chat.latestMessage && (
  <Text 
    fontSize="sm" 
    // If the chat is selected (dark blue), use white. 
    // Otherwise, keep it gray for the unselected (light gray) items.
    color={selectedChat === chat ? "white" : "gray.600"} 
  >
    {chat.isGroupChat
      ? `${chat.latestMessage.sender.name}: `
      : ""}
    {chat.latestMessage.content.length > 30
      ? chat.latestMessage.content.substring(0, 30) + "..."
      : chat.latestMessage.content}
  </Text>
)}
          </Box>
        </Box>

        
        {isUnread && (
  <Box
    bg="blue.500"
    color="white"
    borderRadius="full"
    px={1}
    py={1}
    fontSize="xs"
    minW="20px"
    textAlign="center"
    w="25px"
    h="25px"
    animation="pulse 1.5s infinite"
  >
    {
      notification.filter(
        (n) => n.chat._id === chat._id
      ).length
    }
  </Box>
)}
        
        

      </Box>
    </Box>
  );
})}</Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;