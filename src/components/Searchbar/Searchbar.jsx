import React, { useState } from 'react';
import css from './Searchbar.module.css';
import { toast } from 'react-toastify';

export const Searchbar = ({ onSubmit }) => {
  const [inputValue, setInputValue] = useState('');

  const handleChange = e => {
    setInputValue(e.currentTarget.value);
  };

  const handleSubmit = e => {
    e.preventDefault();

    const value = inputValue.trim();

    if (value === '') {
      toast.info('Enter the query word');
      return;
    }

    onSubmit(value);
    resetForm();
  };

  const resetForm = () => {
    setInputValue('');
  };

  return (
    <header className={css.searchbar}>
      <form className={css.form} onSubmit={handleSubmit}>
        <button type="submit" className={css.button}>
          <span className={css.buttonLabel}>Search</span>
        </button>

        <input
          className={css.input}
          type="text"
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
          onChange={handleChange}
          value={inputValue}
        />
      </form>
    </header>
  );
};
