import { useNavigation } from '@react-navigation/native';
import { Screens } from '@src/constants';
import { Home } from '@src/screens';
import { fireEvent, render } from '@testing-library/react-native';

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn()
}));

// Test the Home component.
describe('<Home />', () => {
  it('navigates to the LIST_QUOTES screen when "View Quotes" is pressed', () => {
    const navigateMock = jest.fn();
    (useNavigation as jest.Mock).mockReturnValue({ navigate: navigateMock });
    const { getByText } = render(<Home />);
    fireEvent.press(getByText('View Quotes'));
    expect(navigateMock).toHaveBeenCalledWith(Screens.LIST_QUOTES);
  });

  it('navigates to the CREATE_QUOTE screen when "Create Quote" is pressed', () => {
    const navigateMock = jest.fn();
    (useNavigation as jest.Mock).mockReturnValue({ navigate: navigateMock });
    const { getByText } = render(<Home />);
    fireEvent.press(getByText('Create Quote'));
    expect(navigateMock).toHaveBeenCalledWith(Screens.CREATE_QUOTE);
  });
});
