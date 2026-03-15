import React, {useEffect, useState} from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
} from 'react-native';

import {Block, Button, Input, Text} from '../../components';
import {useTheme} from '../../hooks';

import {
  getNursingNoteForm,
  createNursingNote,
  updateNursingNote,
} from '../../api/nursingNotes';

import {Picker} from '@react-native-picker/picker';

export default function NursingNoteForm({route, navigation}: any) {
  const {colors, sizes} = useTheme();

  const id = route?.params?.id;

  const [patients, setPatients] = useState<any[]>([]);
  const [nurses, setNurses] = useState<any[]>([]);
  const [shifts, setShifts] = useState<string[]>([]);

const [form,setForm] = useState<any>({
  patient_id:'',
  nurse_id:'',
  shift:'',
  patient_condition:'',
  intake_details:'',
  output_details:'',
  wound_care_notes:'',
  status:1,
});

  // ======================
  // LOAD FORM DATA
  // ======================

  const loadForm = async () => {
    try {
      const res = await getNursingNoteForm(id);

      const data = res.data.data;

      setPatients(data.patients);
      setNurses(data.nurses);
      setShifts(data.shifts);

      if (data.note) {
        setForm(data.note);
      }

    } catch {
      Alert.alert('Error', 'Failed to load form');
    }
  };

  useEffect(() => {
    loadForm();
  }, []);

  // ======================
  // SAVE
  // ======================

  const onSave = async () => {
    try {

      if (!id) {
        await createNursingNote(form);
      } else {
        await updateNursingNote(id, form);
      }

      Alert.alert('Success','Saved successfully');

      navigation.goBack();

    } catch {
      Alert.alert('Error','Save failed');
    }
  };

  return (

    <Block safe padding={sizes.m}>

      <ScrollView>

        <Text h5 semibold>
          {id ? 'Edit Nursing Note' : 'Add Nursing Note'}
        </Text>

        {/* PATIENT */}

        <Text marginTop={sizes.m}>Patient</Text>

        <Picker
          selectedValue={form.patient_id}
          onValueChange={(v) => setForm({...form, patient_id: v})}
        >
          <Picker.Item label="Select Patient" value="" />

          {patients.map((p) => (
            <Picker.Item
              key={p.id}
              label={`${p.first_name} ${p.last_name}`}
              value={p.id}
            />
          ))}

        </Picker>

        {/* NURSE */}

        <Text marginTop={sizes.m}>Nurse</Text>

        <Picker
          selectedValue={form.nurse_id}
          onValueChange={(v) => setForm({...form, nurse_id: v})}
        >
          <Picker.Item label="Select Nurse" value="" />

          {nurses.map((n) => (
            <Picker.Item
              key={n.id}
              label={n.name}
              value={n.id}
            />
          ))}

        </Picker>

        {/* SHIFT */}

        <Text marginTop={sizes.m}>Shift</Text>

        <Picker
          selectedValue={form.shift}
          onValueChange={(v) => setForm({...form, shift: v})}
        >
          <Picker.Item label="Select Shift" value="" />

          {shifts.map((s) => (
            <Picker.Item key={s} label={s} value={s} />
          ))}

        </Picker>

        {/* PATIENT CONDITION */}

        <Input
          placeholder="Patient Condition"
          value={form.patient_condition}
          onChangeText={(v) =>
            setForm({...form, patient_condition: v})
          }
          marginTop={sizes.m}
        />

        {/* INTAKE */}

        <Input
          placeholder="Intake Details"
          value={form.intake_details}
          onChangeText={(v) =>
            setForm({...form, intake_details: v})
          }
          marginTop={sizes.m}
        />

        {/* OUTPUT */}

        <Input
          placeholder="Output Details"
          value={form.output_details}
          onChangeText={(v) =>
            setForm({...form, output_details: v})
          }
          marginTop={sizes.m}
        />

        {/* WOUND CARE */}

        <Input
          placeholder="Wound Care Notes"
          value={form.wound_care_notes}
          onChangeText={(v) =>
            setForm({...form, wound_care_notes: v})
          }
          marginTop={sizes.m}
        />

        {/* SAVE */}

        <Button
          primary
          marginTop={sizes.l}
          onPress={onSave}
        >
          <Text color={colors.white}>
            {id ? 'Update' : 'Save'}
          </Text>
        </Button>

      </ScrollView>

    </Block>
  );
}

const styles = StyleSheet.create({});