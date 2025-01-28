import { useState, useMemo, useEffect } from 'react';

export default function usePersistState(initial_value, id) {
    // Set initial value
    const _initial_value = useMemo(() => {
        const local_storage_value_str = localStorage.getItem('state:' + id);

        // If there is a value stored in localStorage, use that
        // if(local_storage_value_str) {
        //     return JSON.parse(local_storage_value_str);
        // } 
        if (local_storage_value_str) {
            try {
                // Try parsing the value from localStorage
                return JSON.parse(local_storage_value_str);
            } catch (error) {
                // Log and return initial value if parsing fails
                console.error(`Error parsing value from localStorage for key 'state:${id}':`, error);
                return initial_value;  // Fallback to initial_value
            }
        }
        // Otherwise use initial_value that was passed to the function
        return initial_value;
    }, []);

    const [state, setState] = useState(_initial_value);

    // useEffect(() => {
    //     const state_str = JSON.stringify(state); // Stringified state
    //     localStorage.setItem('state:' + id, state_str) // Set stringified state as item in localStorage
    // }, [state]);

    useEffect(() => {
        // Stringify and save the state to localStorage when it changes
        try {
            const state_str = JSON.stringify(state);
            localStorage.setItem('state:' + id, state_str);
        } catch (error) {
            // Log any errors while saving to localStorage
            console.error(`Error saving state to localStorage for key 'state:${id}':`, error);
        }
    }, [state, id]);

    return [state, setState];
}
