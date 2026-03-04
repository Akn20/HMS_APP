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
import {Block, Button, Input, Switch, Text, Image} from '../../components';

import {
  getStock,
  getDeletedStock,
  createStock,
  updateStock,
  deleteStock,
  restoreStock,
  permanentlyDeleteStock,
} from '../../api/stocks';

type StockRow = {
  id: string;
  batch_number: string;
  expiry_date: string;
  quantity: number;
  reorder_level: number;
  mrp: number;
  status: number;
  deleted_at: string | null;
  medicine?: {
    medicine_name: string;
  };
};

export default function PharmacyStockList() {
  const {colors, sizes, gradients, assets} = useTheme();
  const [tab, setTab] = useState<number>(0);
  const [rows, setRows] = useState<StockRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(240);

  const [query, setQuery] = useState('');
  const [showDeleted, setShowDeleted] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showLowStock, setShowLowStock] = useState(false);

  const [form, setForm] = useState<any>({
    medicine_name: '',
    generic_name: '',
    category: '',
    manufacturer: '',
    batch_number: '',
    expiry_date: '',
    purchase_price: '',
    mrp: '',
    quantity: '',
    reorder_level: '',
    status: 1,
  });

  // ===============================
  // FETCH DATA
  // ===============================
  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = showDeleted
        ? await getDeletedStock()
        : await getStock();

      setRows(res.data.data);
    } catch {
      Alert.alert('Error', 'Failed to fetch stock');
    } finally {
      setLoading(false);
    }
  }, [showDeleted]);

useEffect(() => {
  refresh();
}, [showDeleted]);

 useEffect(() => {
  const interval = setInterval(() => {
    refresh();   // refresh current mode
  }, 5000); // every 5 seconds

  return () => clearInterval(interval);
}, [showDeleted]);

  // ===============================
  // FILTER
  // ===============================
const filtered = useMemo(() => {
  return rows.filter(r => {
    if (!showDeleted && r.deleted_at) return false;

    if (showLowStock && r.quantity > r.reorder_level) return false;

    const q = query.toLowerCase().trim();
    if (!q) return true;

    return (
      r.medicine?.medicine_name?.toLowerCase().includes(q) ||
      r.batch_number.toLowerCase().includes(q)
    );
  });
}, [rows, query, showDeleted, showLowStock]);

  // ===============================
  // OPEN MODAL
  // ===============================
  const openAdd = () => {
    setEditingId(null);
    setForm({
      medicine_name: '',
      generic_name: '',
      category: '',
      manufacturer: '',
      batch_number: '',
      expiry_date: '',
      purchase_price: '',
      mrp: '',
      quantity: '',
      reorder_level: '',
      status: 1,
    });
    setModalOpen(true);
  };

  const openEdit = (row: StockRow) => {
    setEditingId(row.id);
    setForm({...row});
    setModalOpen(true);
  };

  // ===============================
  // SAVE
  // ===============================
