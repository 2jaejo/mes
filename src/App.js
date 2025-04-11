import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'; // v6: Routes와 Route 사용

import Main from './Main'; 
import Admin from './admin/Admin';
import Login from './components/Login';

// 유틸
import axiosInstance from "./utils/Axios";

// 테마
import { GlobalProvider } from "./utils/GlobalContext";
import { ThemeProvider } from "./utils/ThemeContext";

// 보호된 메인 컴포넌트 (로그인 필요)
const ProtectedPage = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const startTime = Date.now(); // 요청 전 시간 기록
   
    
    axiosInstance
    .get("/auth/validate")
    .then((res) => {
      console.log("app.js validate ok");
      const endTime = Date.now(); // 응답 시간을 측정
      const responseTime = endTime - startTime; // 응답 시간 (밀리초)
      const delay = responseTime < 500 ? 500 - responseTime : 0; // 응답 시간이 0.5초보다 빠르면 남은 시간만큼 지연
      // 지연 후 응답을 출력
      setTimeout(async () => {
        setLoading(false);
      }, delay);
      
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      navigate("/login");
    });

  }, [navigate]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div>
          <button className="btn btn-primary" type="button" disabled>
            <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
            Loading...
          </button>
        </div>
      </div>
    );
  }

  return <Main />;
};

function App() {
  
  return (
    <GlobalProvider>
      <ThemeProvider>
        <Router>
          <Routes>
            <Route index path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedPage />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </GlobalProvider>
  );
}

export default App;
