import { FormikSubmitButton, FormikTextInput } from '@src/components'; // Adjust import path as necessary
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { Formik } from 'formik';

describe('<FormikSubmitButton />', () => {
  it('disables the submit button while submitting', async () => {
    const onMockSubmit = jest.fn();
    const initialValues = { username: 'John Doe' };
    const { getByTestId } = render(
      <Formik initialValues={initialValues} onSubmit={onMockSubmit}>
        <>
          <FormikTextInput fieldName='username' label='Username' />
          <FormikSubmitButton title='Submit' />
        </>
      </Formik>
    );
    const submitButton = getByTestId('FormikSubmitButton');
    fireEvent.press(submitButton);
    expect(submitButton.props.accessibilityState.disabled).toBe(true);
    await waitFor(() => expect(onMockSubmit).toHaveBeenCalled());
    expect(submitButton.props.accessibilityState.disabled).toBe(false);
  });
});
