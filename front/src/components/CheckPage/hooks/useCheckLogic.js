import { useEffect, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../../helpers/axiosInstance';
import { useAuth } from '@clerk/clerk-react';
import { useStateContext } from '../../../contexts/StateContext';
import { initialState, reducer } from '../../../reducers/checkReducer';

const useCheckLogic = () => {
    const stateContext = useStateContext();
    const { explorer } = stateContext;
    const { id: explorerId, name } = explorer;

    const [state, dispatch] = useReducer(reducer, initialState);
    const { getToken } = useAuth()
    const navigate = useNavigate();

    const fetchExplorerCardsByPlace = async () => {
        try {
          const response = await axiosInstance.get(
            `/explorercards/${explorerId}`, {
              headers: {
                Authorization: `Bearer ${await getToken()}`,
              },
            })
          const fetchedCardsByPlace = response.data;

          dispatch({
            type: 'cards/fetched',
            payload: fetchedCardsByPlace
          })

        } catch (error) {
          dispatch({
            type: 'cards/fetchedError',
          })
          // console.log(error);
        }
    };

    useEffect(
      () => {
        if (!explorerId) {
          navigate('/login/redirect', { state: { from: "/check" } });
        } else {
          fetchExplorerCardsByPlace()
        }
      }, [],
    );

    return {
        state,
        name,
        explorerId,
        dispatch
    }
}

export default useCheckLogic;
