import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Block, Text } from "../../components";
import { useTheme } from "../../hooks";
import { getNursingNoteById } from "../../api/nursingNotes";

export default function NursingNoteDetails({ route }: any) {

  const { colors, sizes } = useTheme();
  const { id } = route.params;

  const [note, setNote] = useState<any>(null);

  const loadData = async () => {

    try {

      const res = await getNursingNoteById(id);

      console.log("NOTE DETAILS:", res.data);

      setNote(res.data.data);

    } catch (error:any) {

      console.log("NOTE ERROR:", error?.response?.data || error.message);

    }

  };

  useEffect(() => {
    loadData();
  }, []);

  if (!note) {
    return (
      <Block safe center>
        <Text>Loading...</Text>
      </Block>
    );
  }

  return (
    <Block safe style={{ flex: 1, backgroundColor: colors.background }}>

      <ScrollView contentContainerStyle={{ padding: sizes.m }}>

        {/* PATIENT INFORMATION */}
        <Block style={styles.card}>

          <Text h5 semibold marginBottom={sizes.s}>
            Patient Information
          </Text>

          <Block row justify="space-between" marginBottom={10}>
            <Text>Patient</Text>
            <Text semibold>
              {note.patient_name}
            </Text>
          </Block>

          <Block row justify="space-between">
            <Text>Nurse</Text>
            <Text>
              {note.nurse_name}
            </Text>
          </Block>

        </Block>


        {/* SHIFT INFORMATION */}
        <Block style={styles.card} marginTop={sizes.m}>

          <Text h5 semibold marginBottom={sizes.s}>
            Shift Details
          </Text>

          <Block row justify="space-between">
            <Text>Shift</Text>
            <Text semibold>
              {note.shift}
            </Text>
          </Block>

        </Block>


        {/* PATIENT CONDITION */}
        <Block style={styles.card} marginTop={sizes.m}>

          <Text h5 semibold marginBottom={sizes.s}>
            Patient Condition
          </Text>

          <Text>
            {note.patient_condition || "-"}
          </Text>

        </Block>


        {/* INTAKE DETAILS */}
        <Block style={styles.card} marginTop={sizes.m}>

          <Text h5 semibold marginBottom={sizes.s}>
            Intake Details
          </Text>

          <Text>
            {note.intake_details || "-"}
          </Text>

        </Block>


        {/* OUTPUT DETAILS */}
        <Block style={styles.card} marginTop={sizes.m}>

          <Text h5 semibold marginBottom={sizes.s}>
            Output Details
          </Text>

          <Text>
            {note.output_details || "-"}
          </Text>

        </Block>


        {/* WOUND CARE */}
        <Block style={styles.card} marginTop={sizes.m}>

          <Text h5 semibold marginBottom={sizes.s}>
            Wound Care Notes
          </Text>

          <Text>
            {note.wound_care_notes || "-"}
          </Text>

        </Block>


        {/* DATE INFO */}
        <Block style={styles.card} marginTop={sizes.m}>

          <Text h5 semibold marginBottom={sizes.s}>
            Record Info
          </Text>

          <Block row justify="space-between">
            <Text>Created At</Text>
            <Text>
              {note.created_at}
            </Text>
          </Block>

        </Block>

      </ScrollView>

    </Block>
  );
}

const styles = StyleSheet.create({

  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    elevation: 2,
  },

});