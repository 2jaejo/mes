import { createContext, useState, useEffect } from "react";
import axiosInstance from "utils/Axios";


export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState({color:"#000000", bgColor:"#ffffff"});

  useEffect(() => {
    getTheme();
  }, []);

  const getTheme = (params) => {
    let data = {};
    axiosInstance
    .post("/users/getTheme",JSON.stringify(data))
    .then((res) => {
      setTheme({color:res.data[0].color, bgColor:res.data[0].bg_color});
 
    })
    .catch((error) => console.error("Error fetching data:", error));    
  };

 
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
