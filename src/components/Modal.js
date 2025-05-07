import React, { useState, forwardRef, useImperativeHandle } from 'react';
import styles from '../css/Modal.module.css';


const Modal = forwardRef(( _, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalOptions, setModalOptions] = useState({});

  // 부모 컴포넌트에서 ref를 통해 open, close를 호출할 수 있도록 설정
  useImperativeHandle(ref, () => ({
    open: (options = {}) => {
      // 옵션 업데이트
      setModalOptions((prevOptions) => ({ 
        title:"알림",
        closeBtn: true,
        message:"",
        fields:[],
        content: <div></div>,
        cancelText:"취소",
        cancelClass:"btn btn-secondary",
        confirmText:"확인",
        confirmClass:"btn btn-primary",
        onCancel:()=>{setIsOpen(false)},
        onConfirm:()=>{setIsOpen(false)},
        ...options 
      })); 
      setIsOpen(true);
    },
    close: () => setIsOpen(false),
  }));


  const onCancle = (() => {
    modalOptions.onCancel(false);
  });
  
  const onConfirm = (() => {
    modalOptions.onConfirm(true);
  });


  if (!isOpen) return null;

  return (
    <div className={styles.fullscreenCenter}>
      <div className={styles.modal}>
        <div className="mb-2 d-flex justify-content-between">
          {/* title */}
          {modalOptions.title && (
            <h4 style={{ fontWeight: "bold", marginBottom: 0 }}>{modalOptions.title}</h4>
          )}

          {/* closeBtn */}
          {modalOptions.closeBtn && (
            <button
              onClick={onCancle}
              className="btn btn-sm btn-outline-secondary"
            >
              <i className="bi bi-x-lg"></i>
            </button>
          )}
        </div>

        {/* message */}
        {modalOptions.message && (
          <div style={{ padding: "10px" }}>
            <span>{modalOptions.message}</span>
          </div>
        )}

        {/* content */}
        {modalOptions.content}

        {/* button */}
        <div className={styles.buttonContainer}>
          {modalOptions.cancelText !== "" && (
            <button
              onClick={onCancle}
              className={`${modalOptions.cancelClass}`}
            >
              {modalOptions.cancelText}
            </button>
          )}
          {modalOptions.confirmText !== "" && (
            <button
              onClick={onConfirm}
              className={`${modalOptions.confirmClass}`}
            >
              {modalOptions.confirmText}
            </button>
          )}
        </div>

      </div>
    </div>
  );
});

export default Modal;