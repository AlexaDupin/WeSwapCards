import React from 'react';
import PageContainer from '../../PageContainer/PageContainer';
import ScrollToTop from '../../ScrollToTopButton/ScrollToTop';

import '../legalFilesStyles.scss';

function CookiePolicy() {

  return (
  <PageContainer>
    <div className="legal">
      <section>
        <h1 className="page-title">Cookie Policy</h1>
        <p><strong>Effective Date:</strong> February 3, 2025</p>
        <p>At WeSwapCards ("we," "us," or "our"), we are committed to protecting your privacy. This Cookie Policy explains how we use cookies when you visit our website www.weswapcards.com (the "Site"). By using the Site, you consent to the use of cookies as described in this policy.</p>
      </section>

      <section>
        <h2 className="legal-title">1. What are Cookies?</h2>
        <p>Cookies are small text files that are placed on your device (such as a computer or mobile phone) when you visit a website. Cookies allow the website to recognize your device and store certain preferences or actions over time. This enables us to provide a better user experience and ensure secure login/authentication.</p>
      </section>

      <section>
        <h2 className="legal-title">2. Types of Cookies We Use</h2>
        <ul>
          <li>
            <p><strong>Authentication Cookies:</strong> These cookies are essential for logging in to your account and maintaining your session. Without these cookies, you would not be able to access secure areas of the website or remain logged in after navigating between pages.</p>
          </li>
          <li>
            <p><strong>Strictly Necessary Cookies:</strong> These cookies are necessary for the operation of the website and cannot be turned off. They are usually only set in response to actions made by you, such as logging in or filling out forms.</p>
          </li>
        </ul>
      </section>

      <section>
        <h2 className="legal-title">3. How We Use Cookies</h2>
        <p>We use cookies for the following purposes:</p>
        <ul>
          <li>
            <p><strong>Authentication:</strong> We use cookies to facilitate and secure your login process. These cookies allow us to recognize you once you have logged in and keep you logged in while you navigate the site.</p>
          </li>
          <li>
            <p><strong>Functionality:</strong> We use cookies to enhance the functionality of the website, such as saving your preferences for the next visit.</p>
          </li>
        </ul>
      </section>

      <section>
        <h2 className="legal-title">4. How to Control Cookies</h2>
        <p>You can manage or block cookies by adjusting your browser settings. However, please note that disabling cookies may affect your experience on our website, and you may not be able to access certain features or services.</p>
      </section>

      <section>
        <h2 className="legal-title">5. Third-Party Cookies</h2>
        <p>We do not use third-party cookies for tracking, advertising, or analytics purposes. All cookies are essential for the functionality of the website, specifically for user authentication.</p>
      </section>

      <section>
        <h2 className="legal-title">6. Changes to This Cookie Policy</h2>
        <p>We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. When we make changes, we will update the "Effective Date" at the top of this page.</p>
      </section>

      <section>
        <h2 className="legal-title">7. Contact Us</h2>
        <p>If you have any questions or concerns about this Cookie Policy, please contact us at:</p>
        <p>contact@weswapcards.com</p>
      </section>

      <ScrollToTop />
    </div>
  </ PageContainer>
  )
}

export default React.memo(CookiePolicy);
