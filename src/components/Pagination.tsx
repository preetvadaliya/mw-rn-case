/**
 * Pagination Component
 *
 * This component provides a simple pagination interface for navigating between pages.
 * It displays the current page and total pages and includes buttons for navigating to the previous and next pages.
 *
 * Key Features:
 * - Displays the current page number and total pages.
 * - Enables navigation to the previous or next page with buttons.
 * - Disables buttons when on the first or last page to prevent invalid navigation.
 *
 * Usage:
 * <Pagination
 *   totalPage={10}
 *   currentPage={1}
 *   nextPage={handleNextPage}
 *   prevPage={handlePrevPage}
 * />
 */

import React from 'react';
import { Button, Text, View } from 'react-native';

type PaginationProps = {
  /**
   * Total number of pages available.
   */
  totalPage: number;

  /**
   * The current active page number (1-based index).
   */
  currentPage: number;

  /**
   * Function to navigate to the next page.
   */
  nextPage: () => void;

  /**
   * Function to navigate to the previous page.
   */
  prevPage: () => void;

  /**
   * Total number of items across all pages.
   */
  totalItems: number;

  /**
   * Number of items per page.
   */
  perPage: number;
};

export const Pagination: React.FC<PaginationProps> = (props) => {
  const { totalPage, currentPage, totalItems, perPage, prevPage, nextPage } =
    props;
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10
      }}
    >
      <View style={{ flexDirection: 'row', gap: 5 }}>
        {/* Current page and total pages display */}
        <Text style={{ fontSize: 12 }}>
          Page {currentPage} of {totalPage}
        </Text>

        <Text style={{ fontSize: 12 }}>
          Item {(currentPage - 1) * perPage + 1} to{' '}
          {Math.min(currentPage * perPage, totalItems)} of {totalItems}
        </Text>
      </View>

      {/* Navigation buttons */}
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Button
          title='Previous'
          onPress={prevPage}
          disabled={currentPage === 1}
        />
        <Button
          title='Next'
          onPress={nextPage}
          disabled={currentPage === totalPage}
        />
      </View>
    </View>
  );
};

export const PaginationMemo = React.memo(Pagination);
