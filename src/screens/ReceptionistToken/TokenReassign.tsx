import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { Block, Button, Input, Text } from "../../components";
import { useTheme } from "../../hooks";
import {MaterialIcons} from '@expo/vector-icons';
import { getTokenById, reassignToken } from "../../api/tokens";
import { getDoctors } from "../../api/tokens";

export default function TokenReassign({ route, navigation }: any) {

  const { colors, sizes } = useTheme();
  const { id } = route.params;

  const [token, setToken] = useState<any>(null);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);

  /*******************
   LOAD TOKEN
  ********************/
  const loadToken = async () => {
    try {
      const res = await getTokenById(id);
      setToken(res.data.data);
    } catch {
      console.log("Failed to load token");
    }
  };

  /*******************
   LOAD DOCTORS
  ********************/
const loadDoctors = async () => {
  try {
    const res = await getDoctors();
    console.log("DOCTORS:", res.data);
    setDoctors(res.data.data);
  } catch {
    console.log("Failed to load doctors");
  }
};

  useEffect(() => {
    loadToken();
    loadDoctors();
  }, []);

  /*******************
   UPDATE DOCTOR
  ********************/
  const onUpdate = async () => {

    if (!selectedDoctor) {
      alert("Please select doctor");
      return;
    }

    try {
      await reassignToken(id, selectedDoctor.id);
      navigation.goBack();
    } catch {
      alert("Failed to reassign doctor");
    }
  };

  if (!token) {
    return (
      <Block safe center>
        <Text>Loading...</Text>
      </Block>
    );
  }

  return (
    <Block safe style={{ flex: 1, backgroundColor: colors.background }}>

      <ScrollView contentContainerStyle={{ padding: sizes.m }}
      keyboardShouldPersistTaps="handled"
      >

        {/* TITLE */}
        <Text h5 semibold marginBottom={sizes.m}>
          Reassign Token
        </Text>

        {/* TOKEN DETAILS CARD */}
        <Block style={styles.card} padding={sizes.s}marginBottom={sizes.m}>

          <Input
            label="Patient"
            value={token.patient?.name}
            editable={false}
          />

          <Input
            label="Current Doctor"
            value={token.doctor?.name}
            editable={false}
          />

          <Input
            label="Department"
            value={token.department?.name}
            editable={false}
          />

        </Block>

        {/* DOCTOR LIST */}
            <Block style={styles.card}>
                <Text h5 semibold marginBottom={sizes.m}>
            Select Doctor
            </Text>
            {doctors.map((doc: any) => {

                const selected = selectedDoctor?.id === doc.id;

                return (
                <TouchableOpacity
                    key={doc.id}
                    style={[
                    styles.doctorRow,
                    selected && { backgroundColor: colors.light }
                    ]}
                    onPress={() => setSelectedDoctor(doc)}
                >

                    <Block row justify="space-between" align="center">

                    <Text semibold>
                        {doc.name}
                    </Text>

                    {selected && (
                        <MaterialIcons
                        name="check-circle"
                        size={20}
                        color={colors.primary}
                        />
                    )}

                    </Block>
                    

                </TouchableOpacity>
                );
            })}
            <Block row justify="space-between" marginTop={sizes.l}>

                <Button
                    gray
                    style={{ flex: 1, marginRight: 10 }}
                    onPress={() => navigation.goBack()}
                >
                    <Text>Cancel</Text>
                </Button>

                <Button
                    primary
                    style={{ flex: 1 }}
                    onPress={onUpdate}
                >
                    <Text color={colors.white}>Update</Text>
                </Button>

                </Block>

            </Block>
      </ScrollView>

    </Block>
  );
}

const styles = StyleSheet.create({

  card: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 12,
    elevation: 2,
  },

  doctorRow: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },

});