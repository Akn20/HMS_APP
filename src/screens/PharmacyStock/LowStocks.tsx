import React, {useEffect, useState, useMemo} from 'react';
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {MaterialIcons} from '@expo/vector-icons';

import {useTheme} from '../../hooks';
import {Block, Text, Input} from '../../components';
import {getStock} from '../../api/stocks';
import {useNavigation} from '@react-navigation/native';

type StockRow = {
  id: string;
  batch_number: string;
  expiry_date: string;
  quantity: number;
  reorder_level: number;
  medicine?: {
    medicine_name: string;
  };
};

export default function LowStocks() {

  const {colors, sizes} = useTheme();
  const navigation = useNavigation<any>();

  const [rows, setRows] = useState<StockRow[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  // ===============================
  // FETCH STOCK
  // ===============================
  const fetchStocks = async () => {

    setLoading(true);

    try {

      const res = await getStock();

      setRows(res.data.data || []);

    } catch {

      console.log('Failed to fetch stocks');

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {
    fetchStocks();
  }, []);

  // ===============================
  // FILTER LOW STOCK
  // ===============================
  const filtered = useMemo(() => {

    return rows.filter(r => {

      const lowStock = r.quantity <= r.reorder_level;

      const q = query.toLowerCase().trim();

      if (!lowStock) return false;

      if (!q) return true;

      return (
        r.medicine?.medicine_name?.toLowerCase().includes(q) ||
        r.batch_number?.toLowerCase().includes(q)
      );

    });

  }, [rows, query]);

  // ===============================
  // ROW UI
  // ===============================
  const renderRow = ({item, index}: any) => {

    return (

      <TouchableOpacity
        style={[styles.row, {borderColor: colors.gray}]}
        onPress={() =>
          navigation.navigate('StockDetails', {id: item.id})
        }
      >

        <Text style={{width: 25}}>{index + 1}</Text>

        <View style={{flex: 1}}>

          <Text semibold>
            {item.medicine?.medicine_name}
          </Text>

          <Text size={12}>
            Batch: {item.batch_number}
          </Text>

          <Text size={12}>
            Exp: {new Date(item.expiry_date).toLocaleDateString()}
          </Text>

        </View>

        <View style={{width: 90}}>

          <View
            style={[
              styles.pill,
              {backgroundColor: colors.danger},
            ]}
          >

            <Text size={12} color={colors.white}>
              Low Stock
            </Text>

          </View>

        </View>

        <MaterialIcons
          name="chevron-right"
          size={22}
          color={colors.gray}
        />

      </TouchableOpacity>
    );
  };

  // ===============================
  // UI
  // ===============================
  return (

    <Block safe style={{flex: 1, backgroundColor: colors.background}}>

      <Block padding={sizes.m}>

        <Text h5 semibold >
          Low Stock Medicines
        </Text>

        <Block flex={1} marginRight={10} marginTop={5} >
                      <Input
                        placeholder="Search medicine or batch..."
                        value={query}
                        onChangeText={setQuery}
                      />
                    </Block>
      
      </Block>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={renderRow}
        contentContainerStyle={{
          paddingHorizontal: sizes.m,
          paddingBottom: 50,
        }}
        ListEmptyComponent={
          <Block center marginTop={40}>
            <Text>No low stock medicines</Text>
          </Block>
        }
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

  pill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    alignItems: 'center',
  },

});