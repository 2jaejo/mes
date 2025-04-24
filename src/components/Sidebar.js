import React, { useContext } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { GlobalContext } from "../utils/GlobalContext";

const Sidebar = ({ content }) => {
  const { sidebar, toggleSidebar } = useContext(GlobalContext);

  const sidebarStyle = {
    zIndex: 10,
    height: "100%",
    width: "40%",
    position: "fixed",
    top: 0,
    left: sidebar.isOpen ? 0 : "-40%",
    transition: "0.5s ease"
  };

  return (
    <div 
      className="aside" 
      style={sidebar.isDesktop ? { } 
        : sidebarStyle
      }
    >
      {sidebar.isDesktop ? null
        : 
        <div className="d-flex justify-content-end align-items-center">
          <button className="btn btn-dark-outline" onClick={toggleSidebar}><FontAwesomeIcon icon={faTimes} /></button>
        </div>
      }
      
      <p>사이드바 내용</p>
    
      {/* content */}
      {content}

    </div>
  )
}

export default Sidebar;
