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
import { StyleSheet, Text, View } from 'react-native';

export const FormQuoteInfo: React.FC = () => {
  const [field, meta] = useField('status');
  const { setFieldValue, setFieldTouched } = useFormikContext();

  return (
    <View style={styles.section}>
      {/* Section Title: Display the section heading for "Quote Information" */}
      <Text style={styles.sectionTitle}>Quote Information</Text>
      <FormikTextInput
        fieldName='description'
        label='Description'
        containerProps={{ style: styles.fieldMargin }}
      />
      <Text
        style={[
          styles.label,
          meta.touched && meta.error ? styles.errorLabel : styles.defaultLabel
        ]}
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
      {meta.error && meta.touched ? (
        <Text style={styles.errorMessage}>{meta.error}</Text>
      ) : null}
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  section: {
    marginBottom: 16
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12
  },
  fieldMargin: {
    marginBottom: 16
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8
  },
  defaultLabel: {
    color: 'black'
  },
  errorLabel: {
    color: 'red'
  },
  errorMessage: {
    color: 'red',
    fontSize: 12,
    marginTop: 8
  }
});
