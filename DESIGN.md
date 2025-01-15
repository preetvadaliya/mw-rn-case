## General Project Overview

```text
  my-rn-app/
  ├── src/
  │   ├── components/              # Reusable UI components
  │   ├── constants/               # App-wide constants
  │   ├── hooks/                   # Custom React hooks
  │   ├── screens/                 # Screen components
  │   ├── types/                   # TypeScript type definitions
  │   ├── __tests__/               # Test files
  │   ├── CreateQuote/             # Create Quote feature
  │   ├── Home/                    # Home screen
  │   ├── QuotesList/              # Quotes List screen
  │   ├── workflows/               # CI/CD workflows
  ├── .github/                     # GitHub configurations
  ├── app.json                     # Expo configuration
  ├── biome.json                   # Biome configuration
  ├── jest.config.js               # Jest configuration
  ├── jest.setup.js                # Jest setup file
  ├── package.json                 # Project dependencies
  ├── tsconfig.json                # TypeScript configuration
  └── README.md                    # Project documentation
```

This project is structured to enhance modularity and ease of maintenance. Below are some key features of the directory structure:

| Feature           | Description                                                                 |
|-------------------|-----------------------------------------------------------------------------|
| **Modular Design**| Each directory contains an `index.ts` file, making it easy to import modules. This approach promotes encapsulation and reusability of code. |
| **Components**    | The `components` directory houses reusable UI components, ensuring a consistent look and feel across the app. |
| **Screens**       | The `screens` directory contains the main screen components, each representing a distinct view in the app. |
| **Hooks**         | Custom React hooks are stored in the `hooks` directory, facilitating the reuse of stateful logic. |
| **Types**         | TypeScript type definitions are centralized in the `types` directory, promoting type safety and reducing errors. |
| **Tests**         | The `__tests__` directory includes test files to ensure the reliability and correctness of the codebase. |
| **Configuration** | Configuration files for tools like Jest, TypeScript, and Expo are located at the root level, making them easily accessible. |

This structure aims to keep the codebase organized, scalable, and easy to navigate.


## App Navigation Implementation

1. **Navigation Structure**: The app uses `NavigationContainer` and `createNativeStackNavigator` from React Navigation to set up the main navigation stack, with `Home` as the initial route.
2. **TypeScript Integration**: 
   - **Route Parameters**: `AppRoutesParams` defines types for navigation parameters, ensuring type safety.
   - **Navigation Props**: `AppNavigationProps` type is used with `useNavigation<AppNavigationProps>()` for auto-completion in TypeScript.
3. **Best Practices**: Screen names are configured using an enum (`Screens`), promoting maintainability and avoiding hardcoded strings.


## Components

The `components` directory houses reusable UI components, ensuring a consistent look and feel across the app. Key benefits include:

- **Reusable Formik Components**: Custom components like `FormikTextInput` and `FormikSubmitButton` simplify form creation with Formik.
- **Consistency**: Ensures a consistent design and behavior across all forms.
- **Enhanced Functionality**: Built-in validation, error handling, and state management reduce boilerplate code.
- **Modular Design**: Easily extendable and customizable components.

These features help create robust and maintainable forms efficiently.


## Custom Hooks

### useGetQuotes

The `useGetQuotes` hook provides a function to fetch quotes data either from an online API or local storage depending on network connectivity.

- **Logic and System Design**:
  - **Online**: Fetches data from the server with pagination support. Uses `AbortController` to handle request cancellations and throws errors for unsuccessful responses or connection issues.
  - **Offline**: Retrieves stored quotes from AsyncStorage when no internet connection is available.
  - **Input Validation**: Ensures the page number is greater than 0.
  - **Error Handling**: Provides meaningful error messages and debug logs for easier troubleshooting.

- **Data Caching**:
  - **Offline Support**: Stores quotes in AsyncStorage to provide access when there is no internet connection.

- **Benefits**:
  - **Reusability**: Encapsulates the logic for fetching quotes, making it reusable across different components.
  - **Separation of Concerns**: Keeps the data fetching logic separate from the UI components, promoting cleaner and more maintainable code.
  - **Improved Performance**: By caching data locally, it reduces the need for repeated network requests, improving app performance and user experience.

### useGetProducts

The `useGetProducts` hook fetches product data from an API and handles online/offline scenarios.

