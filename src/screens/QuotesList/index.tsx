import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { FilterBar, type FilterDataTypes } from './FilterBar';
import { QuotePagination } from './QuotePagination';

export const QuotesList: React.FC = () => {
  const [filter, setFilter] = useState<FilterDataTypes>({
    customer_name: '',
    status: [],
    dateRange: {
      startDate: null,
      endDate: null
    }
  });

  return (
    <View style={styles.container}>
      <FilterBar filter={filter} setFilter={setFilter} />
      <QuotePagination filter={filter} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 10
  }
});
