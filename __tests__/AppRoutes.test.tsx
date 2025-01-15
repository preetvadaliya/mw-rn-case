import { AppRoutes } from '@src/AppRoutes';
import { render } from '@testing-library/react-native';

// Test the AppRoutes component.
describe('<AppRoutes />', () => {
  test('renders correctly', () => {
    const { toJSON, getByText } = render(<AppRoutes />);
    // Check if the component renders correctly.
    expect(toJSON()).toMatchSnapshot();
    // Check if the component has the correct text.
    expect(getByText('View Quotes')).toBeDefined();
    expect(getByText('Create Quote')).toBeDefined();
  });
});
