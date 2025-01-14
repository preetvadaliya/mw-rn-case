/**
 * FilterBar Component
 *
 * This component provides a filter bar for searching and filtering data based on:
 * - Customer Name
 * - Status (multiple selection)
 * - Date Range
 *
 * Key Features:
 * - Supports customer name search input.
 * - Allows multi-selection of quote statuses using a dropdown picker.
 * - Date range picker with modal for selecting a start and end date.
 * - Filters are applied dynamically based on user input and changes.
 * - Utilizes React state and effect hooks to manage and update filter criteria.
 */

import dayjs from 'dayjs';
import type React from 'react';
import { useEffect, useState } from 'react';
import { Button, Modal, StyleSheet, Text, TextInput, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePicker, { type DateType } from 'react-native-ui-datepicker';

export type FilterDataTypes = {
  customer_name: string;
  status: string[];
  dateRange: { startDate: DateType; endDate: DateType }; // Added dateRange to the filter type
};

type FilterBarProps = {
  filter: FilterDataTypes;
  setFilter: (filter: FilterDataTypes) => void;
};

const DROPDOWN_ITEMS = [
  { label: 'ACCEPTED', value: 'ACCEPTED' },
  { label: 'REJECTED', value: 'REJECTED' },
  { label: 'DRAFT', value: 'DRAFT' },
  { label: 'SENT', value: 'SENT' },
  { label: 'EXPIRED', value: 'EXPIRED' }
] as const;

export const FilterBar: React.FC<FilterBarProps> = ({ filter, setFilter }) => {
  const [isDDOpen, setIsDDOpen] = useState(false);
  const [cNameFilter, setCNameFilter] = useState(filter.customer_name);
  const [statusFilter, setStatusFilter] = useState(filter.status);
  const [dateRange, setDateRange] = useState({
    startDate: filter.dateRange.startDate,
    endDate: filter.dateRange.endDate
  });
  const [showModal, setShowModal] = useState(false);

  // Update filter whenever name, status, or date range changes
  useEffect(() => {
    setFilter({ customer_name: cNameFilter, status: statusFilter, dateRange });
  }, [cNameFilter, statusFilter, dateRange, setFilter]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.headerText}>FilterBar</Text>

      {/* Customer Name filter input */}
      <View>
        <Text style={styles.label}>Customer Name</Text>
        <TextInput
          placeholder='Search'
          style={styles.input}
          onChangeText={setCNameFilter}
          value={cNameFilter}
        />
      </View>

      {/* Status dropdown filter */}
      <View>
        <Text style={styles.label}>Status</Text>
        <DropDownPicker
          multiple={true}
          mode='BADGE'
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainerStyle}
          placeholder='Status'
          open={isDDOpen}
          setOpen={setIsDDOpen}
          value={statusFilter}
          setValue={setStatusFilter}
          items={[...DROPDOWN_ITEMS]}
        />
      </View>

      {/* Date range picker input */}
      <View>
        <Text style={styles.label}>Date</Text>
        <TextInput
          placeholder='Select Date Range'
          style={styles.input}
          editable={false}
          value={
            dateRange.startDate && dateRange.endDate
              ? `${new Date(dateRange.startDate as string).toDateString()} to ${new Date(
                  dateRange.endDate as string
                ).toDateString()}`
              : ''
          }
          onPress={() => setShowModal(true)}
        />
      </View>

      {/* Modal for Date Picker */}
      <Modal visible={showModal} transparent={true} animationType='slide'>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Modal Title */}
            <Text style={styles.modalTitle}>Select Date Range</Text>
            <DateTimePicker
              mode='range'
              startDate={dateRange.startDate}
              endDate={dateRange.endDate}
              onChange={({ startDate, endDate }) =>
                setDateRange({
                  startDate: startDate ?? null,
                  endDate: endDate ?? null
                })
              }
              disabledDates={(date: DateType) => dayjs(date).isAfter(dayjs())} // Disable future dates
            />
            <View style={styles.modalActions}>
              {/* Cancel Button */}
              <Button title='Cancel' onPress={() => setShowModal(false)} />
              {/* Apply Button */}
              <Button
                title='Apply'
                onPress={() => {
                  setShowModal(false); // Close modal and apply selected date range
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    padding: 10,
    gap: 10
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 16
  },
  label: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 4
  },
  input: {
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 8,
    padding: 12,
    fontSize: 14
  },
  dropdownContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  dropdown: {
    backgroundColor: 'transparent',
    borderColor: 'lightgray'
  },
  dropdownContainerStyle: {
    backgroundColor: '#fff',
    borderColor: 'lightgray'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10
  },
  modalSubtitle: {
    fontSize: 16,
    marginVertical: 10
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20
  }
});
