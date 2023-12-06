import css from './ImageGallery.module.css';
import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import { ImageGalleryItem } from '../../components';

export const ImageGallery = ({ hits, onImageClick }) => {
  const lastNewImageRef = useRef(null);

  useEffect(() => {
    scrollToLastNewImage.current();
  }, [hits]);

  const scrollToLastNewImage = useRef(() => {
    if (lastNewImageRef.current) {
      lastNewImageRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
    }
  });

  return (
    <ul className={css.imageGallery}>
      {hits.map((item, index) => (
        <ImageGalleryItem
          key={item.id}
          id={item.id}
          imageUrl={item.webformatURL}
          imageTags={item.tags}
          onImageClick={onImageClick}
          forwardedRef={index === hits.length - 1 ? lastNewImageRef : null}
        ></ImageGalleryItem>
      ))}
    </ul>
  );
};

ImageGallery.propTypes = {
  hits: PropTypes.array.isRequired,
  onImageClick: PropTypes.func.isRequired,
};
