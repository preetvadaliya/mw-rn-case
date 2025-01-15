/**
 * FormikTextInput Component
 *
 * This component is a reusable text input field for use with Formik in React Native applications.
 * It supports custom labels, validation error display, and optional form submission on pressing enter.
 *
 * Key Features:
 * - Displays validation errors when the field is touched.
 * - Supports numeric and text input with optional formatting.
 * - Provides customization options for input and container styles.
 *
 * Usage:
 * <FormikTextInput
 *   fieldName="fieldName"
 *   label="Your Label"
 *   inputProps={{ keyboardType: 'default' }}
 *   containerProps={{ style: { margin: 10 } }}
 * />
 */

import { useField, useFormikContext } from 'formik';
import { useCallback } from 'react';
import {
  Text,
  TextInput,
  type TextInputProps,
  View,
  type ViewProps
} from 'react-native';

type FormikTextInputProps = {
  /**
   * The name of the field in the Formik form state. Should match the schema structure.
   */
  fieldName: string;

  /**
   * The label to display above the text input field.
   */
  label: string;

  /**
   * If true, submits the form when the enter key is pressed (useful for multiline inputs).
   */
  submitOnEnter?: boolean;

  /**
   * Props to customize the TextInput.
   */
  inputProps?: TextInputProps;

  /**
   * Props to customize the container View.
   */
  containerProps?: ViewProps;
};

export const FormikTextInput: React.FC<FormikTextInputProps> = (props) => {
  const {
    fieldName,
    label,
    submitOnEnter = false,
    inputProps,
    containerProps
  } = props;

  // Access field metadata and form context methods
  const [field, meta] = useField(fieldName);
  const {
    handleChange,
    handleBlur,
    setSubmitting,
    isSubmitting,
    submitForm,
    setFieldValue
  } = useFormikContext();

  /**
   * Handle changes to the input value.
   * - Converts to a number if the keyboardType is numeric.
   */
  const onTextChange = (value: string | number) => {
    setFieldValue(
      fieldName,
      inputProps?.keyboardType === 'numeric' ? Number(value) : value
    );
  };

  /**
   * Handle form submission when the enter key is pressed.
   */
  const handleSubmitOnEnter = useCallback(async () => {
    try {
      setSubmitting(true);
      await submitForm();
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  }, [setSubmitting, submitForm]);

  return (
    <View {...containerProps}>
      {/* Field label */}
      <Text
        style={{
          fontWeight: 'bold',
          fontSize: 14,
          marginBottom: 8,
          color: meta.error && meta.touched ? 'red' : 'black'
        }}
      >
        {label}
      </Text>

      {/* Text input field */}
      <TextInput
        {...inputProps}
        testID='FormikTextInput.Input'
        style={[
          {
            borderWidth: 1,
            borderColor: meta.error && meta.touched ? 'red' : 'lightgray',
            borderRadius: 8,
            padding: 12,
            fontSize: 14,
            backgroundColor:
              inputProps?.editable === false ? '#f0f0f0' : 'white', // Light gray background for non-editable inputs
            color: inputProps?.editable === false ? '#888' : 'black' // Gray text color for non-editable inputs
          },
          inputProps?.style
        ]}
        editable={inputProps?.editable ?? !isSubmitting}
        value={field.value?.toString()}
        onChangeText={onTextChange}
        onBlur={handleBlur(fieldName)}
        onSubmitEditing={submitOnEnter ? handleSubmitOnEnter : undefined}
      />

      {/* Validation error message */}
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
