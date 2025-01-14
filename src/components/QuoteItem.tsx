/**
 * QuoteItem Component
 *
 * A reusable component to display detailed information about a quote in a stylized layout.
 * This component includes:
 * - Quote ID and status with visual indicators.
 * - Customer information.
 * - Total cost and creation date formatted for readability.
 *
 * Key Features:
 * - Visual representation of the quote status (Accepted, Rejected, or Pending).
 * - Optimized with React.memo for performance.
 * - Customizable styling with React Native's StyleSheet.
 *
 * Usage:
 * <QuoteItem
 *   id="123"
 *   status="Accepted"
 *   total={1500}
 *   created="2023-01-14T12:00:00Z"
 *   customer_info={{ name: 'John Doe', ... }}
 * />
 */

import type { CustomerInfo } from '@src/types';
import dayjs from 'dayjs';
import type React from 'react';
import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

type QuoteItemProps = {
  /**
   * Unique identifier for the quote.
   */
  id: string;

  /**
   * Current status of the quote (e.g., Accepted, Rejected, Pending).
   */
  status: string;

  /**
   * Total amount for the quote.
   */
  total: number;

  /**
   * Creation date of the quote in ISO string format.
   */
  created: string;

  /**
   * Customer information associated with the quote.
   */
  customer_info: CustomerInfo;
};

export const QuoteItem: React.FC<QuoteItemProps> = (props) => {
  const { id, status, total, created, customer_info } = props;
  return (
    <View style={styles.container}>
      {/* Header Row: Displays the quote ID and status */}
      <View style={styles.headerRow}>
        <Text style={styles.text}>{id}</Text>
        <View style={styles.statusWrapper}>
          <View
            style={[
              styles.statusDot,
              {
                backgroundColor:
                  status.toLowerCase() === 'accepted'
                    ? 'green'
                    : status.toLowerCase() === 'rejected'
                      ? 'red'
                      : 'yellow'
              }
            ]}
          />
          <Text style={styles.statusText}>{status}</Text>
        </View>
      </View>

      {/* Info Rows: Display customer name, total, and creation date */}
      <View style={styles.infoRow}>
        <Text style={styles.label}>Name</Text>
        <Text style={styles.text}>{customer_info.name}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.label}>Total</Text>
        <Text style={styles.text}>{total}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.label}>Created</Text>
        <Text style={styles.text}>{dayjs(created).toString()}</Text>
      </View>
    </View>
  );
};

/**
 * Memoized version of the QuoteItem component to prevent unnecessary re-renders.
 * React.memo compares the previous and next props by shallow comparison.
 */
export const QuoteItemMemo = memo(QuoteItem, (prevProps, nextProps) => {
  return prevProps.id === nextProps.id;
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    gap: 8,
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginVertical: 5
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  statusWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
    gap: 8,
    backgroundColor: '#ccc',
    borderRadius: 8
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 8
  },
  statusText: {
    fontWeight: 'bold',
    fontSize: 10
  },
  label: {
    fontWeight: 'bold',
    fontSize: 12
  },
  text: {
    fontSize: 12
  }
});
