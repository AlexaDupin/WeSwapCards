import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import CustomButton from '../CustomButton/CustomButton';

import './modalStyles.scss';

function OpportunitiesModal() {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
  
    return (
      <>
        <button
            className="questionBtn" 
            onClick={handleShow}
        > 
           ?
        </button>
  
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Chapter hints</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              <ul>To help you prioritize, here are some hints:<br /><br />
              <li>
                <button
                  className="low-card" 
                > 
                White card
                </button>
                <p>You are still missing quite a lot of cards in this chapter</p>
              </li><br />
              <li>
                <button
                  className="custom-button" 
                > 
                Orange card
                </button>
                <p>This chapter is getting interesting</p>
              </li><br />
              <li>
                <button
                  className="key-card" 
                > 
                Green card
                </button>
                <p>You are almost done with this chapter!</p>
              </li><br />
              <li>
                <button
                  className="star-card" 
                > 
                Shiny card
                </button>
                <p>This is the card you have been waiting for, the last one in this chapter!</p>
              </li>
              </ul>
            </Modal.Body>
          <Modal.Footer>
            <CustomButton onClick={handleClose}
                  text="Close"
            />
          </Modal.Footer>
        </Modal>
      </>
    );
  }

  OpportunitiesModal.propTypes = {
  // card: PropTypes.shape({
  //   id: PropTypes.number.isRequired,
  //   name: PropTypes.string.isRequired,
  //   number: PropTypes.number.isRequired,
  //   place_id: PropTypes.number.isRequired
  // }),  
  // selectedCards: PropTypes.array,
  // handleCardSelection: PropTypes.func,
  // duplicates: PropTypes.array,
};

// OpportunitiesModal.defaultProps = {
//   card: { id: 0, name: 'Default Card', number: 0, place_id: 0 },  // Default card data
//   selectedCards: [],  // Default empty array for selectedCards
// };

export default React.memo(OpportunitiesModal);
