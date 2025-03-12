// Dashboard.jsx
import React, { useContext, useState, useEffect, useRef } from 'react';
import { WebSocketContext } from '../../services/WebSocketProvider.jsx';
import ChartComponent from '../MyChart/ChartComponent.jsx';
import WaveformChart from '../../assets/sound/WaveformChart.jsx';


const Dashboard = () => {
  const { data, isConnected } = useContext(WebSocketContext);
  const [isDataRunning, setIsDataRunning] = useState(true);
  const audioRef = useRef(null); // สร้าง ref สำหรับ audio element

  // Resume AudioContext ที่อยู่ใน WaveformChart
  audioRef.current?.resume();

  const toggleData = () => {
    setIsDataRunning((prev) => !prev);
  };

  // โหลดไฟล์เสียงและแปลงเป็นข้อมูลคลื่นเสียง
  useEffect(() => {
    const loadAudioData = async () => {
      const response = await fetch('../../assets/sound/Exsamples/Cycle1.wav'); // เปลี่ยนเป็น path ของไฟล์เสียง
      const arrayBuffer = await response.arrayBuffer();
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      const channelData = audioBuffer.getChannelData(0); // ใช้แค่ช่องแรก
      setAudioData(Array.from(channelData));
    };

    loadAudioData();
  }, []);

  return (
    <div className="flex-1 bg-gray-50 text-black p-4 grid grid-cols-3 gap-4 h-screen">
      <div className="bg-white rounded-lg p-4 shadow-md col-span-1">
        <h2 className="font-bold text-lg mb-2">รายชื่อนักศึกษา</h2>
        <p>{isConnected ? "Connected" : "Disconnected"}</p>
        <p>Latest Power Consumption: {isDataRunning && data ? data["Energy Consumption"].Power.toFixed(2) + ' W' : 'N/A'}</p>
        <p>Latest Pressure: {isDataRunning && data ? data.Pressure.toFixed(2) + ' Pa' : 'N/A'}</p>
        <p>Latest Force: {isDataRunning && data ? data.Force.toFixed(2) + ' N' : 'N/A'}</p>
        <p>Position of the Punch: {isDataRunning && data ? data["Position of the Punch"].toFixed(2) + ' mm' : 'N/A'}</p>
      </div>
      <div className="bg-white text-black rounded-lg p-4 shadow-md col-span-2">
        <h2 className="font-bold text-lg mb-2">Machine Chart</h2>
        <ChartComponent isDataRunning={isDataRunning} toggleData={toggleData} />
      </div>
    </div>
  );
};

export default Dashboard;