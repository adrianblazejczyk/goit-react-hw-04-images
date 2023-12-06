import css from './APP.module.css';
import { useState, useEffect } from 'react';
import Notiflix from 'notiflix';
import { SearchBar, Loader, ImageGallery, Button, Modal } from '../components';
import { searchImage } from '../services';

export const App = () => {
  const [hits, SetHits] = useState([]);
  const [searchKey, SetSearchKey] = useState('');
  const [totalPages, SetTotalPages] = useState(0);
  const [activePage, SetActivePage] = useState(1);
  const [isLoading, SetIsLoading] = useState(false);
  const [isOpenModal, SetIsOpenModal] = useState(false);
  const [selectedImageId, SetSelectedImageId] = useState(0);

  useEffect(() => {
    if (searchKey) {
      SetIsLoading(true);

      searchImage(searchKey, activePage)
        .then(response => {
          if (!response.totalHits) {
            Notiflix.Notify.warning(
              'Sorry, there are no images matching your search query. Please try again.'
            );
          }
          if (activePage > 1) {
            SetHits(prevHits => [...prevHits, ...response.hits]);
          } else {
            Notiflix.Notify.success(`We found ${response.totalHits} images.`);
            SetHits([...response.hits]);
            SetTotalPages(Math.floor(response.totalHits / 12));
          }
          if (activePage > Math.floor(response.totalHits / 12)) {
            Notiflix.Notify.warning(
              'All images from the database are displayed'
            );
          }
        })

        .catch(error => {
          Notiflix.Notify.failure('Something went wrong! Please, try again.');
          console.log(error);
        })
        .finally(() => {
          SetIsLoading(false);
        });
    }
  }, [activePage, searchKey]);

  const handlerSearch = searchKey => {
    SetSearchKey(searchKey);
    SetActivePage(1);
  };

  const handlerLoadMoreImage = () => {
    SetActivePage(prevActivePage => prevActivePage + 1);
  };

  const handlerOpenModal = eve => {
    const { id } = eve.target;
    const numericId = parseInt(id, 10);
    SetSelectedImageId(numericId);
    SetIsOpenModal(true);
  };
  const handlerCloseModal = () => {
    SetIsOpenModal(false);
  };

  let selectedImage = null;

  if (selectedImageId) {
    selectedImage = hits.find(item => item.id === selectedImageId);
  }
  return (
    <div className={css.App}>
      <SearchBar onSubmit={handlerSearch} />

      {hits.length > 0 && (
        <ImageGallery
          hits={hits}
          onImageClick={handlerOpenModal}
        ></ImageGallery>
      )}
      {isLoading && <Loader />}

      {totalPages >= activePage && (
        <Button onClick={handlerLoadMoreImage}></Button>
      )}
      {isOpenModal && (
        <Modal
          selectedImage={selectedImage}
          onCloseModal={handlerCloseModal}
        ></Modal>
      )}
    </div>
  );
};
