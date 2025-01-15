import { App } from '@src/App';
import { render } from '@testing-library/react-native';

// Test the App component.
describe('<App />', () => {
  test('renders correctly', () => {
    const { toJSON } = render(<App />);
    // Check if the component renders correctly.
    expect(toJSON()).toMatchSnapshot();
  });
});
