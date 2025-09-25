import React from 'react';
import PageContainer from '../PageContainer/PageContainer';
import { Container } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import {
  ShieldLock,
  FileEarmarkText,
  Cookie,
  Envelope,
  ChevronRight
} from 'react-bootstrap-icons';

import './legalStyles.scss';

function Legal() {
  const navigate = useNavigate();

  const items = [
    {
      key: 'privacy',
      title: 'Privacy Policy',
      desc: 'How we handle your data.',
      icon: <ShieldLock />,
      to: '/privacy',
    },
    {
      key: 'terms',
      title: 'Terms & Conditions',
      desc: 'Your rights and responsibilities.',
      icon: <FileEarmarkText />,
      to: '/terms',
    },
    {
      key: 'cookies',
      title: 'Cookie Policy',
      desc: 'What we store in your browser and why.',
      icon: <Cookie />,
      to: '/cookies',
    },
    {
      key: 'contact',
      title: 'Contact',
      desc: 'Questions or concerns? Get in touch.',
      icon: <Envelope />,
      to: '/contact',
    },
  ];

  return (
    <PageContainer className="legal">
      <h1 className="page-title">Legal</h1>

      <Container>
        <ul className="legal-list" aria-label="Legal documents">
          {items.map(item => (
            <li key={item.key} className="legal-list__item">
              <button
                type="button"
                className="legal-link"
                onClick={() => navigate(item.to)}
                aria-label={item.title}
                title={item.title}
              >
                <span className="legal-link__icon" aria-hidden="true">
                  {item.icon}
                </span>

                <span className="legal-link__content">
                  <span className="legal-link__title">{item.title}</span>
                  <span className="legal-link__desc">{item.desc}</span>
                </span>

                <span className="legal-link__chevron" aria-hidden="true">
                  <ChevronRight />
                </span>
              </button>
            </li>
          ))}
        </ul>
      </Container>
    </PageContainer>
  );
}

export default React.memo(Legal);






// import React from 'react';
// import PageContainer from '../PageContainer/PageContainer';
// import {
//     Container,
//     Row,
//     Col,
// } from "react-bootstrap";
// import { useNavigate } from 'react-router-dom';

// import CustomButton from '../CustomButton/CustomButton';

// function Legal() {
//     const navigate = useNavigate();

//   return (
//     <PageContainer>
//         <h1 className="page-title">Legal</h1>

//         <Container>
//             <Row className="g-4">
//                 <Col sm={12}>
//                     <CustomButton
//                         text="Privacy Policy"
//                         onClick={() => navigate('/privacy')}
//                     />
//                 </Col>
//                 <Col sm={12}>
//                     <CustomButton
//                         text="Terms and Conditions"
//                         onClick={() => navigate('/terms')}
//                     />
//                 </Col>
//                 <Col sm={12}>
//                     <CustomButton
//                         text="Cookie Policy"
//                         onClick={() => navigate('/cookies')}
//                     />
//                 </Col>
//                 <Col sm={12}>
//                     <CustomButton
//                         text="Contact"
//                         onClick={() => navigate('/contact')}
//                     />
//                 </Col>
//             </Row> 
//         </Container>

//     </PageContainer>
//     )   
// }

// export default React.memo(Legal);
