import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { WebSocketServer } from 'ws';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import machineRoutes from './routes/machineRoutes.js';

import authRoutes from './routes/authRoutes.js';

import dataRoutes from './routes/dataRoutes.js';

dotenv.config(); // โหลดค่าจาก .env

// สร้างแอปพลิเคชัน Express
const app = express();

// ใช้งาน body-parser เพื่อ parse JSON จาก request body
app.use(bodyParser.json());

// เชื่อมต่อฐานข้อมูล MongoDB
connectDB();

// ตั้งค่า CORS
app.use(cors({
    origin: 'http://localhost:3001',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ใช้ routes ที่แยกออกมา
app.use('/api/users', userRoutes); // ใช้ router สำหรับผู้ใช้
app.use('/api/machine', machineRoutes); // ใช้ router สำหรับข้อมูลเครื่องจักร
app.use('/api/auth', authRoutes); // ใช้งาน route สำหรับขอ API Key
app.use('/api/data', dataRoutes); // ใช้งาน route สำหรับรับข้อมูล

// WebSocket server
const wss = new WebSocketServer({ port: 8001 });
wss.on('connection', (ws) => {
    console.log('WebSocket connection established');
    ws.on('message', (message) => {
        console.log("Received message:", message);
        // ... (จัดการกับข้อมูลที่ได้รับจาก WebSocket)
    });
});

// เริ่มต้น REST API server
const REST_PORT = 3030;
app.listen(REST_PORT, () => {
    console.log(`REST API running on http://localhost:${REST_PORT}`);
});
