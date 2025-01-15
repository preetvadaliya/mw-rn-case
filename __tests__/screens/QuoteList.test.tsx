import { QuotesList } from '@src/screens';
import { render } from '@testing-library/react-native';
import { waitFor } from '@testing-library/react-native';

describe('<QuotesList />', () => {
  // Test the CreateQuote component.
  test('renders correctly', async () => {
    const { toJSON } = render(<QuotesList />);
    await waitFor(() => expect(toJSON()).toMatchSnapshot());
  });
});
