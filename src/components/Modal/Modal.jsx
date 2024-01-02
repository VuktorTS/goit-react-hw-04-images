import { useEffect } from 'react';
import css from './Modal.module.css';

export const Modal = ({ imgUrl, tags, onCloseModal }) => {
  useEffect(() => {
    const onClickESC = e => {
      if (e.code === 'Escape') {
        onCloseModal();
      }
    };
    window.addEventListener('keydown', onClickESC);
    return () => {
      window.removeEventListener('keydown', onClickESC);
    };
  }, [onCloseModal]);

  const handleCloseModal = e => {
    if (e.target === e.currentTarget) {
      onCloseModal();
    }
  };

  return (
    <div className={css.overlay} onClick={handleCloseModal}>
      <div className={css.modal}>
        <img src={imgUrl} alt={tags} />
      </div>
    </div>
  );
};
