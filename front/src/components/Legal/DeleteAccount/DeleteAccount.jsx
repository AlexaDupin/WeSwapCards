import React from 'react';
import PageContainer from '../../PageContainer/PageContainer';
import ScrollToTop from '../../ScrollToTopButton/ScrollToTop';

import '../legalStyles.scss';

// Public page: reachable without signing in (see PUBLIC_ALLOWLIST in
// RequireUsername), because a user who has lost access to their account still
// needs a way to request deletion.
function DeleteAccount() {

  return (
  <PageContainer>
    <div className="legal">
      <section>
        <h1 className="page-title">Delete Your Account</h1>
        <p><strong>Effective Date:</strong> July 31, 2026</p>
        <p>This page explains how to delete your WeSwapCards account and what happens to your data when you do. Deleting your account is permanent and cannot be undone.</p>
      </section>

      <section>
        <h2 className="legal-title">1. In the mobile app</h2>
        <ul className="p-2">
          <li>- Tap your profile picture in the top right corner to open the account menu.</li>
          <li>- Tap <strong>Delete account</strong>.</li>
          <li>- Confirm when prompted.</li>
        </ul>
        <p>You are signed out as soon as the deletion completes.</p>
      </section>

      <section>
        <h2 className="legal-title">2. On the website</h2>
        <p>You need to be signed in to use this option.</p>
        <ul className="p-2">
          <li>- Sign in at www.weswapcards.com.</li>
          <li>- Click your profile picture in the header, then <strong>Manage account</strong>.</li>
          <li>- Open the <strong>Security</strong> section and choose <strong>Delete account</strong>.</li>
        </ul>
      </section>

      <section>
        <h2 className="legal-title">3. If you cannot sign in</h2>
        <p>If you no longer have access to your account, email us at contact@weswapcards.com from the address associated with it and ask us to delete it. If you write from a different address, we may ask you for further information before we proceed, so that nobody can have another user's account deleted.</p>
      </section>

      <section>
        <h2 className="legal-title">4. What is deleted</h2>
        <p>Deleting your account permanently removes:</p>
        <ul className="p-2">
          <li>- Your account details, including your email address, username, and profile picture.</li>
          <li>- Your card collection, including the cards you own and your duplicates.</li>
          <li>- Your conversations and the messages in them. A conversation belongs to both participants, so it is also removed from the account of the user you were talking to.</li>
          <li>- The list of users you have blocked.</li>
          <li>- Any reports you have submitted about other users.</li>
          <li>- Your notification data, so your devices stop receiving notifications.</li>
        </ul>
      </section>

      <section>
        <h2 className="legal-title">5. What is kept</h2>
        <p>Two things remain after your account is deleted:</p>
        <ul className="p-2">
          <li>
            <p><strong>Reports submitted about you.</strong> If another user reported you, that report is kept as a safety record. The link to your account is removed, but the username recorded at the time of the report remains, so that we can continue to act on repeated abuse. We keep these records for as long as they are needed to keep the Site safe and to meet our legal obligations.</p>
          </li>
          <li>
            <p><strong>Backups.</strong> A backup taken before your deletion still holds your data until that backup is replaced. Backups are only used to restore the service after a failure.</p>
          </li>
        </ul>
        <p>Server and email records may also keep technical information, such as the time of a request, for a limited period.</p>
      </section>

      <section>
        <h2 className="legal-title">6. Contact Us</h2>
        <p>If you have any questions about deleting your account, please contact us at:</p>
        <p>contact@weswapcards.com</p>
        <p>See also our <a href="/privacy">Privacy Policy</a> and our <a href="/terms">Terms and Conditions</a>.</p>
      </section>

      <ScrollToTop />
    </div>
  </PageContainer>
 )
}

export default React.memo(DeleteAccount);
