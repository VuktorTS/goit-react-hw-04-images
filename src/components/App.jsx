import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Button } from './Button/Button';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Loader } from './Loader/Loader';
import { Modal } from './Modal/Modal';
import { Searchbar } from './Searchbar/Searchbar';

import { STATUSES } from 'utils/constants';
import { getImages } from 'services/pixabayApi';

import css from './App.module.css';

export const App = () => {
  const [searchImage, setSearchImage] = useState('');
  const [status, setStatus] = useState(STATUSES.idle);
  const [page, setPage] = useState(1);
  const [tags, setTags] = useState('');
  const [images, setImages] = useState([]);
  const [totalPages, setTotalPages] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [largeImageURL, setLargeImageURL] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (searchImage === '') {
      return;
    }

    const addImages = async () => {
      try {
        setStatus(STATUSES.pending);
        const { hits, totalHits } = await getImages(searchImage, page);
        setStatus(STATUSES.success);

        if (hits.length === 0) {
          toast.error('Sorry, there are no images matching your search query.');
          setStatus(STATUSES.idle);
          return;
        }

        const updateTotalPages = Math.ceil(totalHits / 12);
        setTotalPages(updateTotalPages);
        setImages(prevState => [...prevState, ...hits]);

        if (page === updateTotalPages) {
          toast.success(
            'Sorry, there are no more images matching your search query.'
          );
        }
      } catch (error) {
        setError(error.message);
        setStatus(STATUSES.error);
      }
    };

    addImages();
  }, [searchImage, page]);

  useEffect(() => {
    if (error) {
      toast.error(`Something went wrong! ${error}`);
    }
  }, [error]);

  const openModal = (largeImageURL, tags) => {
    setShowModal(true);
    setTags(tags);
    setLargeImageURL(largeImageURL);
  };

  const closeModal = () => {
    setShowModal(false);
    setTags('');
  };

  const onClickLodeMore = () => {
    setPage(prevState => prevState + 1);
  };

  const handleSubmit = query => {
    if (searchImage === query) {
      toast.success('You are already seeing images for this request.');
      return;
    }
    setSearchImage(query);
    setImages([]);
    setPage(1);
  };

  const showLoadMore = status === STATUSES.success && page !== totalPages;

  return (
    <div className={css.main}>
      <Searchbar onSubmit={handleSubmit} />
      {images.length > 0 && (
        <ImageGallery images={images} onClickModal={openModal} />
      )}
      {status === STATUSES.pending && <Loader />}
      {showModal && (
        <Modal imgUrl={largeImageURL} onCloseModal={closeModal} tags={tags} />
      )}
      {showLoadMore && <Button onClick={onClickLodeMore} />}
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};
