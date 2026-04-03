import React from 'react'
import ScrollableFeed from 'react-scrollable-feed'
import { ChatState } from "../Context/ChatProvider";
import { Avatar, Tooltip } from "@chakra-ui/react"
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from '../config/ChatLogics';

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  return (
    <ScrollableFeed>
       
       {messages &&
        messages.map((m, i) => (
          
            <div style={{ display: "flex" }} key={m._id}>
              {console.log("FILE URL:", m.fileUrl)}
                {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={m.sender.name}
                  src={m.sender.pic}
                />
              </Tooltip>
            )}

<span 
  style={{
    background: `${
      m.sender._id === user._id
        ? "linear-gradient(135deg, #667eea, #764ba2)"
        : "linear-gradient(135deg, #93C5FD, #60A5FA)"
    }`,
    color: m.sender._id === user._id ? "white" : "black",
    backdropFilter: "blur(4px)",
    marginLeft: isSameSenderMargin(messages, m, i, user._id),
    marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
    borderRadius: "20px",
    padding: "5px 15px",
    maxWidth: "75%",
  }}
>
{m.isFile ? (
  m.fileUrl?.includes("image") ? (
    <img
      src={m.fileUrl}
      alt="file"
      style={{ maxWidth: "200px", borderRadius: "10px" }}
    />
  ) : (
    <a href={m.fileUrl} target="_blank" rel="noreferrer">
      📎 {m.content}
    </a>
  )
) : (
  m.content
)}
</span>
            </div>
        ))}

    </ScrollableFeed>
  )
}

export default ScrollableChat