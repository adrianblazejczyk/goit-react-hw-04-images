import css from './SearchBar.module.css';
import React, { useState } from 'react';
import PropTypes from 'prop-types';

export const SearchBar = ({ onSubmit }) => {
  const [searchKey, setSearchKey] = useState('');

  const handleChange = evt => {
    const { value } = evt.target;
    setSearchKey(value);
  };

  const handleSubmit = evt => {
    evt.preventDefault();
    onSubmit(searchKey);
    reset();
  };

  const reset = () => {
    setSearchKey('');
  };

  return (
    <header className={css.searchBar}>
      <form onSubmit={handleSubmit} className={css.searchForm}>
        <button type="submit" className={css.searchFormButton}>
          <span className={css.searchFormButtonLabel}>Search</span>
        </button>

        <input
          className={css.searchFormInput}
          type="text"
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
          name="searchKey"
          value={searchKey}
          onChange={handleChange}
        />
      </form>
    </header>
  );
};

SearchBar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
