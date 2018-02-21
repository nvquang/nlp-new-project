import React from 'react';
import { FormattedMessage } from 'react-intl';

// Import Style
import styles from './Footer.css';

// Import Images
import bg from '../../header-bk.png';

export function Footer() {
  return (
    <div style={{ background: `#FFF url(${bg}) center` }} className={styles.footer}>
      <p>&copy; 2018 &middot; Quang Nguyen; Appable Vietnam Inc.</p>
      <p>Website : <a href="https://goappable.com" target="_Blank">goappable.com</a></p>
    </div>
  );
}

export default Footer;
