import React, { useEffect, useState, useCallback } from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  RefreshControl,
  Alert,
} from 'react-native';

import { useTheme } from '../hooks';
import { Block, Text } from '../components';
import { getLowStock } from '../api/stocks';

type StockRow = {
  id: string;
  batch_number: string;
  expiry_date: string;
  quantity: number;
  reorder_level: number;
  mrp: number;
  medicine?: {
    medicine_name: string;
  };
};

export default function LowStock() {
  const { colors, sizes } = useTheme();

  const [rows, setRows] = useState<StockRow[]>([]);
  const [loading, setLoading] = useState(false);

  // ===============================
  // FETCH LOW STOCK
  // ===============================
  const fetchLowStock = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getLowStock();

      // IMPORTANT: Laravel usually returns { data: [...] }
      setRows(res.data?.data ?? []);
    } catch (error: any) {
      console.log('LOW STOCK ERROR:', error?.message);
      Alert.alert('Error', 'Failed to fetch low stock items');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLowStock();
  }, [fetchLowStock]);

  // ===============================
  // RENDER ITEM
  // ===============================
  const renderItem = ({ item, index }: any) => {
    const isExpired = new Date(item.expiry_date) < new Date();

    return (
      <View style={[styles.row, { borderColor: colors.gray }]}>
        <Text style={{ width: 25 }}>{index + 1}</Text>

        <Block flex={1}>
          <Text semibold>
            {item.medicine?.medicine_name ?? 'N/A'}
          </Text>

          <Text size={12}>
            Batch: {item.batch_number}
          </Text>

          <Text size={12}>
            Qty: {item.quantity} / Reorder: {item.reorder_level}
          </Text>

          <Text size={12}>
            Expiry: {new Date(item.expiry_date).toLocaleDateString()}
          </Text>
        </Block>

        <Block align="flex-end">
          <Text size={11} color={colors.danger}>
            Low Stock
          </Text>

          {isExpired && (
            <Text size={11} color="orange">
              Expired
            </Text>
          )}
        </Block>
      </View>
    );
  };

  // ===============================
  // UI
  // ===============================
  return (
    <Block safe style={{ flex: 1, backgroundColor: colors.background }}>
      <Block padding={sizes.m}>
        <Text h5 semibold>
          Low Stock Items
        </Text>
      </Block>

      <FlatList
        data={rows}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={fetchLowStock}
          />
        }
        contentContainerStyle={{ padding: sizes.m }}
        ListEmptyComponent={
          !loading ? (
            <Text center marginTop={20}>
              No low stock items found
            </Text>
          ) : null
        }
        showsVerticalScrollIndicator={false}
      />
    </Block>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderWidth: 1,
    borderRadius: 14,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
});