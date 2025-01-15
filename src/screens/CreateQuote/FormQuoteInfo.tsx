/**
 * FormQuoteInfo Component
 *
 * This component renders a section of the form related to "Quote Information" using Formik for form state management.
 * It includes an input field for the quote description, which is managed via the `FormikTextInput` component.
 *
 * Features:
 * - Provides a text input field for entering the quote description.
 * - Utilizes Formik for managing the form state and validation.
 * - Styled with custom styles for a responsive layout and spacing.
 */

import { Select } from '@devrue/rn-select';
import { FormikTextInput } from '@src/components';
import { useField, useFormikContext } from 'formik';
import { Text, View } from 'react-native';
import { styles } from './style';

export const FormQuoteInfo: React.FC = () => {
  const [field, meta] = useField('status');
  const { setFieldValue, setFieldTouched } = useFormikContext();
  return (
    <View style={styles.section}>
      {/* Section Title: Display the section heading for "Quote Information" */}
      <Text style={styles.sectionTitle}>Quote Information</Text>

      {/* Description Input Field: Formik-managed text input for entering the quote description */}
      <FormikTextInput
        fieldName='description' // Formik field name to bind the input value
        label='Description' // Label displayed above the input field
        containerProps={{ style: styles.fieldMargin }} // Extra styling for spacing around the input field
      />
      <Text
        style={{
          fontWeight: 'bold',
          fontSize: 14,
          marginBottom: 8,
          color: meta.error && meta.touched ? 'red' : 'black'
        }}
      >
        Status
      </Text>
      <Select
        options={[
          ['ACCEPTED', 'ACCEPTED'],
          ['REJECTED', 'REJECTED'],
          ['SENT', 'SENT'],
          ['DRAFT', 'DRAFT'],
          ['EXPIRED', 'EXPIRED']
        ]}
        value={field.value}
        onChangeValue={(value: string) => {
          setFieldTouched('status', true);
          setFieldValue('status', value);
        }}
      />
      {meta.touched && meta.error ? (
        <Text
          style={{
            color: 'red',
            fontSize: 12,
            fontWeight: 'light',
            marginTop: 8
          }}
        >
          {meta.error}
        </Text>
      ) : null}
    </View>
  );
};
