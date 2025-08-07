
const mockSwapLogic = {
    state: {
      places: [{ id: 1, name: 'Brussels' }],
      cards: [{ id: 10, number: 1, name: 'Brussels1' }],
      hidden: true,
      hiddenSwapOpportunities: false,
      activeTooltips: {},
      alert: { 
          hidden: false, 
          message: '' 
      },
      selectedCardId: 10,
      loadingOpportunities: false,
    },
    name: 'Alex',
    handleSelectPlace: jest.fn(),
    fetchSwapOpportunities: jest.fn(),
    swapOpportunities: {
      items: [
        {
          explorer_id: 'u1',
          explorer_name: 'User One',
          last_active_at: new Date(),
          opportunities: [{ card: { id: 20, name: 'Card B' } }],
        },
      ],
    },
    swapCardName: 'Card A',
    isRecentlyActive: () => true,
    handleMobileTooltip: jest.fn(),
    handleContactButton: jest.fn(),
    activePage: 1,
    totalPages: 1,
    handlePageChange: jest.fn(),
  };
  
export default mockSwapLogic;
  