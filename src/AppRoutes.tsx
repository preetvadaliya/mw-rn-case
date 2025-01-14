/**
 * AppRoutes Component
 *
 * This component defines the main navigation structure of the application using React Navigation.
 * It sets up the app's routing and navigation stack, allowing users to navigate between screens.
 *
 * Key Features:
 * - Defines the main navigation container for the app using `NavigationContainer`.
 * - Sets up the initial route to the `Home` screen.
 * - Configures the navigation stack for the `Home`, `CreateQuote`, and `QuotesList` screens.
 * - Specifies the required parameters for each screen route (if applicable).
 */

import { NavigationContainer } from '@react-navigation/native';
import {
  type NativeStackNavigationProp,
  createNativeStackNavigator
} from '@react-navigation/native-stack';
import { Screens } from '@src/constants';
import { CreateQuote, Home, QuotesList } from '@src/screens';
import type React from 'react';

// Define the types for the navigation parameters for each screen
export type AppRoutesParams = {
  [Screens.CREATE_QUOTE]: undefined; // No parameters for CreateQuote screen
  [Screens.HOME]: undefined; // No parameters for Home screen
  [Screens.LIST_QUOTES]: undefined; // pageId parameter for QuotesList screen
};

// Define the type for the navigation props
export type AppNavigationProps = NativeStackNavigationProp<AppRoutesParams>;

// Create a stack navigator with the defined route parameters
const AppStackNavigator = createNativeStackNavigator<AppRoutesParams>();

// Define the main AppRoutes component
export const AppRoutes: React.FC = () => {
  return (
    <NavigationContainer>
      <AppStackNavigator.Navigator initialRouteName={Screens.HOME}>
        {/* Define the Home screen route */}
        <AppStackNavigator.Screen name={Screens.HOME} component={Home} />

        {/* Define the CreateQuote screen route */}
        <AppStackNavigator.Screen
          name={Screens.CREATE_QUOTE}
          component={CreateQuote}
        />

        {/* Define the QuotesList screen route with initial parameters */}
        <AppStackNavigator.Screen
          name={Screens.LIST_QUOTES}
          component={QuotesList}
        />
      </AppStackNavigator.Navigator>
    </NavigationContainer>
  );
};
