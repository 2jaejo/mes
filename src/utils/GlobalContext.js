import { createContext, useState, useEffect } from "react";

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  // 임시 저장을 위한 로컬스토리지 사용 - 데이터베이스 변경 필요
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [isTab, setIsTab] = useState(localStorage.getItem("isTab") || true);
  const [sidebar, setSidebar] = useState({
    isDesktop: window.innerWidth > 768,
    isOpen : false,
  });
  
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);
  
  useEffect(() => {
    localStorage.setItem("isTab", isTab);
  }, [isTab]);

  const toggleTheme = () => {
    console.log("toggleTheme");
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };
  
  const toggleTab = () => {
    console.log("toggleTab");
    setIsTab((prev) => (prev === true ? false : true));
  };

  const toggleSidebar = () => {
    console.log("toggleSidebar");
    setSidebar((prev) => ({
      ...prev,
      isOpen: !prev.isOpen
    }));
  };

  useEffect(() => {
    setSidebar((prev) => ({
      ...prev,
      toggle: toggleSidebar
    }));
  }, []);

  // 윈도우 크기 변경 시 상태 업데이트
  useEffect(() => {
    const handleResize = () => {
      setSidebar({isDesktop: window.innerWidth > 768});
    };
    // 윈도우 사이즈 변경 이벤트 리스너 추가
    window.addEventListener('resize', handleResize);
    // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  return (
    <GlobalContext.Provider value={{ theme, toggleTheme, isTab, toggleTab, sidebar, toggleSidebar}}>
      {children}
    </GlobalContext.Provider>
  );
};
