import React, { useState, useEffect } from "react";
import WebSocket from "../components/WebSocket";
import Forms from "../components/Forms";

// 유틸
import axiosInstance from "../utils/Axios";

function About() {
  const [isConnect, setIsConnect] = useState(false);
  const [searchQuery, setSearchQuery] = useState({});

  // 동적으로 생성할 입력 필드
  const fields = [
    { name: "date", type: "date", label: "날짜" },
    {
      name: "sel",
      type: "select",
      label: "선택",
      options: [
        { key: "전체", value: "" },
        { key: "선택1", value: "1" },
        { key: "선택2", value: "2" },
        { key: "선택3", value: "3" },
      ],
    },
    {
      name: "opt",
      type: "radio",
      label: "옵션",
      options: [
        { key: "옵션1", value: "1" },
        { key: "옵션2", value: "2" },
        { key: "옵션3", value: "3" },
      ],
    },
    { name: "name", type: "text", label: "이름" },
    { name: "num", type: "number", label: "번호" },
  ];

  // 검색창 데이터 변경시 호출되는 함수
  const handleSearchData = (data) => {
    setSearchQuery(data);
  };

  useEffect(() => {
    axiosInstance
      .get("/auth/validate")
      .then((res) => {
        setIsConnect(true);
      })
      .catch((error) => {
        setIsConnect(false);
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <div>
      <Forms id={"about"} fields={fields} onSearchData={handleSearchData} />
      <p>SearchBar 컴포넌트에서 전달된 데이터: {JSON.stringify(searchQuery, null, 2)}</p>

      <div>{isConnect ? <WebSocket /> : <div></div>}</div>
    </div>
  );
  ;
}

export default About;
