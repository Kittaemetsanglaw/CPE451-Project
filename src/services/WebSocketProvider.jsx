// src/components/WebSocketProvider.js
import React, { createContext, useEffect, useState } from 'react';

export const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const [data, setData] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null); // เก็บ socket ไว้ใน state

  const DataKey = 'e57972d26910e9d9e4caf68fd941c775'; 

  useEffect(() => {
    const newSocket = new WebSocket('ws://technest.ddns.net:8001/ws');
    setSocket(newSocket); // เก็บ socket ใน state

    newSocket.addEventListener("open", (event) => {
      setIsConnected(true);
      setError(null); // Reset error state
      console.log('WebSocket connection established');
      // ส่ง DataKey ไปยังเซิร์ฟเวอร์เมื่อเชื่อมต่อสำเร็จ
      newSocket.send(DataKey);
    });

    // Listen for messages
    newSocket.addEventListener("message", (event) => {
      console.log("Message from server ", event.data);
      try {
        const receivedData = JSON.parse(event.data);
        console.log('Parsed data:', receivedData);
        setData(receivedData);
      } catch (error) {
        console.warn('Received non-JSON data:', event.data);
        if (event.data === "Connection authorized") {
          console.log("Connection authorized by server.");
        } else {
          console.error('Error parsing data:', error);
        }
      }
    });

    newSocket.addEventListener("close", () => {
      setIsConnected(false);
      console.log('WebSocket connection closed');
    });

    newSocket.addEventListener("error", (error) => {
      setError(error);
      console.error('WebSocket error:', error);
    });

    // Cleanup function to close the socket when the component unmounts
    return () => {
      newSocket.close();
    };
  }, []); // Dependency array is empty to run only on mount and unmount

  // ฟังก์ชันในการส่งข้อมูลวันเริ่มต้นและวันสิ้นสุด
  const sendDateRange = (startDate, endDate) => {
    if (socket && isConnected) {
      const message = JSON.stringify({ startDate, endDate });
      socket.send(message);
      console.log('Sent date range to server:', message);
    } else {
      console.error('WebSocket is not connected');
    }
  };

  return (
    <WebSocketContext.Provider value={{ data, isConnected, error, sendDateRange }}>
      {children}
    </WebSocketContext.Provider>
  );
};