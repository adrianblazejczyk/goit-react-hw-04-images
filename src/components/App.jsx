import css from './APP.module.css';
import { useState, useEffect } from 'react';
import Notiflix from 'notiflix';
import { SearchBar, Loader, ImageGallery, Button, Modal } from '../components';
import { searchImage } from '../services';

export const App = () => {
  const [hits, setHits] = useState([]);
  const [searchKey, setSearchKey] = useState('');
  const [totalPages, setTotalPages] = useState(0);
  const [activePage, setActivePage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [selectedHit, setSelectedHit] = useState({});

  useEffect(() => {
    if (!searchKey) return;
    setIsLoading(true);

    searchImage(searchKey, activePage)
      .then(response => {
        if (activePage > 1) {
          setHits(prevHits => [...prevHits, ...response.hits]);
        } else {
          Notiflix.Notify.success(`We found ${response.totalHits} images.`);
          setHits([...response.hits]);
          setTotalPages(Math.floor(response.totalHits / 12));
        }
        if (!response.totalHits) {
          Notiflix.Notify.warning(
            'Sorry, there are no images matching your search query. Please try again.'
          );
          return;
        }
        if (activePage > Math.floor(response.totalHits / 12)) {
          Notiflix.Notify.warning('All images from the database are displayed');
        }
      })

      .catch(error => {
        Notiflix.Notify.failure('Something went wrong! Please, try again.');
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [activePage, searchKey]);

  const handlerSearch = searchKey => {
    setSearchKey(searchKey);
    setActivePage(1);
  };

  const handlerLoadMoreImage = () => {
    setActivePage(prevActivePage => prevActivePage + 1);
  };

  const handlerOpenModal = eve => {
    const { id } = eve.target;
    const numericId = parseInt(id, 10);
    setSelectedHit(hits.find(item => item.id === numericId));
    setIsOpenModal(true);
  };

  const handlerCloseModal = () => {
    setIsOpenModal(false);
  };

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
          selectedImage={selectedHit}
          onCloseModal={handlerCloseModal}
        ></Modal>
      )}
    </div>
  );
};
