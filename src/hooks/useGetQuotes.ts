/**
 * useGetQuotes Hook
 *
 * This custom hook provides a function to fetch quotes data either from an online API or local storage depending on network connectivity.
 *
 * Cases handled:
 * 1. **Online**: Fetches the data from the server with pagination support.
 *    - Uses `AbortController` to handle request cancellations.
 *    - Throws errors for unsuccessful responses or connection issues.
 * 2. **Offline**: Retrieves stored quotes from AsyncStorage when no internet connection is available.
 *
 * Features:
 * - Handles online/offline scenarios gracefully.
 * - Validates input (e.g., page number must be greater than 0).
 * - Provides meaningful error messages and debug logs for easier troubleshooting.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetch as fetchNetInfo } from '@react-native-community/netinfo';
import type { Quote } from '@src/types';
import { useCallback } from 'react';

const API_URL = 'http://127.0.0.1:8090/api/collections/quotes/records';
const QUERY_PARAMS =
  '?sort=-updated&fields=id,status,total,created,customer_info&perPage=30';

type ApiResponse = {
  page: number;
  items: Quote[];
  totalPages: number;
  totalItems: number;
  perPage: number;
};

export const useGetQuotes = () => {
  /**
   * Fetches quotes based on the given page number.
   * Handles both online and offline cases.
   *
   * @param pageNumber - The page number to fetch (must be > 0).
   * @returns Promise resolving to quotes data and metadata.
   */
  const getQuotes = useCallback(async (pageNumber: number) => {
    if (pageNumber < 1) {
      throw new Error('Page number must be greater than 0.');
    }

    // Check network connectivity
    const { isConnected, isInternetReachable } = await fetchNetInfo();

    if (isConnected && isInternetReachable) {
      const controller = new AbortController();
      try {
        // Fetch from server when online
        const response = await fetch(
          `${API_URL}${QUERY_PARAMS}&page=${pageNumber}`,
          {
            signal: controller.signal
          }
        );

        if (!response.ok) {
          // Handle HTTP errors
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data: ApiResponse = await response.json();

        return {
          pageNumber: data.page,
          quotes: data.items,
          totalPages: data.totalPages,
          totalItems: data.totalItems,
          perPage: data.perPage
        };
      } catch (error) {
        if ((error as Error).name === 'AbortError') {
          console.warn('Fetch aborted.'); // Log abort warnings
        } else {
          console.error('Error fetching quotes:', error);
          throw new Error(
            `Failed to fetch quotes: ${(error as Error).message}`
          );
        }
      } finally {
        // Ensure the fetch controller is cleaned up
        if (controller.signal.aborted === false) {
          controller.abort();
        }
      }
    } else {
      // Offline: Fetch from AsyncStorage
      const offlineQuotes = await AsyncStorage.getItem('offlineQuote');
      const offlineQuote = offlineQuotes ? JSON.parse(offlineQuotes) : [];

      return {
        pageNumber: 1, // Default to first page for offline data
        quotes: offlineQuote,
        totalPages: 1, // Assume single page for offline data
        totalItems: offlineQuote.length,
        perPage: offlineQuote.length
      };
    }
  }, []);

  return { getQuotes };
};
