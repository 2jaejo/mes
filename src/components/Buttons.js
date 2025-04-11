import React from "react";

const Buttons = ({ buttonData, align="end" }) => {
  const styles = {
    buttonContainer: {
      display: 'flex',       // Flexbox로 가로 정렬
      justifyContent: align, // 버튼들을 가로로 중앙 정렬
      gap: '0.5rem',           // 버튼 간의 간격을 10px로 설정
    },
  };

  return (
    <div style={styles.buttonContainer}>
      {buttonData.map((button, index) => (
        <button 
          key={index} 
          className={button.className}
          onClick={button.onClick}  
        >
          {button.label}
        </button>
      ))}
    </div>
  );
};


export default Buttons;