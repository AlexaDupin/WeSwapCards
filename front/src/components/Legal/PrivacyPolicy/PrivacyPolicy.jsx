import React from 'react';
import {
  Container
} from "react-bootstrap";
import ScrollToTop from '../../ScrollToTopButton/ScrollToTop';

import './privacyStyles.scss';

function PrivacyPolicy() {

  return (
  <Container className="page-container privacy">
    <section>
      <h1 className="page-title">Privacy Policy</h1>
      <p><strong>Effective Date:</strong> February 14, 2025</p>
      <p>At WeSwapCards ("we," "us," or "our"), we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and protect your personal data when you use our website www.weswapcards.com (the "Site"). By using the Site, you consent to the collection and use of your data in accordance with this policy.</p>
    </section>

    <section>
      <h2 className="privacy-title">1. Information We Collect</h2>
      <p>We collect the following types of personal data when you use our Site:</p>
      <ul className="privacy-list">
        <li>
          <p><strong>Account Information:</strong> When you create an account, we collect your email address, username, and password.</p>
        </li>
        <li>
          <p><strong>User Messages:</strong> When you communicate with other users via our chat feature, we collect the content of those messages.</p>
        </li>
        <li>
          <p><strong>Authentication Data:</strong> We use cookies to facilitate and secure your login process. These cookies help us recognize you once you’ve logged in and maintain your session while you navigate the Site.</p>
        </li>
      </ul>
    </section>

<section>
  <h2 className="privacy-title">2. How We Use Your Data</h2>
  <p>We use your personal data for the following purposes:</p>
  <ul className="privacy-list">
    <li>
      <p><strong>Account Management:</strong> To enable users to create and manage their accounts.</p>
    </li>
    <li>
      <p><strong>Reporting Cards:</strong> To allow users to report the cards they own, which are displayed for other users to search for.</p>
    </li>
    <li>
      <p><strong>Search Functionality:</strong> To allow users to search for cards they need and identify other users who have those cards.</p>
    </li>
    <li>
      <p><strong>User Interaction:</strong> To enable users to initiate a chat with others when they match in card needs and availability.</p>
    </li>
  </ul>
</section>

<section>
  <h2 className="privacy-title">3. User Messages</h2>
  <p>When you interact with other users on our platform, including through chat messages, we collect and store the following personal data as part of your interactions:</p>
  <ul className="privacy-list">
    <li>
      <p><strong>Username:</strong> To identify you in chats and other user interactions.</p>
    </li>
  </ul>
  <p>We may store chat messages for a limited period, but please note that these messages will only be accessible to the users involved in the conversation. These messages will not be shared with third parties.</p>
  <p>While we take steps to secure the platform and protect user data, we are not responsible for the content of the messages exchanged between users. As stated in our Terms and Conditions, users are solely responsible for the content they share and the interactions they have with other users on the platform.</p>
  <p>Please note: The actual card exchange occurs on WeWard, and we are not responsible for any transactions, agreements, or disputes that occur there.</p>
</section>

<section>
  <h2 className="privacy-title">4. Data Retention</h2>
  <p>We retain personal data only as long as necessary for the purpose for which it was collected. This includes:</p>
  <ul className="privacy-list">
    <li>
      <p><strong>Account Information:</strong> We retain account information (email, username, password) as long as the account is active.</p>
    </li>
    <li>
      <p><strong>Chat Messages:</strong> We retain chat messages for as long as necessary for the purposes for which they were collected.</p>    
    </li>
  </ul>
</section>

<section>
  <h2 className="privacy-title">5. Your Rights</h2>
  <p>As a user, you have the following rights regarding your personal data:</p>
  <ul className="privacy-list">
    <li>
      <p><strong>Access:</strong> You can access and view the email address, and other account details associated with your account by logging into your account.</p>
    </li>
    <li>
      <p><strong>Update:</strong> You can update your email address and password directly through your account settings. Your username is unique to your account and cannot be changed frequently for security and consistency reasons. If you need to change your username due to exceptional circumstances, please contact us directly at contact@weswapcards.com. However, username changes are generally not permitted.</p>
    </li>
    <li>
      <p><strong>Deletion:</strong> If you wish to delete your account, you can do so directly through your account settings.</p>
    </li>
  </ul>
</section>

<section>
  <h2 className="privacy-title">6. Security Measures</h2>
  <p>We implement reasonable security measures to protect your personal data, including using Clerk for authentication, which provides secure access management. Clerk uses industry-standard security practices to ensure the safety of your account and personal information. However, please note that no method of transmission over the internet or electronic storage is 100% secure.</p>
</section>

<section>
  <h2 className="privacy-title">7. Data Sharing</h2>
  <p>We do not sell, trade, or otherwise transfer your personal data to outside parties. However, we may share certain data with third-party service providers, such as Clerk, who help us manage authentication and ensure the security of your account. These third parties are required to handle your data in accordance with applicable privacy laws and our own privacy policies.</p>
</section>

<section>
  <h2 className="privacy-title">8. Changes to This Privacy Policy</h2>
  <p>We may update this Privacy Policy from time to time. Any changes will be posted on this page, and the "Effective Date" will be updated. We encourage you to review this Privacy Policy periodically to stay informed about how we are protecting your data.</p>
</section>

<section>
  <h2 className="privacy-title">9. Contact Us</h2>
  <p>If you have any questions or concerns about this Privacy Policy, please contact us at:</p>
  <ul className="privacy-list">
    <li>
      <p><strong>Email:</strong> contact@weswapcards.com</p>
    </li>
  </ul>
</section>

    <ScrollToTop />
  
  </Container>
)
}

export default React.memo(PrivacyPolicy);
