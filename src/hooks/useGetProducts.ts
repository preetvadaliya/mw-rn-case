/**
 * useGetProducts Hook
 *
 * This custom hook is responsible for fetching a list of products, supporting both online and offline modes.
 *
 * Key Features:
 * - Fetches products from a remote API when online.
 * - Retrieves products from local AsyncStorage when offline.
 * - Syncs the latest products to AsyncStorage for offline use.
 * - Manages loading and error states.
 *
 * Usage:
 * const { items, isLoading, error, refetch } = useGetProducts();
 * useEffect(() => { refetch(); }, []);
 *
 * Online Mode:
 * - Products are fetched from the API and saved to AsyncStorage.
 *
 * Offline Mode:
 * - Products are retrieved from the AsyncStorage database.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetch as fetchNetInfo } from '@react-native-community/netinfo';
import type { Product } from '@src/types';
import { useCallback, useEffect, useState } from 'react';

const API_URL = 'http://127.0.0.1:8090/api/collections/products/records';
const QUERY_PARAMS = '?sort=+title&fields=id,title,price';

export const useGetProducts = () => {
  const [items, setItems] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Fetches the list of products, either from the API or AsyncStorage.
   * - Online: Fetches products from the API, updates AsyncStorage, and updates state.
   * - Offline: Fetches products from AsyncStorage and updates state.
   */
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { isConnected } = await fetchNetInfo();
      if (isConnected) {
        const response = await fetch(`${API_URL}${QUERY_PARAMS}`);
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        await AsyncStorage.setItem('products', JSON.stringify(data.items));
        setItems(data.items as Product[]);
      } else {
        const products = await AsyncStorage.getItem('products');
        const results = products ? JSON.parse(products) : [];
        setItems(results as Product[]);
      }
    } catch (error) {
      setError(error as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, []);

  return { items, isLoading, error, refetch: fetchProducts };
};
