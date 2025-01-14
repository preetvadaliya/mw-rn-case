/**
 * useCreateQuote Hook
 *
 * This custom hook is responsible for handling the creation of quotes, supporting both online and offline modes.
 *
 * Key Features:
 * - Stores quotes locally when offline using AsyncStorage.
 * - Sends quotes to a server endpoint when online.
 * - Handles errors gracefully, including fetch aborts.
 *
 * Usage:
 * const { createQuote } = useCreateQuote();
 * const newQuote = await createQuote(payload);
 *
 * Offline Mode:
 * - When the user is offline, the quote data is stored locally in AsyncStorage under the key 'offlineQuote'.
 * - These quotes can later be processed when connectivity is restored.
 *
 * Online Mode:
 * - When the user is online, the quote data is sent to the API endpoint.
 * - Handles server responses and errors appropriately.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetch as fetchNetInfo } from '@react-native-community/netinfo';
import type { Quote, QuoteFormDataType } from '@src/types';
import { useCallback } from 'react';

const API_URL = 'http://127.0.0.1:8090/api/collections/quotes/records';

export const useCreateQuote = () => {
  /**
   * Handles the creation of a quote.
   * - Stores locally if offline.
   * - Sends to API if online.
   *
   * @param payload - The data for the new quote, adhering to QuoteFormDataType.
   * @returns A promise resolving to the created Quote object or undefined if offline.
   */
  const createQuote = useCallback(
    async (payload: QuoteFormDataType): Promise<Quote | undefined> => {
      // Check if the device is offline
      const { isConnected } = await fetchNetInfo();
      if (isConnected) {
        // Create an AbortController to manage fetch timeout or cancellation
        const controller = new AbortController();
        try {
          // Send the quote to the server
          const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload),
            signal: controller.signal // Attach the AbortController's signal
          });
          // Check for non-success HTTP status codes
          if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
          }
          // Parse the response as a Quote object
          const data: Quote = await response.json();
          return data;
        } catch (error) {
          // Handle fetch abort specifically
          if ((error as Error).name === 'AbortError') {
            console.warn('Fetch aborted.');
          } else {
            console.error('Error creating quote:', error);
            throw new Error(
              `Failed to create quote: ${(error as Error).message}`
            );
          }
        } finally {
          // Ensure the controller is aborted to clean up resources
          controller.abort();
        }
      } else {
        try {
          // Retrieve existing offline quotes from AsyncStorage
          const offlineQuotes = await AsyncStorage.getItem('offlineQuote');
          const quotes = offlineQuotes ? JSON.parse(offlineQuotes) : [];
          // Add the new quote to the offline storage
          quotes.push(payload);
          await AsyncStorage.setItem('offlineQuote', JSON.stringify(quotes));
          return; // Return undefined as no server response exists in offline mode
        } catch (error) {
          console.error('Error saving offline quote:', error);
          throw new Error('Failed to save the quote offline.');
        }
      }
    },
    []
  );

  return { createQuote };
};
