/**
 * FormCustomerInfo Component
 *
 * This component renders a form section for capturing customer information.
 * It includes fields for:
 * - Name
 * - Email
 * - Phone
 * - Address
 * - City
 * - Country
 *
 * Key Features:
 * - Uses Formik for form state management.
 * - Provides customization options for input fields.
 * - Layout is responsive, with city and country fields arranged side by side.
 */

import { FormikTextInput } from '@src/components';
import type React from 'react';
import { Text, View } from 'react-native';
import { styles } from './style';

export const FormCustomerInfo: React.FC = () => (
  <View style={styles.section}>
    {/* Section Title */}
    <Text style={styles.sectionTitle}>Customer Information</Text>

    {/* Name field */}
    <FormikTextInput
      fieldName='customer_info.name'
      label='Name'
      containerProps={{ style: styles.fieldMargin }}
    />

    {/* Email field with email-address keyboard type */}
    <FormikTextInput
      fieldName='customer_info.email'
      label='Email'
      inputProps={{ keyboardType: 'email-address' }}
      containerProps={{ style: styles.fieldMargin }}
    />

    {/* Phone field with phone-pad keyboard type */}
    <FormikTextInput
      fieldName='customer_info.phone'
      label='Phone'
      inputProps={{ keyboardType: 'phone-pad' }}
      containerProps={{ style: styles.fieldMargin }}
    />

    {/* Address field */}
    <FormikTextInput
      fieldName='customer_info.address'
      label='Address'
      containerProps={{ style: styles.fieldMargin }}
    />

    {/* Row layout for City and Country fields */}
    <View style={styles.row}>
      <FormikTextInput
        fieldName='customer_info.city'
        label='City'
        containerProps={{ style: styles.halfField }}
      />
      <FormikTextInput
        fieldName='customer_info.country'
        label='Country'
        containerProps={{ style: styles.halfField }}
      />
    </View>
  </View>
);
