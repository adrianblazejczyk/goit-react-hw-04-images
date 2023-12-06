import css from './Modal.module.css';
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

export const Modal = ({ selectedImage, onCloseModal }) => {
  useEffect(() => {
    const handleKeyDown = event => {
      if (event.key === 'Escape') {
        onCloseModal();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleCloseModal = event => {
    onCloseModal();
  };

  return (
    <div className={css.overlay} onClick={handleCloseModal}>
      <div className={css.modal}>
        <img src={selectedImage.largeImageURL} alt={selectedImage.tags} />
      </div>
    </div>
  );
};

Modal.propTypes = {
  selectedImage: PropTypes.shape({
    largeImageURL: PropTypes.string.isRequired,
    tags: PropTypes.string.isRequired,
  }).isRequired,
  onCloseModal: PropTypes.func.isRequired,
};
