"use client"
import React, { useRef } from 'react'
import styles from './exampleNavbar.module.css'

const ExampleNavbar = () => {
  const listRef = useRef(null);

  const scrollLeft = () => {
    listRef.current.scrollBy({ left: -100, behavior: 'smooth' });
  };

  const scrollRight = () => {
    listRef.current.scrollBy({ left: 100, behavior: 'smooth' });
  };

  return (
    <div className='container position-relative'>
      <button
        className={styles.scrollBtn}
        style={{ left: 0 }}
        onClick={scrollLeft}
        aria-label="Scroll left"
      >
        &lt;
      </button>
      <ul
        ref={listRef}
        className={`${styles.navbarList} d-flex list-unstyled gap-3 justify-content-center px-3`}
        style={{ position: 'relative' }}
      >
          <li>
              <a href="#home">Home</a>
          </li>
          <li>
              <a href="#about">About</a>
          </li>
          <li>
              <a href="#services">Services</a>
          </li>
          <li>
              <a href="#contact">Contact</a>
          </li>
          <li>
              <a href="#blog">Blog</a>
          </li>
          <li>
              <a href="#home">Home</a>
          </li>
          <li>
              <a href="#about">About</a>
          </li>
          <li>
              <a href="#services">Services</a>
          </li>
          <li>
              <a href="#contact">Contact</a>
          </li>
          <li>
              <a href="#blog">Blog</a>
          </li>
          <li>
              <a href="#home">Home</a>
          </li>
          <li>
              <a href="#about">About</a>
          </li>
          <li>
              <a href="#services">Services</a>
          </li>
          <li>
              <a href="#contact">Contact</a>
          </li>
          <li>
              <a href="#blog">Blog</a>
          </li>
          <li>
              <a href="#home">Home</a>
          </li>
          <li>
              <a href="#about">About</a>
          </li>
          <li>
              <a href="#services">Services</a>
          </li>
          <li>
              <a href="#contact">Contact</a>
          </li>
          <li>
              <a href="#blog">Blog</a>
          </li>
          <li>
              <a href="#home">Home</a>
          </li>
          <li>
              <a href="#about">About</a>
          </li>
          <li>
              <a href="#services">Services</a>
          </li>
          <li>
              <a href="#contact">Contact</a>
          </li>
          <li>
              <a href="#blog">Blog</a>
          </li>
          <li>
              <a href="#home">Home</a>
          </li>
          <li>
              <a href="#about">About</a>
          </li>
          <li>
              <a href="#services">Services</a>
          </li>
          <li>
              <a href="#contact">Contact</a>
          </li>
          <li>
              <a href="#blog">Blog</a>
          </li>
      </ul>
      <button
        className={styles.scrollBtn}
        style={{ right: 0 }}
        onClick={scrollRight}
        aria-label="Scroll right"
      >
        &gt;
      </button>
    </div>
  )
}

export default ExampleNavbar