- **Logic and System Design**:
  - **Online**: Fetches product data from the server.
  - **Offline**: Retrieves stored product data from AsyncStorage when no internet connection is available.
  - **Error Handling**: Provides meaningful error messages and debug logs for easier troubleshooting.

- **Data Caching**:
  - **Offline Support**: Stores product data in AsyncStorage to provide access when there is no internet connection.

- **Benefits**:
  - **Reusability**: Encapsulates the logic for fetching products, making it reusable across different components.
  - **Separation of Concerns**: Keeps the data fetching logic separate from the UI components, promoting cleaner and more maintainable code.
  - **Improved Performance**: By caching data locally, it reduces the need for repeated network requests, improving app performance and user experience.

### useCreateQuote

The `useCreateQuote` hook provides a function to create a new quote by sending data to an API.

- **Logic and System Design**:
  - **API Interaction**: Sends a POST request to the server to create a new quote.
  - **Input Validation**: Ensures the required fields are provided and valid.
  - **Error Handling**: Provides meaningful error messages and debug logs for easier troubleshooting.

- **Benefits**:
  - **Reusability**: Encapsulates the logic for creating quotes, making it reusable across different components.
  - **Separation of Concerns**: Keeps the data creation logic separate from the UI components, promoting cleaner and more maintainable code.
  - **Consistency**: Ensures a consistent approach to creating quotes across the app.

By using these custom hooks, the app achieves a modular and maintainable codebase, with improved performance and user experience through offline support and data caching.


## Screens

### QuotesList Screen

The `QuotesList` screen displays a list of quotes with filtering and pagination support.

- **Components**:
  - **FilterBar**: Allows users to filter the list of quotes based on specific criteria.
  - **QuotePagination**: Handles the pagination of quotes, enabling users to navigate through different pages of quotes.
  - **QuoteItem**: Represents individual quote items in the list.

- **Best Practices**:
  - **Modular Components**: The screen is composed of smaller, reusable components like `FilterBar` and `QuotePagination`, promoting code reuse and maintainability.
  - **State Management**: Uses custom hooks like `useGetQuotes` to manage the fetching and state of quotes, keeping the component logic clean and focused on rendering.

### CreateQuote Screen

The `CreateQuote` screen allows users to create a new quote by filling out a form.

- **Components**:
  - **FormCustomerInfo**: Collects customer information.
  - **FormItems**: Manages the items included in the quote.
  - **FormQuoteInfo**: Gathers general quote information.
  - **FormTotalInfo**: Displays the total information of the quote.

- **Best Practices**:
  - **Reusable Formik Components**: Utilizes custom Formik components like `FormikTextInput` and `FormikSubmitButton` to simplify form handling and validation.
  - **Separation of Concerns**: Each part of the form is managed by a separate component, making the code more modular and easier to maintain.

These practices help create robust, maintainable, and scalable screens in the app.


## Offline to Online Sync

The `App.tsx` component handles the setup and configuration of offline data syncing, database creation, and routing. Here are some key points and thoughts on how the offline to online sync works:

1. **AsyncStorage and SQLite**:
   - The app currently uses `AsyncStorage` to store offline data. However, we can easily switch to `expo-sqlite` to replicate the same functionality in a more robust database.
   - Using SQLite can help manage larger datasets and provide more advanced querying capabilities.

2. **Online to Offline Data Sync**:
   - When the app detects an internet connection, it loads data from the server and stores it in the database (e.g., SQLite or AsyncStorage look in hooks logic).
   - This ensures that the app has the latest data available even when offline.

3. **Network Connectivity Check**:
   - The app uses `useNetInfo` from `@react-native-community/netinfo` to monitor network connectivity.
   - We can configure `useNetInfo` to check the reachability of our server URL, improving the logic to ensure the server is accessible before attempting to sync data.

4. **Data Cleanup**:
   - Once the offline data is successfully synced with the server, the app deletes the data from local storage (e.g., AsyncStorage).
   - This helps keep the local storage clean and prevents duplicate data.

### Bugs and Considerations

1. **NetInfo State Update**:
   - The `NetInfo` state may not update very quickly in the iOS simulator. You might need to reload the iOS simulator to see the changes in network connectivity status.

By implementing these points, the app can efficiently manage offline data and ensure a seamless user experience when transitioning between online and offline states.
