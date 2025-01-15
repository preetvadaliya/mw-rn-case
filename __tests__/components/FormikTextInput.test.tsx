import { FormikSubmitButton, FormikTextInput } from '@src/components'; // Adjust import path as necessary
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { Formik } from 'formik';

describe('FormikTextInput', () => {
  it('renders the label, input and sets the value to "John Doe"', async () => {
    const onMockSubmit = jest.fn();
    const { getByText, getByTestId } = render(
      <Formik initialValues={{ username: '' }} onSubmit={onMockSubmit}>
        <>
          <FormikTextInput fieldName='username' label='Username' />
          <FormikSubmitButton title='Submit' />
        </>
      </Formik>
    );
    expect(getByText('Username')).toBeTruthy();
    expect(getByTestId('FormikTextInput.Input')).toBeTruthy();
    const input = getByTestId('FormikTextInput.Input');
    fireEvent.changeText(input, 'John Doe');
    expect(input.props.value).toBe('John Doe');
    const submitButton = getByTestId('FormikSubmitButton');
    fireEvent.press(submitButton);
    await waitFor(() =>
      expect(onMockSubmit).toHaveBeenCalledWith(
        { username: 'John Doe' },
        expect.anything()
      )
    );
  });
});
