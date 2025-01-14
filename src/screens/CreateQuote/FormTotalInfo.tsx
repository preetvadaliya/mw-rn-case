/**
 * FormTotalInfo Component
 *
 * This component calculates and displays the subtotal, total tax, and total amount dynamically based on the `items` in the form.
 * The values are automatically recalculated whenever `items` in the Formik state change.
 *
 * Features:
 * - Dynamically computes `subtotal`, `total_tax`, and `total` whenever items are updated.
 * - Updates the computed values in the Formik state using `setFieldValue`.
 * - Displays these fields in a non-editable format with responsive styling.
 */

import { FormikTextInput } from '@src/components';
import type { QuoteFormDataType } from '@src/types';
import { useFormikContext } from 'formik';
import { useEffect } from 'react';
import { Text, View } from 'react-native';

export const FormTotalInfo: React.FC = () => {
  const { values, setFieldValue } = useFormikContext<QuoteFormDataType>();

  useEffect(() => {
    // Function to calculate and update subtotal, tax, and total
    const updateTotals = async () => {
      // Calculate the subtotal by summing up the `subtotal` of all items
      const subTotal = values.items.reduce(
        (total, item) => total + item.subtotal,
        0
      );

      // Calculate tax as 15% of the subtotal
      const totalTax = subTotal * 0.15;

      // Compute the total amount (subtotal + tax)
      const total = subTotal + totalTax;

      // Update the Formik state with rounded values for precision
      await setFieldValue('subtotal', Math.round(subTotal * 100) / 100);
      await setFieldValue('total_tax', Math.round(totalTax * 100) / 100);
      await setFieldValue('total', Math.round(total * 100) / 100);
    };

    updateTotals(); // Trigger total calculation on component mount and updates
  }, [values.items, setFieldValue]); // Run whenever `items` or `setFieldValue` changes

  return (
    <View
      style={{
        marginTop: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 12 // Space between input fields for better layout
      }}
    >
      {/* Subtotal display */}
      <FormikTextInput
        fieldName='subtotal'
        label='Sub Total'
        inputProps={{ editable: false, keyboardType: 'numeric' }} // Read-only numeric field
        containerProps={{ style: { flex: 1 } }} // Flexible width for layout alignment
      />
      <Text>+</Text>
      {/* Total Tax display */}
      <FormikTextInput
        fieldName='total_tax'
        label='Total Tax'
        inputProps={{ editable: false, keyboardType: 'numeric' }} // Read-only numeric field
        containerProps={{ style: { flex: 1 } }} // Flexible width for layout alignment
      />
      <Text>=</Text>
      {/* Total Amount display */}
      <FormikTextInput
        fieldName='total'
        label='Total'
        inputProps={{ editable: false, keyboardType: 'numeric' }} // Read-only numeric field
        containerProps={{ style: { flex: 1 } }} // Flexible width for layout alignment
      />
    </View>
  );
};
