/**
 * FormikSubmitButton Component
 *
 * This component is a custom submit button for use with Formik in React Native applications.
 * It handles the form submission process, including validation, submission, and resetting the form state.
 *
 * Key Features:
 * - Integrates with Formik to manage form submission and validation.
 * - Resets the form state based on validation results.
 * - Provides a disabled state while the form is submitting.
 *
 * Usage:
 * <FormikSubmitButton title="Submit" />
 */

import type { QuoteFormDataType } from '@src/types';
import { useFormikContext } from 'formik';
import { useCallback } from 'react';
import { Button, type ButtonProps } from 'react-native';

export const FormikSubmitButton: React.FC<ButtonProps> = (props) => {
  // Access Formik methods and state
  const { submitForm, isSubmitting, setSubmitting, resetForm, validateForm } =
    useFormikContext<QuoteFormDataType>();

  /**
   * Handles form submission logic.
   * - Validates the form.
   * - Resets touched fields based on validation results.
   * - Submits the form if there are no validation errors.
   */
  const onSubmit = useCallback(async () => {
    try {
      setSubmitting(true); // Indicate the form is submitting

      // Validate the form and capture any errors
      const errors = await validateForm();

      if (Object.keys(errors).length >= 1) {
        // If there are errors, reset the form's touched state for `items`
        resetForm({ touched: { items: [] } });
        await validateForm(); // Re-run validation after resetting
      } else {
        // Submit the form if no errors are found
        await submitForm();
        resetForm({ touched: { items: undefined } }); // Reset touched state after submission
      }
    } catch (error) {
      console.error(error); // Log any unexpected errors
    } finally {
      setSubmitting(false); // Ensure submitting state is cleared
    }
  }, [setSubmitting, submitForm, resetForm, validateForm]); // Dependencies ensure memoization

  // Render the Button component with the custom onSubmit handler
  return <Button {...props} disabled={isSubmitting} onPress={onSubmit} />;
};
