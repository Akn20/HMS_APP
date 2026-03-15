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
import {Picker} from '@react-native-picker/picker';

import {useTheme} from '../../hooks';
import {Block, Button, Input, Switch, Text} from '../../components';
import { useNavigation } from '@react-navigation/native';

import {
    getNursingNoteById,
  getNursingNotes,
  getDeletedNursingNotes,
  createNursingNote,
  updateNursingNote,
  deleteNursingNote,
  restoreNursingNote,
  permanentlyDeleteNursingNote,
  getNursingNoteForm
} from '../../api/nursingNotes';

type NoteRow = {
  id: string;
  patient_name: string;
  nurse_name: string;
  shift: string;
  patient_condition: string;
  status: number;
  deleted_at: string | null;
};



export default function NursingNotesList() {
  const {colors, sizes} = useTheme();

  const [rows, setRows] = useState<NoteRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(220);

  const [query, setQuery] = useState('');
  const [showDeleted, setShowDeleted] = useState(false);

  const navigation = useNavigation<any>();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [patients,setPatients] = useState<any[]>([]);
  const [nurses,setNurses] = useState<any[]>([]);
  const [shifts,setShifts] = useState<string[]>([]);

const [form,setForm] = useState<any>({
  patient_id:'',
  nurse_id:'',
  shift:'',
  patient_condition:'',
  intake_details:'',
  output_details:'',
  wound_care_notes:'',
});

  // ===============================
  // FETCH DATA
  // ===============================
const refresh = useCallback(async () => {
  setLoading(true);

  try {
    const res = showDeleted
      ? await getDeletedNursingNotes()
      : await getNursingNotes();

    console.log("FULL RESPONSE:", res);
    console.log("DATA:", res.data);

    setRows(
  res.data.data ||
  res.data?.data ||
  res.data
);

  } catch (error: any) {
    console.log("API ERROR:", error);
    Alert.alert("Error", "Failed to fetch nursing notes");
  } finally {
    setLoading(false);
  }
}, [showDeleted]);

useEffect(() => {
  refresh();
}, []);

useEffect(() => {
  refresh();
}, [showDeleted]);
  // ===============================
  // FILTER
  // ===============================
  const filtered = useMemo(() => {
    return rows.filter(r => {
      if (!showDeleted && r.deleted_at) return false;

      const q = query.toLowerCase().trim();
      if (!q) return true;

      return (
        r.patient_name.toLowerCase().includes(q) ||
        r.nurse_name.toLowerCase().includes(q)
      );
    });
  }, [rows, query, showDeleted]);

const loadData = async () => {

  try {

    const res = await getNursingNoteById(id);

    console.log("NOTE DETAILS:", res.data);

    setNote(res.data.data ?? res.data);

  } catch (error:any) {

    console.log("NOTE ERROR:", error?.response?.data || error.message);

  }

};

  const loadFormData = async () => {
  try {
    const res = await getNursingNoteForm();

    const data = res.data.data;

    setPatients(data.patients);
    setNurses(data.nurses);
    setShifts(data.shifts);

  } catch (error) {
    Alert.alert("Error", "Failed to load form data");
  }
};

  // ===============================
  // OPEN MODAL
  // ===============================
const openAdd = async () => {

  await loadFormData();

  setEditingId(null);

  setForm({
    patient_id:'',
    nurse_id:'',
    shift:'',
    patient_condition:'',
    intake_details:'',
    output_details:'',
    wound_care_notes:'',
  });

  setModalOpen(true);
};

const openEdit = async (row:any) => {

  const res = await getNursingNoteForm(row.id);

  const data = res.data.data;

  setPatients(data.patients);
  setNurses(data.nurses);
  setShifts(data.shifts);

  const note = data.note;

  setEditingId(row.id);

  setForm({
    patient_id: note.patient_id,
    nurse_id: note.nurse_id,
    shift: note.shift,
    patient_condition: note.patient_condition,
    intake_details: note.intake_details,
    output_details: note.output_details,
    wound_care_notes: note.wound_care_notes,
  });

  setModalOpen(true);
};
  // ===============================
  // SAVE
  // ===============================
const onSave = async () => {

  try {

    if (!editingId) {
      await createNursingNote(form);
    } else {
      await updateNursingNote(editingId, form);
    }

    setModalOpen(false);
    refresh();

  } catch (error:any) {

    Alert.alert(
      "Error",
      error?.response?.data?.message || "Save failed"
    );

  }

};

  // ===============================
  // DELETE / RESTORE
  // ===============================
  const softDelete = async (row: NoteRow) => {
    await deleteNursingNote(row.id);
    setRows(prev => prev.filter(r => r.id !== row.id));
  };

  const restore = async (row: NoteRow) => {
    await restoreNursingNote(row.id);
    setRows(prev => prev.filter(r => r.id !== row.id));
  };

  const permanentDelete = async (row: NoteRow) => {
    await permanentlyDeleteNursingNote(row.id);
    setRows(prev => prev.filter(r => r.id !== row.id));
  };

  // ===============================
  // STATUS PILL
  // ===============================
  const StatusPill = ({row}: {row: NoteRow}) => {
    return (
      <View
        style={[
          styles.pill,
          {backgroundColor: row.status ? colors.primary : colors.gray},
        ]}>
        <Text size={12} color={colors.white} semibold>
          {row.status ? 'Active' : 'Inactive'}
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
      <TouchableOpacity
        style={[
          styles.row,
          {borderColor: colors.gray, opacity: isDeleted ? 0.5 : 1},
        ]}
        onPress={() =>
        navigation.navigate('NursingNoteDetails', { id: item.id })
      }
        >
        <Text style={{width: 25}}>{index + 1}</Text>

        <View style={{flex: 1}}>
          <Text semibold>{item.patient?.first_name} {item.patient?.last_name}</Text>


        </View>

        <View style={{width: 100}}>
            <Text semibold>{item.nurse?.name}</Text>

          <Text size={12}>Shift: {item.shift}</Text>
        </View>

        <View
          style={{
            width: 90,
            flexDirection: 'row',
            justifyContent: 'flex-end',
          }}>
          {!isDeleted ? (
            <>
              <TouchableOpacity
                style={{marginRight: 12}}
                onPress={() => openEdit(item)}>
                <MaterialIcons
                  name="edit"
                  size={20}
                  color={colors.primary}
                />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => softDelete(item)}>
                <MaterialIcons
                  name="delete"
                  size={20}
                  color={colors.danger}
                />
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                style={{marginRight: 12}}
                onPress={() => restore(item)}>
                <MaterialIcons
                  name="restore"
                  size={20}
                  color={colors.primary}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => permanentDelete(item)}>
                <MaterialIcons
                  name="delete-forever"
                  size={22}
                  color={colors.danger}
                />
              </TouchableOpacity>
            </>
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

      <View
        style={[styles.headerFixed, {backgroundColor: colors.background}]}
        onLayout={e => setHeaderHeight(e.nativeEvent.layout.height)}>
        <Block padding={sizes.m}>
          <Block row justify="space-between" align="center">
            <Text h5 semibold>
              Nursing Notes
            </Text>

               <Button
              primary
              onPress={openAdd}
              style={{
                borderRadius: 35,
                paddingHorizontal: 50,
              }}>
              <Text semibold color={colors.white}>
                + Add Note
              </Text>
            </Button>
          </Block>

          <Block row marginTop={sizes.m} align="center">
            <Block flex={1} marginRight={10}>
              <Input
                placeholder="Search patient..."
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
            <Text style={{flex: 1}}>Patient</Text>
            <Text style={{width: 100}}>Nurse</Text>
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

      {/* MODAL */}

      <RNModal visible={modalOpen} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'android' ? 'padding' : 'height'}>
            <SafeAreaView>
              <View style={styles.modalCard}>
                <ScrollView>
                  <Text h5 semibold>
                    {editingId ? 'Edit Note' : 'Add Nursing Note'}
                  </Text>

                  <Text marginTop={sizes.m}>Patient</Text>

                    <Picker
                    selectedValue={form.patient_id}
                    onValueChange={(v)=>setForm({...form,patient_id:v})}
                    >
                    <Picker.Item label="Select Patient" value=""/>

                    {patients.map(p=>(
                        <Picker.Item
                        key={p.id}
                        label={`${p.first_name} ${p.last_name}`}
                        value={p.id}
                        />
                    ))}
                    </Picker>


                    <Text marginTop={sizes.m}>Nurse</Text>

                    <Picker
                    selectedValue={form.nurse_id}
                    onValueChange={(v)=>setForm({...form,nurse_id:v})}
                    >
                    <Picker.Item label="Select Nurse" value=""/>

                    {nurses.map(n=>(
                        <Picker.Item
                        key={n.id}
                        label={n.name}
                        value={n.id}
                        />
                    ))}
                    </Picker>


                    <Text marginTop={sizes.m}>Shift</Text>

                    <Picker
                    selectedValue={form.shift}
                    onValueChange={(v)=>setForm({...form,shift:v})}
                    >
                    <Picker.Item label="Select Shift" value=""/>

                    {shifts.map(s=>(
                        <Picker.Item key={s} label={s} value={s}/>
                    ))}
                    </Picker>


                    <Input
                    placeholder="Patient Condition"
                    value={form.patient_condition}
                    onChangeText={(v)=>setForm({...form,patient_condition:v})}
                    />

                    <Input
                    placeholder="Intake Details"
                    value={form.intake_details}
                    onChangeText={(v)=>setForm({...form,intake_details:v})}
                    />

                    <Input
                    placeholder="Output Details"
                    value={form.output_details}
                    onChangeText={(v)=>setForm({...form,output_details:v})}
                    />

                    <Input
                    placeholder="Wound Care Notes"
                    value={form.wound_care_notes}
                    onChangeText={(v)=>setForm({...form,wound_care_notes:v})}
                    />
                  <Block
                    row
                    justify="space-between"
                    marginTop={sizes.l}>
                    <Button
                      gray
                      onPress={() => setModalOpen(false)}
                      style={{flex: 1, marginRight: 10}}>
                      <Text>Cancel</Text>
                    </Button>

                    <Button
                      primary
                      onPress={onSave}
                      style={{flex: 1}}>
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