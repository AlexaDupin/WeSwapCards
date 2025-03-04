import { useState, useEffect, useRef } from 'react';
import {axiosInstance} from '../helpers/axiosInstance';
import { useAuth } from '@clerk/clerk-react';

export const usePagination = (fetchUrl, itemsPerPage = 20) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activePage, setActivePage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  
  const { getToken } = useAuth();

  const abortControllerRef = useRef(new AbortController());
  
  const fetchData = async () => {
    if (!fetchUrl) {
        setData([]);
        setLoading(false);
        setTotalPages(0);
        setTotalItems(0);
        return;
    }

    try {
      // Abort the previous fetch request if it exists
      abortControllerRef.current.abort();
      
      // Create a new abort controller for the current fetch
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      const response = await axiosInstance.get(
        `${fetchUrl}?page=${activePage}&limit=${itemsPerPage}`,
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
          signal: abortController.signal,
        }
      );

      // Update state only if the request is not aborted
      if (abortController.signal.aborted) return;

      // console.log("usePag response", response);
      setData(response.data.items || response.data.conversations || response.data);

      if (response.data.pagination) {
        const calculatedTotalPages = Math.ceil(response.data.pagination.totalItems / itemsPerPage);
        setTotalPages(calculatedTotalPages);
        setTotalItems(response.data.pagination.totalItems);
      }
      
      setError(null);
    } catch (err) {
      if (err.name !== 'CanceledError') {
        setError(err.message || 'There was an error loading the data');
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };
  
  useEffect(() => {
    fetchData();
  }, [fetchUrl, activePage, itemsPerPage]);
  
  return {
    data,
    loading,
    error,
    activePage,
    totalPages,
    totalItems,
    handlePageChange,
    setActivePage,
    refresh: fetchData
  };
};