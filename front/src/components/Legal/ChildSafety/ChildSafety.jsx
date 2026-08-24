import React from 'react';
import PageContainer from '../../PageContainer/PageContainer';
import ScrollToTop from '../../ScrollToTopButton/ScrollToTop';

import '../legalStyles.scss';

// Public page: reachable without signing in (see PUBLIC_ALLOWLIST in
// RequireUsername). Google Play requires apps in the Social category to publish
// standards against child sexual abuse and exploitation, and submits this URL
// for review, so it must load worldwide without an account.
function ChildSafety() {

  return (
  <PageContainer>
    <div className="legal">
      <section>
        <h1 className="page-title">Child Safety Standards</h1>
        <p><strong>Effective Date:</strong> August 24, 2026</p>
        <p>WeSwapCards is a card collection tracker and swap finder for adult collectors. These standards explain our position on child sexual abuse and exploitation, how to report it to us, and what we do when we learn of it.</p>
      </section>

      <section>
        <h2 className="legal-title">1. What This Policy Covers</h2>
        <p><strong>Child sexual abuse and exploitation (CSAE)</strong> means any conduct that sexually exploits, abuses, or endangers a child. It includes grooming, sextortion, trafficking, and the solicitation of a minor, whether or not any image is involved.</p>
        <p><strong>Child sexual abuse material (CSAM)</strong> means visual content, including photographs, video, drawings, and computer-generated imagery, that depicts a minor in a sexually explicit context.</p>
      </section>

      <section>
        <h2 className="legal-title">2. Zero Tolerance</h2>
        <p>CSAE content and CSAE conduct are prohibited on WeSwapCards without exception. This applies to every message sent through the Site and the mobile app.</p>
        <p>Accounts involved in CSAE are terminated, not warned. We do not require a pattern of behaviour before acting, and we do not restore terminated accounts on appeal in these cases.</p>
      </section>

      <section>
        <h2 className="legal-title">3. How to Report</h2>
        <p>In the mobile app, open the conversation, tap the actions menu at the top right, then <strong>Report this conversation</strong>. You can select a reason and add a description of up to 500 characters.</p>
        <p>You can also write to us at contact@weswapcards.com.</p>
        <p>Reports that concern child safety are prioritised over all other reports. You do not need an account in good standing, or any particular reason code, to raise one.</p>
        <p>If you believe a child is in immediate danger, contact your local law enforcement first. Reporting to us is not a substitute for that.</p>
      </section>

      <section>
        <h2 className="legal-title">4. How We Respond</h2>
        <p>When we obtain actual knowledge of CSAM on the Site or in the app, we:</p>
        <ul className="p-2">
          <li>- Remove the content.</li>
          <li>- Terminate the account or accounts involved.</li>
          <li>- Preserve the material and associated account records as required for a lawful request, rather than deleting them immediately.</li>
          <li>- Report to the National Center for Missing &amp; Exploited Children (NCMEC), as required of United States providers.</li>
        </ul>
        <p>We do not scan or automatically analyse the content of private messages. We act on reports brought to us by users and on anything we become aware of in the course of operating the service.</p>
      </section>

      <section>
        <h2 className="legal-title">5. Reporting Directly to Authorities</h2>
        <p>You are always free to report directly, and you do not need to tell us first.</p>
        <ul className="p-2">
          <li><p><strong>United States:</strong> the NCMEC CyberTipline at <a href="https://report.cybertip.org" target="_blank" rel="noopener noreferrer">report.cybertip.org</a>, or 1-800-843-5678.</p></li>
          <li><p><strong>Elsewhere:</strong> your national hotline through <a href="https://www.inhope.org" target="_blank" rel="noopener noreferrer">INHOPE</a>, which operates hotlines in more than fifty countries.</p></li>
        </ul>
      </section>

      <section>
        <h2 className="legal-title">6. Child Safety Point of Contact</h2>
        <p>Our designated point of contact for child safety and CSAM matters is:</p>
        <p>contact@weswapcards.com</p>
        <p>See also our <a href="/terms">Terms and Conditions</a> and our <a href="/privacy">Privacy Policy</a>.</p>
      </section>

      <ScrollToTop />
    </div>
  </PageContainer>
 )
}

export default React.memo(ChildSafety);
