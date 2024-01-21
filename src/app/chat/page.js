// src/app/chat/page.js
"use client";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Input, Flex, Button, Card, List, Avatar } from "antd";
import { io } from "socket.io-client";
import { SendOutlined } from "@ant-design/icons";
import { Picker } from "emoji-mart";

import "../../styles/chat.css";

const socket = io("http://localhost:3001"); // Update with your server URL

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const params = useSearchParams();
  const [isTyping, setIsTyping] = useState(false);
  const UserName = params.get("username");
  const Groupname = params.get("groupname");
  const [userCount, setUserCount] = useState(1);
  const [typingUsers, setTypingUsers] = useState({});

  const emitTyping = (typing) => {
    socket.emit("typing", { Groupname, UserName, typing });
  };

  useEffect(() => {
    console.log("Attempting to connect...");

    const socket = io("http://localhost:3001");

    socket.on("connect", () => {
      console.log("Socket connected:", socket.connected);

      // Join the room with the UserName
      socket.emit("join", Groupname, UserName);

      socket.on("message", (data) => {
        console.log("Message received:", data);
        setMessages((prevMessages) => [...prevMessages, data]);
      });

      socket.on("userCount", (count) => {
        setUserCount(count);
      });

      socket.on("typing", ({ UserName, typing }) => {
        console.log(`${UserName} is ${typing ? "typing" : "not typing"}`);
        setIsTyping(typing);
        setTypingUsers((prevTypingUsers) => ({
          ...prevTypingUsers,
          [UserName]: typing,
        }));
      });

      socket.on("disconnect", () => {
        console.log("Socket disconnected");
      });
    });

    socket.on("connect_error", (err) => {
      console.error("Connection error:", err);
    });

    return () => {
      console.log("Cleanup: Disconnecting socket");
      socket.disconnect();
    };
  }, [UserName]);

  const handleMessageChange = (e) => {
    setMessage(e.target.value);

    if (e.target.value.trim() !== "" && !isTyping) {
      setIsTyping(true);
      emitTyping(true);
    }

    // Stop typing
    if (e.target.value.trim() === "" && isTyping) {
      setIsTyping(false);
      emitTyping(false);
    }
  };

  const sendMessage = () => {
    console.log("send message", "UserName", UserName, "message", message);
    if (message.trim() !== "") {
      // Send the message to the server
      const data = { Groupname, UserName, message };
      socket.emit("message", data);

      emitTyping(false);

      setTypingUsers({});

      setMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <Flex gap="middle" align="center" wrap="wrap">
      <Card
        style={{
          width: "100%",
          height: "400 px",
          maxHeight: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
        title={`Welcome to Group Chat, ${Groupname} (${userCount} online)`}
      >
        <div>
          <List
            className="message-list"
            itemLayout="horizontal"
            dataSource={[...messages]}
            renderItem={(msg, index) => (
              <List.Item
                key={index}
                className={
                  msg.UserName === UserName
                    ? "sent-message"
                    : "received-message"
                }
              >
                <List.Item.Meta
                  avatar={
                    msg.UserName === UserName ? null : (
                      <Avatar>{msg.UserName[0]}</Avatar>
                    )
                  }
                  title={msg.UserName === UserName ? "You" : msg.UserName}
                  description={msg.message}
                />
              </List.Item>
            )}
          />
          {Object.entries(typingUsers).map(
            ([user, typing]) =>
              user !== UserName &&
              typing && (
                <div key={user}>{`${user} is ${
                  typing ? "typing" : "not typing"
                }`}</div>
              )
          )}{" "}
        </div>
        <div style={{ width: "100%" }}>
          <Input
            style={{ width: "90%", borderRadius: "4px 0 0 4px" }}
            value={message}
            placeholder="Type a message..."
            onChange={handleMessageChange}
            onKeyDown={handleKeyPress} // Add keyDown event listener
          />
          <Button
            style={{ width: "10%", borderRadius: "0 4px 4px 0" }}
            type="primary"
            onClick={sendMessage}
          >
            <SendOutlined />
          </Button>
        </div>
      </Card>
    </Flex>
  );
};

export default Chat;
