/**
 * FormItems Component
 *
 * This component manages a dynamic list of items within a form using Formik.
 * It allows users to add or remove items, with each item consisting of product details such as price, name, and quantity.
 * The items are fetched using the `useGetProducts` hook and are dynamically rendered using `FormikProductDetailInput`.
 *
 * Features:
 * - Displays a list of form fields for product details that can be added or removed.
 * - Fetches product data from the backend to populate item fields.
 * - Handles dynamic addition/removal of items within the form and updates Formik state.
 * - Validates and shows error messages for the 'items' field when touched.
 */

import { FormikProductDetailInput } from '@src/components';
import { useGetProducts } from '@src/hooks/useGetProducts';
import type { QuoteFormDataType } from '@src/types';
import { useField, useFormikContext } from 'formik';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from './style';

export const FormItems: React.FC = () => {
  // Access Formik context and field state for 'items'
  const { values, setFieldValue, setFieldTouched } =
    useFormikContext<QuoteFormDataType>();

  // Use Formik's useField hook to get field state and validation metadata for 'items'
  const [_, meta] = useField('items');

  // Fetch product list for populating item details
  const { items, isLoading } = useGetProducts();

  // Function to add a new item to the 'items' array in Formik state
  const addItem = () => {
    setFieldTouched('items', true); // Mark the 'items' field as touched to trigger validation
    setFieldValue('items', [
      ...values.items, // Preserve existing items
      {
        price: items[0]?.price || 0, // Default to first product's price, or 0 if unavailable
        product_name: items[0]?.title || '', // Default to first product's title, or empty string
        quantity: 1, // Set default quantity to 1
        subtotal: items[0]?.price || 0 // Default to first product's price for subtotal
      }
    ]);
  };

  // Function to remove an item from the 'items' array in Formik state by index
  const removeItem = (index: number) => {
    const newItems = [...values.items]; // Create a copy of the current items array
    newItems.splice(index, 1); // Remove the item at the specified index
    setFieldValue('items', newItems, false); // Update Formik state with the modified items array
  };

  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        {/* Title and error display for 'Item Information' section */}
        <View style={{ flexDirection: 'column' }}>
          <Text style={styles.sectionTitle}>Item Information</Text>
          {meta.error && meta.touched && typeof meta.error === 'string' ? (
            <Text style={{ color: 'red', fontSize: 12 }}>
              {meta.error.toString()}
            </Text>
          ) : null}
        </View>
        {/* Add Item button */}
        <TouchableOpacity
          style={{
            padding: 4,
            backgroundColor: 'blue',
            borderRadius: 9999,
            height: 24,
            width: 24,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
          onPress={addItem} // Trigger addItem when clicked
          disabled={isLoading} // Disable the button when products are still loading
        >
          <Text style={{ fontWeight: 'bold', fontSize: 14, color: 'white' }}>
            +
          </Text>
        </TouchableOpacity>
      </View>
      {/* Map over 'items' and render each item using FormikProductDetailInput */}
      {values.items.map((_, index) => {
        return (
          <View
            key={index.toString()}
            style={{ flexDirection: 'column', gap: 12 }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <Text style={{ fontWeight: 'bold', fontSize: 14 }}>
                Item {index + 1}
              </Text>
              <TouchableOpacity
                style={{
                  padding: 4,
                  backgroundColor: 'red',
                  borderRadius: 9999,
                  height: 24,
                  width: 24,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
                onPress={() => removeItem(index)} // Trigger removeItem for the specific index
              >
                <Text
                  style={{ fontWeight: 'bold', fontSize: 14, color: 'white' }}
                >
                  -
                </Text>
              </TouchableOpacity>
            </View>
            {/* Render product details form for each item in the list */}
            <FormikProductDetailInput
              key={index.toString()} // Ensure unique key for each rendered input
              fieldName={`items.${index}`} // Bind each input field to its respective item in Formik state
              items={items} // Provide the list of available products to populate the dropdown
            />
          </View>
        );
      })}
    </View>
  );
};
