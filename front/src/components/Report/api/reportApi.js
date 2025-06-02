import { axiosInstance } from '../../../helpers/axiosInstance';

export const fetchPlaces = async (token) => {
    const response = await axiosInstance.get(`/places`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    return response.data.places;
}

export const fetchCardsForPlace = async (placeId, token) => {
    const response = await axiosInstance.get(`/cards/${placeId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
    });
    return response.data.cards;
}

export const fetchExplorerCards = async (placeId, explorerId, token) => {
    const response = await axiosInstance.get(`/cards/${placeId}/${explorerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
    });

    return response.data.cards;
}

export const fetchExplorerDuplicates = async (placeId, explorerId, token) => {
    const response = await axiosInstance.get(`/cards/${placeId}/${explorerId}/duplicates`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
    })

    return response.data.cards;
}

export const submitReport = async (explorerId, payload, token) => {
    return await axiosInstance.post(
        `/report/${explorerId}`,
        payload, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
        }
    );
}
