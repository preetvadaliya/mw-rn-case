/**
 * FormikProductDetailInput Component
 *
 * This component is a custom form input designed for use with Formik in React Native applications.
 * It provides a structured way to select a product, specify its quantity, and calculate the subtotal dynamically.
 *
 * Key Features:
 * - Dropdown to select a product from a provided list.
 * - Automatically populates price and calculates subtotal based on selected product and quantity.
 * - Integrated with Formik for seamless form state management.
 *
 * Usage:
 * <FormikProductDetailInput fieldName="productDetails" items={productList} />
 */

import { Select } from '@devrue/rn-select';
import type { Product } from '@src/types';
import { useField, useFormikContext } from 'formik';
import type React from 'react';
import { useEffect } from 'react';
import { View } from 'react-native';
import { FormikTextInput } from './FormikTextInput';

type FormikItemInputProps = {
  /**
   * The name of the field in the Formik form state. Should match the schema structure.
   */
  fieldName: string;

  /**
   * Array of products to be displayed in the dropdown. Each product must include `title` and `price`.
   */
  items: Product[];
};

export const FormikProductDetailInput: React.FC<FormikItemInputProps> = (
  props
) => {
  const { fieldName, items } = props;

  // Access the specific field and Formik context methods
  const [field] = useField(fieldName);
  const { setFieldValue, isSubmitting } = useFormikContext();

  /**
   * Calculate and update the subtotal whenever quantity or price changes.
   */
  useEffect(() => {
    if (field.value.quantity && field.value.price) {
      setFieldValue(
        `${fieldName}.subtotal`,
        field.value.price * field.value.quantity // Calculate subtotal dynamically
      );
    }
  }, [field.value.quantity, field.value.price]); // Dependencies ensure recalculation when either changes

  return (
    <View style={{ marginBottom: 16, flexDirection: 'column', gap: 12 }}>
      <Select
        options={items.map((item) => [item.title, item.title])}
        value={field?.value?.product_name}
        onChangeValue={async (value: string) => {
          await setFieldValue(`${fieldName}.product_name`, value);
          await setFieldValue(
            `${fieldName}.price`,
            items.find((item) => item.title === value)?.price
          );
        }}
      />
      {/* Input fields for price, quantity, and subtotal */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'stretch',
          gap: 12
        }}
      >
        {/* Price field (read-only) */}
        <FormikTextInput
          fieldName={`${fieldName}.price`}
          label='Price'
          inputProps={{ keyboardType: 'numeric', editable: false }} // Price cannot be edited directly
          containerProps={{ style: { flex: 1 } }}
        />

        {/* Quantity field (user-editable) */}
        <FormikTextInput
          fieldName={`${fieldName}.quantity`}
          label='Quantity'
          inputProps={{ keyboardType: 'numeric' }} // Numeric input for quantity
          containerProps={{ style: { flex: 1 } }}
        />

        {/* Subtotal field (read-only) */}
        <FormikTextInput
          fieldName={`${fieldName}.subtotal`}
          label='Sub Total'
          inputProps={{ editable: false }} // Subtotal cannot be edited directly
          containerProps={{ style: { flex: 1 } }}
        />
      </View>
    </View>
  );
};
