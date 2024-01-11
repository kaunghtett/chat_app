// src/app/chat/page.js
"use client";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Input, Flex, Button, Card, List, Avatar } from "antd";
import { io } from "socket.io-client";
import { SendOutlined } from "@ant-design/icons";

import "../../styles/chat.css";

const socket = io("http://localhost:3001"); // Update with your server URL

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const params = useSearchParams();
  const UserName = params.get("username");
  const Groupname = params.get("groupname");
  console.log("UserName", UserName);
  console.log("messages", messages);

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
  };

  const sendMessage = () => {
    console.log("send message", "UserName", UserName, "message", message);
    if (message.trim() !== "") {
      // Send the message to the server
      const data = { Groupname, UserName, message };
      socket.emit("message", data);

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
        title={`Welcome to Group Chat, ${Groupname}`}
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
        </div>
        <div style={{ width: "100%" }}>
          <Input
            style={{ width: "90%", borderRadius: "4px 0 0 4px" }}
            value={message}
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
