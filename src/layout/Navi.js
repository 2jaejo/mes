/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useContext } from 'react'
import { useNavigate } from "react-router-dom";

import CurrentTime from "../components/Today";
import { GlobalContext } from "../utils/GlobalContext";
import { ThemeContext } from "../utils/ThemeContext";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons'

const Navi = ({menu, addTab}) => {
  const { isTab, toggleTab } = useContext(GlobalContext);
  
  const { theme, setTheme } = useContext(ThemeContext);

  const navigate = useNavigate();

  const handleLogout = () => {
    // 🔹 1. 로컬 스토리지에서 토큰 정보 삭제
    localStorage.removeItem("accessToken");

    // 🔹 2. 로그인 페이지로 이동
    navigate("/login");
  };

  const menuItems = menu;

  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div className='navi d-flex justify-content-between align-items-center p-2' style={{backgroundColor:theme.bgColor}}>
    {/* <div className='navi d-flex justify-content-between align-items-center p-2' > */}
      <nav className="navbar navbar-expand-lg p-0">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0 d-flex flex-row" >
          {menuItems.map((menu, index) => (
            <li
              className="nav-item dropdown mx-3"
              key={index}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <a
                className="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded={hoveredIndex === index ? "true" : "false"}
                onClick={(e) => e.preventDefault()}
              >
                <span style={{color:theme.color}}>{menu.title}</span>
              </a>
              <ul
                className={`dropdown-menu show`}
                style={{
                  display: hoveredIndex === index ? 'block' : 'none',
                  backgroundColor:theme.bgColor
                }}
              >
                {menu.subMenu.map((item, idx) => (
                  <li key={idx}>
                    <a className="dropdown-item" href="#" onClick={() => addTab(menu.subMenu2[idx], item)}>
                      <span style={{color:theme.color}}>{item}</span>
                      {/* {item} */}
                    </a>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </nav>

      <div className="d-flex justify-content-end align-items-center gap-2">
        {/* <CurrentTime /> */}
        <button className="btn btn-sm btn-dark" onClick={handleLogout}>
          <FontAwesomeIcon icon={faArrowRightFromBracket} />
        </button>
      </div>
    </div>
  );

}


export default Navi;