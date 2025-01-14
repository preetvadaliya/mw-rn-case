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
import { addEventListener } from '@react-native-community/netinfo';
import { AppRoutes } from '@src/AppRoutes';
import type React from 'react';
import { useEffect, useState } from 'react';
import { Alert, Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useCreateQuote } from './hooks';

export const App: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false); // State to track online/offline status
  const { createQuote } = useCreateQuote(); // Hook for creating quotes on the server

  useEffect(() => {
    addEventListener(({ isConnected, isInternetReachable }) => {
      setIsConnected(!!(isConnected && isInternetReachable)); // Update the online/offline status
    });
  }, []);

  // Effect hook to sync offline quotes when the device is online
  useEffect(() => {
    const syncOfflineQuotes = async () => {
      if (isConnected) {
        // Check if there are any offline quotes stored in AsyncStorage
        const offlineQuotes = await AsyncStorage.getItem('offlineQuote');
        if (offlineQuotes) {
          const quotes = JSON.parse(offlineQuotes); // Parse the quotes from storage
          // Loop through each quote and sync it to the server
          for (const quote of quotes) {
            try {
              await createQuote(quote); // Sync each quote to the server
            } catch (error) {
              // If any error occurs while syncing, show an alert and log the error
              Alert.alert('Failed to sync quote:', (error as Error).message);
              console.error('Failed to sync quote:', error);
            }
          }
          // Clear the offline quotes from AsyncStorage after syncing
          await AsyncStorage.setItem('offlineQuote', JSON.stringify([]));
        }
      }
    };
    syncOfflineQuotes(); // Call function to sync quotes if connected to the internet
  }, [isConnected]); // Re-run the effect when the device's connection status changes

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
