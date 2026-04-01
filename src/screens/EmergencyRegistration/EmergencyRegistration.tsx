import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Text, Input, Button, Block } from '../../components';
import { Picker } from '@react-native-picker/picker';
import { getPatients } from '../../api/patients';
import { createEmergency } from '../../api/emergency';
import { useTheme } from '../../hooks';


export default function EmergencyRegistration() {
  const [patients, setPatients] = useState<any[]>([]);
  const [selectedPatient, setSelectedPatient] = useState('');
const { sizes } = useTheme();
  const [form, setForm] = useState({
    patient_name: '',
    gender: '',
    age: '',
    mobile: '',
    emergency_type: '',
  });

  // ===============================
  // LOAD PATIENTS
  // ===============================
  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      const res = await getPatients();
      setPatients(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  // ===============================
  // HANDLE SELECT PATIENT (AUTOFILL)
  // ===============================
  const handleSelectPatient = (id: string) => {
    setSelectedPatient(id);

    const patient = patients.find(p => p.id == id);

    if (patient) {
      setForm({
        ...form,
        patient_name: `${patient.first_name} ${patient.last_name}`,
        mobile: patient.mobile || '',
        gender: patient.gender || '',
        age: patient.age || '',
      });
    }
  };

  // ===============================
  // SUBMIT
  // ===============================
  const handleSubmit = async () => {
    if (!form.emergency_type) {
      Alert.alert('Validation', 'Emergency type is required');
      return;
    }

    try {
      await createEmergency({
        patient_id: selectedPatient,
        ...form,
      });

      Alert.alert('Success', 'Emergency registered successfully');

      // reset form
      setForm({
        patient_name: '',
        gender: '',
        age: '',
        mobile: '',
        emergency_type: '',
      });
      setSelectedPatient('');

    } catch (error: any) {
      Alert.alert('Error', error?.response?.data?.message || 'Failed');
    }
  };

  // ===============================
  // UI
  // ===============================
  return (
    <ScrollView style={styles.container}>
     <Block padding={sizes.s} marginBottom={sizes.m}>
                       <Text h5 semibold>
                         Emergency Registration
                       </Text>
                     </Block>

      {/* SELECT PATIENT */}
      <Text>Select Existing Patient</Text>
      <View style={styles.picker}>
        <Picker
          selectedValue={selectedPatient}
          onValueChange={handleSelectPatient}>
          <Picker.Item label="Select Registered Patient" value="" />
          {patients.map((p) => (
            <Picker.Item
              key={p.id}
              label={`${p.first_name} ${p.last_name} (${p.mobile})`}
              value={p.id}
            />
          ))}
        </Picker>
      </View>

      {/* NAME */}
      <Input
      marginBottom={sizes.s}
        placeholder="Patient Name"
        value={form.patient_name}
        onChangeText={(v) => setForm({ ...form, patient_name: v })}
      />
      
      {/* GENDER */}
      
      <View style={styles.picker}>
        <Picker
          selectedValue={form.gender}
          onValueChange={(v) => setForm({ ...form, gender: v })}>
          <Picker.Item label="Select Gender" value="" />
          <Picker.Item label="Male" value="Male" />
          <Picker.Item label="Female" value="Female" />
          <Picker.Item label="Other" value="Other" />
        </Picker>
      </View>

      {/* AGE */}
      <Input
      marginBottom={sizes.s}
        placeholder="Age"
        keyboardType="numeric"
        value={form.age}
        onChangeText={(v) => setForm({ ...form, age: v })}
      />

      {/* MOBILE */}
      <Input
      marginBottom={sizes.s}
        placeholder="Mobile Number"
        value={form.mobile}
        onChangeText={(v) => setForm({ ...form, mobile: v })}
      />

      {/* EMERGENCY TYPE */}
      {/* <Text>Emergency Type</Text> */}
      <View style={styles.picker}>
        <Picker
          selectedValue={form.emergency_type}
          onValueChange={(v) => setForm({ ...form, emergency_type: v })}>
          <Picker.Item label="Select Emergency Type" value="" />
          <Picker.Item label="Accident" value="Accident" />
          <Picker.Item label="Cardiac" value="Cardiac" />
          <Picker.Item label="Trauma" value="Trauma" />
          <Picker.Item label="Suicide" value="Suicide" />
          <Picker.Item label="Other" value="Other" />
        </Picker>
      </View>

      {/* BUTTONS */}
      <Block row marginTop={20}>
        <Button primary onPress={handleSubmit} style={{ flex: 1 }}>
          <Text color="#fff">REGISTER EMERGENCY</Text>
        </Button>
      </Block>
    </ScrollView>
  );
}

// ===============================
// STYLES
// ===============================
const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: '#f4f6f9',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  picker: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 15,
  },
});