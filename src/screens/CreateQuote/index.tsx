/**
 * CreateQuote Component
 *
 * This component facilitates the creation of a new quote using Formik for managing form state and validation.
 * It includes sections for:
 * - Customer information
 * - Quote details
 * - Item details
 * - Total calculations
 *
 * Key Features:
 * - Provides initial form values and a Yup validation schema.
 * - Handles form submission with success and error handling.
 * - Displays appropriate UI for managing quotes, including keyboard avoiding view.
 */

import { FormikSubmitButton } from '@src/components';
import { useCreateQuote } from '@src/hooks';
import type { QuoteFormDataType } from '@src/types';
import dayjs from 'dayjs';
import { Formik } from 'formik';
import type React from 'react';
import { useMemo } from 'react';
import { Alert, KeyboardAvoidingView, ScrollView } from 'react-native';
import { array, number, object, string } from 'yup';
import { FormCustomerInfo } from './FormCustomerInfo';
import { FormItems } from './FormItems';
import { FormQuoteInfo } from './FormQuoteInfo';
import { FormTotalInfo } from './FormTotalInfo';
import { styles } from './style';

export const CreateQuote: React.FC = () => {
  const { createQuote } = useCreateQuote();

  // Define initial form values
  const initialValues: QuoteFormDataType = useMemo(() => {
    return {
      customer_info: {
        address: 'Pommernstr. 3A',
        city: 'Erlangen',
        country: 'Germany',
        email: 'preetvadaliya@gmail.com',
        name: 'Preet Vadaliya',
        phone: '15566231051'
      },
      description: '',
      status: 'ACCEPTED',
      items: [],
      subtotal: 0,
      total: 0,
      total_tax: 0,
      valid_until: dayjs().add(30, 'day').toISOString()
    };
  }, []);

  // Function to handle form submission
  const onQuoteSubmit = async (values: QuoteFormDataType) => {
    try {
      await createQuote(values);
      Alert.alert('Success', 'Quote created successfully');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to create quote');
    }
  };

  // Define validation schema for the form
  const validationSchema = object({
    customer_info: object({
      address: string().required('Address is required'),
      city: string().required('City is required'),
      country: string().required('Country is required'),
      email: string().email('Invalid email').required('Email is required'),
      name: string().required('Name is required'),
      phone: number().typeError('Invalid phone').required('Phone is required')
    }),
    description: string().optional(),
    status: string().required('Status is required'),
    items: array()
      .of(
        object({
          price: number().required('Price is required'),
          product_name: string().required('Product name is required'),
          quantity: number()
            .min(1, 'Must be at least 1')
            .required('Quantity is required'),
          subtotal: number().required('Subtotal is required')
        })
      )
      .min(1, 'At least one item is required'),
    subtotal: number().required('Subtotal is required'),
    total: number().required('Total is required'),
    total_tax: number().required('Total tax is required')
  });

  return (
    <KeyboardAvoidingView style={styles.container}>
      {/* Formik wrapper for managing form state and validation */}
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onQuoteSubmit} // Form submission handler
        validateOnChange={true} // Trigger validation on field value changes
        validateOnBlur={true} // Trigger validation on field blur
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Form sections */}
          <FormCustomerInfo />
          <FormQuoteInfo />
          <FormItems />
          <FormTotalInfo />
          {/* Submit button */}
          <FormikSubmitButton title='Submit' />
        </ScrollView>
      </Formik>
    </KeyboardAvoidingView>
  );
};
