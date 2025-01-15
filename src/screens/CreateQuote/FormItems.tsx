import { FormikProductDetailInput } from '@src/components';
import { useGetProducts } from '@src/hooks/useGetProducts';
import type { QuoteFormDataType } from '@src/types';
import { useField, useFormikContext } from 'formik';
import type React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type AddButtonProps = {
  onPress: () => void;
  disabled: boolean;
};

type RemoveButtonProps = {
  onPress: () => void;
};

// AddButton Component
const AddButton: React.FC<AddButtonProps> = (props) => {
  const { onPress, disabled } = props;
  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles.addButton,
        disabled && styles.disabledButton
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.buttonText}>+</Text>
    </TouchableOpacity>
  );
};

// RemoveButton Component
const RemoveButton: React.FC<RemoveButtonProps> = (props) => {
  const { onPress } = props;
  return (
    <TouchableOpacity
      style={[styles.button, styles.removeButton]}
      onPress={onPress}
    >
      <Text style={styles.buttonText}>-</Text>
    </TouchableOpacity>
  );
};

export const FormItems: React.FC = () => {
  const { values, setFieldValue, setFieldTouched } =
    useFormikContext<QuoteFormDataType>();
  const [_, meta] = useField('items');
  const { items, isLoading } = useGetProducts();

  const addItem = () => {
    setFieldTouched('items', true);
    setFieldValue('items', [
      ...values.items,
      {
        price: items[0]?.price || 0,
        product_name: items[0]?.title || '',
        quantity: 1,
        subtotal: items[0]?.price || 0
      }
    ]);
  };

  const removeItem = (index: number) => {
    const newItems = [...values.items];
    newItems.splice(index, 1);
    setFieldValue('items', newItems, false);
  };

  return (
    <View>
      <View style={styles.headerContainer}>
        <View>
          <Text style={styles.sectionTitle}>Item Information</Text>
          {meta.error && meta.touched && typeof meta.error === 'string' ? (
            <Text style={styles.errorText}>{meta.error.toString()}</Text>
          ) : null}
        </View>
        <AddButton onPress={addItem} disabled={isLoading} />
      </View>
      {values.items.map((_, index) => (
        <View key={index.toString()} style={styles.itemContainer}>
          <View style={styles.itemHeader}>
            <Text style={styles.itemTitle}>Item {index + 1}</Text>
            <RemoveButton onPress={() => removeItem(index)} />
          </View>
          <FormikProductDetailInput
            key={index.toString()}
            fieldName={`items.${index}`}
            items={items}
          />
        </View>
      ))}
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  errorText: {
    color: 'red',
    fontSize: 12
  },
  button: {
    padding: 4,
    borderRadius: 9999,
    height: 24,
    width: 24,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  addButton: {
    backgroundColor: 'blue'
  },
  removeButton: {
    backgroundColor: 'red'
  },
  disabledButton: {
    backgroundColor: 'gray'
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 14,
    color: 'white'
  },
  itemContainer: {
    flexDirection: 'column',
    gap: 12
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  itemTitle: {
    fontWeight: 'bold',
    fontSize: 14
  }
});
