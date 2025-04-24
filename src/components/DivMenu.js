import React, { useRef, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';

const DivMenu = ({ title, className, menuList, expandedMenu, handleMenuToggle, addTab }) => {
  const isExpanded = expandedMenu.includes(className);
  const contentRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isExpanded ? contentRef.current.scrollHeight : 0);
    }
  }, [isExpanded]);

  return (
    <>
      <li
        className={isExpanded ? 'expanded' : ''}
        onClick={() => handleMenuToggle(className)}
      >
        {title}
        <FontAwesomeIcon
          icon={isExpanded ? faChevronUp : faChevronDown}
          className="menu-icon"
        />
      </li>
      
      <ul
        ref={contentRef}
        className="submenu"
        style={{
          height: `${height}px`,
          overflow: "hidden",
          transition: "height 0.3s ease-in-out",
        }} 
      >
        {menuList.map((menu) => (
          <li key={menu} onClick={() => addTab(menu)}>
            {menu}
          </li>
        ))}
      </ul>
      
    </>
  );
};

export default DivMenu;
