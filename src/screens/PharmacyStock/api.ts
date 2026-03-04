/**
 * API Configuration
 * 
 * Update API_HOST to your backend's IP address
 * 
 * For development:
 * - Run: ipconfig (on Windows) or ifconfig (on Mac/Linux)
 * - Find your IPv4 Address (usually 192.168.x.x or 10.x.x.x)
 * - Replace API_HOST below
 * 
 * Examples:
 * - Local development: http://127.0.0.1:8000
 * - Real device on same network: http://192.168.1.XXX:8000
 */

// 🔧 UPDATE THIS WITH YOUR BACKEND IP
export const API_HOST = "http://192.168.1.3:8000";  // Replace XXX with your actual IP

// Build the full API URL
export const API_URL = `${API_HOST}/api`;

console.log("🔗 Backend URL:", API_URL);