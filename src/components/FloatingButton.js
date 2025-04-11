import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

const FloatingButton = ({ onClick, isOpen, state, style }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [animate, setAnimate] = useState(false);

  // 버튼 클릭 시 약간의 애니메이션을 위한 상태 업데이트
  const handleClick = () => {
    setAnimate(true);
    onClick();
    setTimeout(() => setAnimate(false), 500); // 300ms 후 애니메이션 종료 (transition duration과 맞춤)
  };

  const defaultStyle = {
    position: 'fixed',
    bottom: '2rem',
    right: '1rem',
    width: '3rem',
    height: '3rem',
    fontSize: '1.4rem',
    borderRadius: '50%',
    backgroundColor: '#aaaaaa',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    zIndex: 1100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.5s ease, transform 0.5s ease',
    ...style
  };

  const hoverStyle = isHovered ? { transform: 'scale(1.2)' } : {};

  // 공통 아이콘 컨테이너 스타일 (애니메이션 적용)
  const iconContainerStyle = {
    position: 'absolute',
    transition: 'opacity 0.5s ease, transform 0.5s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  // 각각의 아이콘에 적용될 스타일 (isOpen에 따라 보이거나 숨김)
  const xmarkStyle = {
    ...iconContainerStyle,
    opacity: isOpen ? 1 : 0,
    transform: isOpen ? (animate ? 'scale(1.2)' : 'scale(1)') : 'scale(0.8)',
  };
  
  // 각각의 아이콘에 적용될 스타일 (isOpen에 따라 보이거나 숨김)
  const barsStyle = {
    ...iconContainerStyle,
    opacity: isOpen ? 0 : 1,
    transform: isOpen ? 'scale(0.8)' : (animate ? 'scale(1.2)' : 'scale(1)'),
  };

  return (
    <div>
      { !state && (
        <button 
          style={{ ...defaultStyle, ...hoverStyle }} 
          onClick={handleClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          >
          {/* 두 아이콘을 겹쳐서 배치 */}
          <div style={xmarkStyle}>
            <FontAwesomeIcon icon={faXmark} />
          </div>
          <div style={barsStyle}>
            <FontAwesomeIcon icon={faBars} />
          </div>
        </button>
      
      )}
    </div>
  );
};

// 필수 프로퍼티 설정
FloatingButton.propTypes = {
  onClick: PropTypes.func.isRequired, // 필수 프로퍼티
  isOpen: PropTypes.bool.isRequired,  // 필수 프로퍼티
  state: PropTypes.bool.isRequired,   // 필수 프로퍼티
  style: PropTypes.object,            // 선택적 프로퍼티
};

// 프로퍼티 기본값 설정
FloatingButton.defaultProps = {
  state: true,
  style: {},
};


export default FloatingButton;
