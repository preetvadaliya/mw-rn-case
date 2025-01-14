/**
 * App Component
 *
 * This component serves as the main entry point for the application, handling the setup and configuration of offline data syncing, database creation, and routing.
 * It is responsible for initializing the database and syncing offline quotes with the server when the device is connected to the internet.
 *
 * Key Features:
 * - Initializes the SQLite database and creates required tables on app startup.
 * - Syncs offline quotes stored in AsyncStorage with the server when the device is online.
 * - Displays a notification when there is no internet connection.
 * - Provides the main navigation using `AppRoutes`.
 * - Uses `SafeAreaProvider` and `SafeAreaView` to ensure proper layout within safe areas.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as NetInfo from '@react-native-community/netinfo';
import type React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { Alert, Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AppRoutes } from './AppRoutes';
import { useCreateQuote } from './hooks';

export const App: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false); // State to track online/offline status
  const { createQuote } = useCreateQuote(); // Hook for creating quotes on the server

  useEffect(() => {
    const subscription = NetInfo.addEventListener((status) => {
      setIsConnected(!!status.isConnected); // Update the online/offline status
    });
    return () => {
      subscription(); // Unsubscribe from the event listener
    };
  }, []);

  const syncOfflineQuotes = useCallback(async () => {
    const offlineQuotes = await AsyncStorage.getItem('offlineQuote');
    if (offlineQuotes) {
      const quotes = JSON.parse(offlineQuotes);
      if (!Array.isArray(quotes) || quotes.length === 0) return;
      for (const quote of quotes) {
        try {
          const response = await createQuote(quote);
          Alert.alert('Quote synced successfully', response?.id);
        } catch (error) {
          Alert.alert('Failed to sync quote:', (error as Error).message);
          console.error('Failed to sync quote:', error);
        }
      }
      await AsyncStorage.setItem('offlineQuote', JSON.stringify([]));
    }
  }, [createQuote]);

  useEffect(() => {
    if (isConnected) {
      syncOfflineQuotes();
    }
  }, [isConnected]);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <GestureHandlerRootView>
          {/* Show a notification bar if the device is offline */}
          {isConnected ? null : (
            <Text
              style={{
                backgroundColor: 'red',
                color: 'white',
                padding: 4,
                fontSize: 12
              }}
            >
              No Internet Connection
            </Text>
          )}
          {/* Render the main app routes */}
          <AppRoutes />
        </GestureHandlerRootView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};