const onSave = async () => {
  try {
    console.log("SENDING DATA:", form);

    if (!editingId) {
      const res = await createStock(form);
      console.log("CREATE RESPONSE:", res.data);
      setRows(prev => [...prev, res.data.data]);
    } else {
      const res = await updateStock(editingId, form);
      console.log("UPDATE RESPONSE:", res.data);
      refresh();
    }

    setModalOpen(false);
  } catch (error: any) {
    console.log("SAVE ERROR FULL:", error);
    console.log("SAVE ERROR DATA:", error?.response?.data);

    Alert.alert(
      "Error",
      error?.response?.data?.message || "Save failed"
    );
  }
};
  // ===============================
  // DELETE / RESTORE
  // ===============================
  const softDelete = async (row: StockRow) => {
    await deleteStock(row.id);
    setRows(prev => prev.filter(r => r.id !== row.id));
  };

  const restore = async (row: StockRow) => {
    await restoreStock(row.id);
    setRows(prev => prev.filter(r => r.id !== row.id));
  };

  const permanentDelete = async (row: StockRow) => {
    await permanentlyDeleteStock(row.id);
    setRows(prev => prev.filter(r => r.id !== row.id));
  };

  // ===============================
  // STATUS PILL
  // ===============================
  const StatusPill = ({row}: {row: StockRow}) => {
    const expired = new Date(row.expiry_date) < new Date();
    const low = row.quantity <= row.reorder_level;

    let bg = colors.primary;
    let text = 'Active';

    if (expired) {
      bg = colors.gray;
      text = 'Expired';
    } else if (low) {
      bg = colors.danger;
      text = 'Low Stock';
    }

    return (
      <View style={[styles.pill, {backgroundColor: bg}]}>
        <Text size={12} color={colors.white} semibold>
          {text}
        </Text>
      </View>
    );
  };

  // ===============================
  // ROW
  // ===============================
  const renderRow = ({item, index}: any) => {
    const isDeleted = !!item.deleted_at;

    return (
      <View
        style={[
          styles.row,
          {borderColor: colors.gray, opacity: isDeleted ? 0.5 : 1},
        ]}>
        <Text style={{width: 25}}>{index + 1}</Text>

        <View style={{flex: 1}}>
          <Text semibold>{item.medicine?.medicine_name}</Text>
          <Text size={12}>Batch: {item.batch_number}</Text>
          <Text size={12}>
            Exp: {new Date(item.expiry_date).toLocaleDateString()}
          </Text>
        </View>

        <View style={{width: 100}}>
          <StatusPill row={item} />
        </View>

        <View style={{width: 90, flexDirection: 'row', justifyContent: 'flex-end'}}>
          {!isDeleted ? (
            <>
              <TouchableOpacity
                style={{marginRight: 12}}
                onPress={() => openEdit(item)}>
                <MaterialIcons name="edit" size={20} color={colors.primary} />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => softDelete(item)}>
                <MaterialIcons name="delete" size={20} color={colors.danger} />
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                style={{marginRight: 12}}
                onPress={() => restore(item)}>
                <MaterialIcons name="restore" size={20} color={colors.primary} />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => permanentDelete(item)}>
                <MaterialIcons
                  name="delete-forever"
                  size={22}
                  color={colors.danger}
                />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
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

      <View
        style={[styles.headerFixed, {backgroundColor: colors.background}]}
        onLayout={e => setHeaderHeight(e.nativeEvent.layout.height)}>
        <Block padding={sizes.m} >
          <Block row justify="space-between" align="center">
            <Text h5 semibold>
              Pharmacy Stock 
            </Text>
          </Block>
          <Block row marginTop={sizes.m} align="center">
            <Block flex={1} marginRight={10}>
            <Button primary onPress={openAdd}
            style={{ borderRadius: 35, paddingHorizontal: 10 }}>
            <Text semibold color={colors.white}>
              + Add 
            </Text>
            </Button>
            </Block>
             
            <Button  
            onPress={() => setShowLowStock(!showLowStock)}
            >
             <Block
                flex={1}
                radius={6}
                align="center"
                justify="center"
                marginRight={sizes.s}
                width={170}
                height={sizes.socialIconSize}
                gradient={gradients.primary}>
                <Image
                  radius={0}
                  color={colors.white}
                  source={assets.warning}
                />
                <Text size={12} color={colors.white}>
                  {showLowStock ? 'low Stock' : 'ALL  Stock'}
                </Text>
            </Block>
            
          </Button>
          
            
          </Block>

          <Block row marginTop={sizes.m} align="center">
            <Block flex={1} marginRight={10}>
              <Input
                placeholder="Search medicine or batch..."
                value={query}
                onChangeText={setQuery}
              />
            </Block>

            <Block row align="center">
              <Text size={12} marginRight={8}>
                Show Deleted
              </Text>
              <Switch checked={showDeleted} onPress={setShowDeleted} />
            </Block>
          </Block>

          <View style={[styles.tableHeader, {borderColor: colors.gray}]}>
            <Text style={{width: 40}}>SL</Text>
            <Text style={{flex: 1}}>Medicine</Text>
            <Text style={{width: 100}}>Status</Text>
            <Text style={{width: 90, textAlign: 'right'}}>Actions</Text>
          </View>
        </Block>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={renderRow}
        contentContainerStyle={{
          paddingTop: headerHeight + 10,
          paddingHorizontal: sizes.m,
          paddingBottom: 120,
        }}
      />

     
      <RNModal visible={modalOpen} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'android' ? 'padding' : 'height'}>
            <SafeAreaView>
              <View style={styles.modalCard}>
                <ScrollView>
                  <Text h5 semibold>
                    {editingId ? 'Edit Stock' : 'Add Medicine'}
                  </Text>

                  <Input
                    placeholder="Medicine Name"
                    value={form.medicine_name}
                    onChangeText={v => setForm({...form, medicine_name: v})}
                    marginTop={sizes.m}
                  />

                  <Input
                    placeholder="Batch Number"
                    value={form.batch_number}
                    onChangeText={v => setForm({...form, batch_number: v})}
                  />

                  <Input
                    placeholder="Expiry Date (YYYY-MM-DD)"
                    value={form.expiry_date}
                    onChangeText={v => setForm({...form, expiry_date: v})}
                  />

                  <Input
                    placeholder="MRP"
                    keyboardType="numeric"
                    value={form.mrp}
                    onChangeText={v => setForm({...form, mrp: v})}
                  />
                  {form.quantity && form.purchase_price && (
                    <Text marginTop={10}>
                      Total Value: ₹{' '}
                      {(Number(form.quantity) * Number(form.purchase_price)).toFixed(2)}
                    </Text>
                  )}
                  <Input
                        placeholder="Opening Quantity *"
                        keyboardType="numeric"
                        value={form.quantity}
                        onChangeText={v => setForm({...form, quantity: v})}
                      />
                  <Input
                        placeholder="Reorder Level *"
                        keyboardType="numeric"
                        value={form.reorder_level}
                        onChangeText={v => setForm({...form, reorder_level: v})}
                   />
                  <Block row justify="space-between" marginTop={sizes.l}>
                    <Button gray onPress={() => setModalOpen(false)} style={{flex:1,marginRight:10}}>
                      <Text>Cancel</Text>
                    </Button>

                    <Button primary onPress={onSave} style={{flex:1}}>
                      <Text color={colors.white}>
                        {editingId ? 'Update' : 'Save'}
                      </Text>
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