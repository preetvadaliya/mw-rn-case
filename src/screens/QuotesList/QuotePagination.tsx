/**
 * QuotePagination Component
 *
 * This component handles the pagination and display of quotes based on the selected filters.
 * It fetches and displays a paginated list of quotes, supports refreshing, and allows navigation between pages.
 *
 * Key Features:
 * - Handles pagination for quote data.
 * - Displays quotes with details such as status, total, and customer information.
 * - Supports refreshing the list of quotes using a pull-to-refresh mechanism.
 * - Displays an empty state with an error message when no quotes are found.
 * - Includes pagination controls for navigating between pages.
 */

import { PaginationMemo, QuoteItemMemo } from '@src/components';
import { useGetQuotes } from '@src/hooks';
import type { Quote } from '@src/types';
import dayjs from 'dayjs';
import type React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, RefreshControl, Text, View } from 'react-native';
import type { FilterDataTypes } from './FilterBar';

type QuotePaginationProps = {
  filter: FilterDataTypes;
};

type PageState = {
  pageNumber?: number;
  quotes?: Quote[];
};

type PagesCache = {
  [key: number]: PageState;
};

export const QuotePagination: React.FC<QuotePaginationProps> = (props) => {
  const { filter } = props;
  const { getQuotes } = useGetQuotes();
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [perPage, setPerPage] = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [pages, setPages] = useState<PagesCache>({});

  // Fetch quotes for the current page
  const fetchQuotes = useCallback(
    async (page: number, refresh?: boolean) => {
      if (pages[page]?.quotes && !refresh) {
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const quotesResponse = await getQuotes(page);
        setPageNumber(quotesResponse?.pageNumber ?? 1);
        setTotalPages(quotesResponse?.totalPages ?? 1);
        setTotalItems(quotesResponse?.totalItems ?? 0);
        setPerPage(quotesResponse?.perPage ?? 30);
        setPages((prevPages) => ({
          ...prevPages,
          [quotesResponse?.pageNumber || 1]: {
            pageNumber: quotesResponse?.pageNumber || 1,
            quotes: quotesResponse?.quotes || []
          }
        }));
        setLoading(false);
      } catch (error) {
        Alert.alert('Error fetching quotes', (error as Error).message, [
          { text: 'OK', onPress: () => setLoading(false) }
        ]);
        setError(error as Error);
      }
    },
    [pages]
  );

  // Fetch quotes when page number changes
  useEffect(() => {
    fetchQuotes(pageNumber);
  }, [pageNumber]);

  return (
    <>
      {/* FlatList to display the quotes */}
      <FlatList
        style={{ flex: 1, paddingHorizontal: 10 }}
        keyExtractor={(item, i) => item.id || i.toString()}
        data={
          pages[pageNumber]?.quotes?.filter((item) => {
            // Check customer name filter
            const matchesCustomerName = filter.customer_name
              ? item.customer_info.name
                  .toLowerCase()
                  .includes(filter.customer_name.toLowerCase())
              : true;

            // Check status filter (assuming status is an array)
            const matchesStatus =
              filter.status.length > 0
                ? filter.status.includes(item.status)
                : true;

            // Check date range filter using dayjs for inclusive comparison
            const matchesDateRange =
              filter.dateRange.startDate && filter.dateRange.endDate
                ? dayjs(item.created).isAfter(
                    dayjs(filter.dateRange.startDate)
                  ) &&
                  dayjs(item.created).isBefore(dayjs(filter.dateRange.endDate))
                : true;

            // Return true if all conditions match
            return matchesCustomerName && matchesStatus && matchesDateRange;
          }) || []
        }
        renderItem={(item) => (
          <QuoteItemMemo
            id={item.item.id || 'Local Quote'}
            status={item.item.status}
            total={item.item.total}
            created={item.item.created}
            customer_info={item.item.customer_info}
          />
        )}
        refreshControl={
          // Pull-to-refresh control
          <RefreshControl
            refreshing={loading}
            onRefresh={() => fetchQuotes(pageNumber, true)}
          />
        }
        ListEmptyComponent={
          // Empty state for no quotes or errors
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          >
            <Text style={{ fontSize: 16, textAlign: 'center' }}>
              {error
                ? `${error.message} \n Try refreshing.`
                : 'No quotes found.'}
            </Text>
          </View>
        }
      />

      {/* Pagination controls */}
      <PaginationMemo
        totalPage={totalPages}
        currentPage={pageNumber}
        totalItems={totalItems}
        perPage={perPage}
        nextPage={() => setPageNumber(pageNumber + 1)}
        prevPage={() => setPageNumber(pageNumber - 1)}
      />
    </>
  );
};
