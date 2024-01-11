// src/app/landing.js
"use client";
import React, { useState } from "react"; // Add import statement for React
import { Input, Button, Card } from "antd";
import { UserOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";

const LandingPage = () => {
  const router = useRouter();

  const [UserName, setUserName] = useState("");

  const [Groupname, setGroupname] = useState("");

  const handleUserNameChange = (e) => {
    setUserName(e.target.value);
  };
  const handlegroupnameChange = (e) => {
    setGroupname(e.target.value);
  };

  const handleJoinChat = () => {
    if (UserName.trim() !== "") {
      console.log("handleJoinChat", "UserName", UserName);
      router.push(
        `/chat?username=${encodeURIComponent(
          UserName
        )}&groupname=${encodeURIComponent(Groupname)}`
      );
    }
  };

  return (
    <Card
      style={{
        width: "400px",
        margin: "100px auto",
        padding: "20px",
        textAlign: "center",
      }}
      title="Join Group Chat"
    >
      <Input
        size="large"
        placeholder="Username"
        prefix={<UserOutlined />}
        value={UserName}
        onChange={handleUserNameChange}
        style={{ marginBottom: "20px" }}
      />

      <Input
        size="large"
        placeholder="Enter Group Name"
        prefix={<UserOutlined />}
        value={Groupname}
        onChange={handlegroupnameChange}
        style={{ marginBottom: "20px" }}
      />
      <Button type="primary" onClick={handleJoinChat}>
        Join Group Chat
      </Button>
    </Card>
  );
};

export default LandingPage;
