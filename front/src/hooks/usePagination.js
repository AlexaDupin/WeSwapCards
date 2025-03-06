import { useState, useEffect, useRef } from 'react';
import { axiosInstance } from '../helpers/axiosInstance';
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
      setError(null);
      setTotalPages(0);
      setTotalItems(0);
      return;
    }

    try {
      // setLoading(true);
      setError(null);
      
      // Abort the previous fetch request if it exists
      abortControllerRef.current.abort();
      
      // Create a new abort controller for the current fetch
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      // Get auth token
      let token;
      try {
        token = await getToken();
      } catch (tokenErr) {
        setError("Authentication error. Please try logging in again.");
        setLoading(false);
        return;
      }

      const response = await axiosInstance.get(
        `${fetchUrl}?page=${activePage}&limit=${itemsPerPage}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: abortController.signal,
          timeout: 8000, // 8 second timeout
        }
      );

      // Update state only if the request is not aborted
      if (abortController.signal.aborted) return;

      // Set data based on response format
      if (response.data.items) {
        setData(response.data.items);
      } else if (response.data.conversations) {
        setData(response.data.conversations);
      } else {
        setData(response.data);
      }

      // Set pagination info if available
      if (response.data.pagination) {
        const calculatedTotalPages = Math.ceil(response.data.pagination.totalItems / itemsPerPage);
        setTotalPages(calculatedTotalPages);
        setTotalItems(response.data.pagination.totalItems);
      } else {
        // Default pagination if none provided
        setTotalPages(1);
        setTotalItems(Array.isArray(response.data) ? response.data.length : 0);
      }
      
      setError(null);
    } catch (err) {
      // Don't update state if request was intentionally canceled
      if (err.name === 'CanceledError' || err.name === 'AbortError') {
        return;
      }
      
      // Set appropriate error message based on error type
      if (err.code === 'ERR_NETWORK' || err.message === 'Network Error') {
        setError("There was an error reaching the server. Try again.");
      } else {
        setError(err.message || 'There was an error loading the data');
      }
      
      console.error("Pagination error:", err);
      
      // Keep existing data on error to allow retry without losing state
    } finally {
      // Always update loading state unless request was aborted
      if (!abortControllerRef.current.signal.aborted) {
        setLoading(false);
      }
    }
  };
  
  const handlePageChange = (pageNumber) => {
    if (pageNumber === activePage) return;
    setActivePage(pageNumber);
  };
  
  // Clean up abort controller on unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current.abort();
    };
  }, []);
  
  // Fetch data when dependencies change
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



// import { useState, useEffect, useRef } from 'react';
// import {axiosInstance} from '../helpers/axiosInstance';
// import { useAuth } from '@clerk/clerk-react';

// export const usePagination = (fetchUrl, itemsPerPage = 20) => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [activePage, setActivePage] = useState(1);
//   const [totalPages, setTotalPages] = useState(0);
//   const [totalItems, setTotalItems] = useState(0);
  
//   const { getToken } = useAuth();

//   const abortControllerRef = useRef(new AbortController());
  
//   const fetchData = async () => {
//     if (!fetchUrl) {
//         setData([]);
//         setLoading(false);
//         setTotalPages(0);
//         setTotalItems(0);
//         return;
//     }

//     try {
//       // Abort the previous fetch request if it exists
//       abortControllerRef.current.abort();
      
//       // Create a new abort controller for the current fetch
//       const abortController = new AbortController();
//       abortControllerRef.current = abortController;

//       setLoading(true);

//       const response = await axiosInstance.get(
//         `${fetchUrl}?page=${activePage}&limit=${itemsPerPage}`,
//         {
//           headers: {
//             Authorization: `Bearer ${await getToken()}`,
//           },
//           signal: abortController.signal,
//         }
//       );

//       // Update state only if the request is not aborted
//       if (abortController.signal.aborted) return;

//       // console.log("usePag response", response);
//       setData(response.data.items || response.data.conversations || response.data);

//       if (response.data.pagination) {
//         const calculatedTotalPages = Math.ceil(response.data.pagination.totalItems / itemsPerPage);
//         setTotalPages(calculatedTotalPages);
//         setTotalItems(response.data.pagination.totalItems);
//       }
      
//       setError(null);
//     } catch (err) {
//       if (err.name !== 'CanceledError') {
//         setError(err.message || 'There was an error loading the data');
//         console.error(err);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   const handlePageChange = (pageNumber) => {
//     setActivePage(pageNumber);
//   };
  
//   useEffect(() => {
//     fetchData();
//   }, [fetchUrl, activePage, itemsPerPage]);
  
//   return {
//     data,
//     loading,
//     error,
//     activePage,
//     totalPages,
//     totalItems,
//     handlePageChange,
//     setActivePage,
//     refresh: fetchData
//   };
// };