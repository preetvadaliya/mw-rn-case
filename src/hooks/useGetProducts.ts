/**
 * useGetProducts Hook
 *
 * This custom hook is responsible for fetching a list of products, supporting both online and offline modes.
 *
 * Key Features:
 * - Fetches products from a remote API when online.
 * - Retrieves products from local SQLite database when offline.
 * - Syncs the latest products to the SQLite database for offline use.
 * - Manages loading and error states.
 *
 * Usage:
 * const { items, isLoading, error, refetch } = useGetProducts();
 * useEffect(() => { refetch(); }, []);
 *
 * Online Mode:
 * - Products are fetched from the API and saved to the SQLite database.
 *
 * Offline Mode:
 * - Products are retrieved from the SQLite database.
 */

import { useNetInfo } from '@react-native-community/netinfo';
import type { Product } from '@src/types';
import * as SQLite from 'expo-sqlite';
import { useCallback, useEffect, useState } from 'react';

const API_URL = 'http://127.0.0.1:8090/api/collections/products/records';
const QUERY_PARAMS = '?sort=+title&fields=id,title,price';

export const useGetProducts = () => {
  const { isConnected } = useNetInfo();
  const [items, setItems] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Fetches the list of products, either from the API or SQLite database.
   * - Online: Fetches products from the API, updates the SQLite database, and updates state.
   * - Offline: Fetches products from the SQLite database and updates state.
   */
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const db = await SQLite.openDatabaseAsync('test3');
      if (isConnected) {
        const response = await fetch(`${API_URL}${QUERY_PARAMS}`);
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        await db.execAsync('DELETE FROM products;');
        await db.execAsync(
          `INSERT INTO products (id, title, price) VALUES ${data.items
            .map(
              (item: Product) =>
                `('${item.id}', '${item.title}', ${item.price})`
            )
            .join(',')}`
        );
        setItems(data.items as Product[]);
      } else {
        const results = await db.getAllAsync(
          'SELECT * FROM products ORDER BY title ASC;'
        );
        setItems(results as Product[]);
      }
    } catch (error) {
      setError(error as Error);
    } finally {
      setIsLoading(false);
    }
  }, [isConnected]);

  useEffect(() => {
    fetchProducts();
  }, []);

  return { items, isLoading, error, refetch: fetchProducts };
};
