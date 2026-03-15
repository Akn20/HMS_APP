import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal as RNModal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {MaterialIcons} from '@expo/vector-icons';

import {useTheme} from '../../hooks';
import {Block, Button, Input, Text} from '../../components';
import { useNavigation } from '@react-navigation/native';
import {
  getExpiryBatches,
  markExpired,
  returnToVendor,
  approveReturn,
  completeReturn,
} from '../../api/expiry';

type ExpiryRow = {
  batch_id: string;
  medicine: string;
  batch_number: string;
  expiry_date: string;
  quantity: number;
  status: 'EXPIRING' | 'EXPIRED' | 'PENDING' | 'APPROVED' | 'COMPLETED';
  days_left: number;
};

export default function ExpiryList() {
  const {colors, sizes} = useTheme();
  const navigation = useNavigation<any>();

  const [rows, setRows] = useState<ExpiryRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(220);

  const [query, setQuery] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    medicine: '',
    batch_number: '',
    expiry_date: '',
    quantity: '',
  });

  // ===============================
  // FETCH
  // ===============================
  const refresh = useCallback(async () => {
    setLoading(true);

    try {
      const res = await getExpiryBatches();

      setRows(Array.isArray(res.data.data) ? res.data.data : []);
    } catch {
      Alert.alert('Error', 'Failed to fetch expiry list');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, []);

  // ===============================
  // FILTER
  // ===============================
  const filtered = useMemo(() => {
    return rows.filter(r => {
      const q = query.toLowerCase().trim();

      if (!q) return true;

      return (
        r.medicine.toLowerCase().includes(q) ||
        r.batch_number.toLowerCase().includes(q)
      );
    });
  }, [rows, query]);

  // ===============================
  // ACTIONS
  // ===============================
  const handleMarkExpired = async (row: ExpiryRow) => {
    await markExpired(row.batch_id);
    refresh();
  };

  const handleReturn = async (row: ExpiryRow) => {
    await returnToVendor(row.batch_id);
    refresh();
  };

  const handleApprove = async (row: ExpiryRow) => {
    await approveReturn(row.batch_id);
    refresh();
  };

  const handleComplete = async (row: ExpiryRow) => {
    await completeReturn(row.batch_id);
    refresh();
  };

  // ===============================
  // STATUS PILL
  // ===============================
  const StatusPill = ({status}: {status: string}) => {
    let bg = colors.primary;

    if (status === 'EXPIRING') bg = '#f59e0b';
    if (status === 'EXPIRED') bg = '#ef4444';
    if (status === 'PENDING') bg = '#f97316';
    if (status === 'APPROVED') bg = '#3b82f6';
    if (status === 'COMPLETED') bg = '#22c55e';

    return (
      <View style={[styles.pill, {backgroundColor: bg}]}>
        <Text size={11} color={colors.white} semibold>
          {status}
        </Text>
      </View>
    );
  };

  // ===============================
  // ROW
  // ===============================
 const renderRow = ({ item, index }: any) => {
  return (
    <TouchableOpacity
      style={[styles.row, { borderColor: colors.gray }]}
      onPress={() =>
        navigation.navigate('ExpiryDetail', { batch: item })
      }
    >
      <Text style={{ width: 25 }}>{index + 1}</Text>

      <View style={{ flex: 1 }}>
        <Text semibold>{item.medicine}</Text>
        <Text size={12}>Qty: {item.quantity}</Text>
      </View>

      <View style={{ width: 100 }}>
        <StatusPill status={item.status} />
      </View>

      <View
        style={{
          width: 90,
          flexDirection: 'row',
          justifyContent: 'flex-end',
        }}
      >
        {item.status === 'EXPIRING' && (
          <TouchableOpacity
            style={{ marginRight: 10 }}
            onPress={() => handleMarkExpired(item)}
          >
            <MaterialIcons name="warning" size={20} color="#f59e0b" />
          </TouchableOpacity>
        )}

        {item.status === 'EXPIRED' && (
          <TouchableOpacity
            style={{ marginRight: 10 }}
            onPress={() => handleReturn(item)}
          >
            <MaterialIcons name="reply" size={20} color={colors.primary} />
          </TouchableOpacity>
        )}

        {item.status === 'PENDING' && (
          <TouchableOpacity
            style={{ marginRight: 10 }}
            onPress={() => handleApprove(item)}
          >
            <MaterialIcons
              name="check-circle"
              size={20}
              color={colors.primary}
            />
          </TouchableOpacity>
        )}

        {item.status === 'APPROVED' && (
          <TouchableOpacity onPress={() => handleComplete(item)}>
            <MaterialIcons
              name="task-alt"
              size={20}
              color={colors.success}
            />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

  // ===============================
  // UI
  // ===============================
  return (
    <Block safe style={{flex: 1, backgroundColor: colors.background}}>
      {loading && (
        <View style={styles.loadingOverlay}>
          <Text semibold>Loading...</Text>
        </View>
      )}

      {/* HEADER */}
      <View
        style={[styles.headerFixed, {backgroundColor: colors.background}]}
        onLayout={e => setHeaderHeight(e.nativeEvent.layout.height)}>
        <Block padding={sizes.m}>
          <Block row justify="space-between" align="center">
            <Text h5 semibold marginBottom={10}>
              Expiry Management
            </Text>

            <Button>
              
            </Button>
          </Block>

         <Block flex={1} marginRight={10}>
                       <Input
                         placeholder="Search medicine or batch..."
                         value={query}
                         onChangeText={setQuery}
                       />
                     </Block>

          <View style={[styles.tableHeader, {borderColor: colors.gray}]}>
            <Text style={{width: 40}}>SL</Text>
            <Text style={{flex: 1}}>Medicine</Text>
            <Text style={{width: 100}}>Status</Text>
            <Text style={{width: 90, textAlign: 'right'}}>Actions</Text>
          </View>
        </Block>
      </View>

      {/* LIST */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.batch_id}
        renderItem={renderRow}
        contentContainerStyle={{
          paddingTop: headerHeight + 10,
          paddingHorizontal: sizes.m,
          paddingBottom: 120,
        }}
      />

      {/* MODAL */}
      <RNModal visible={modalOpen} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <SafeAreaView>
              <View style={styles.modalCard}>
                <ScrollView>
                  <Text h5 semibold>
                    {editingId ? 'Edit Expiry Record' : 'Add Expiry Record'}
                  </Text>

                  <Input
                    placeholder="Medicine Name"
                    value={form.medicine}
                    onChangeText={v => setForm({...form, medicine: v})}
                    marginTop={sizes.m}
                  />

                  <Input
                    placeholder="Batch Number"
                    value={form.batch_number}
                    onChangeText={v =>
                      setForm({...form, batch_number: v})
                    }
                  />

                  <Input
                    placeholder="Expiry Date"
                    value={form.expiry_date}
                    onChangeText={v =>
                      setForm({...form, expiry_date: v})
                    }
                  />

                  <Input
                    placeholder="Quantity"
                    keyboardType="numeric"
                    value={form.quantity}
                    onChangeText={v =>
                      setForm({...form, quantity: v})
                    }
                  />

                  <Block row justify="space-between" marginTop={sizes.l}>
                    <Button
                      gray
                      onPress={() => setModalOpen(false)}
                      style={{flex: 1, marginRight: 10}}>
                      <Text>Cancel</Text>
                    </Button>

                    <Button primary style={{flex: 1}}>
                      <Text color={colors.white}>Save</Text>
                    </Button>
                  </Block>
                </ScrollView>
              </View>
            </SafeAreaView>
          </KeyboardAvoidingView>
        </View>
      </RNModal>
    </Block>
  );
}

const styles = StyleSheet.create({
  headerFixed: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 999,
  },

  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 12,
    marginTop: 16,
  },

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
  },

  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },

  modalCard: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    padding: 20,
  },

  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
});