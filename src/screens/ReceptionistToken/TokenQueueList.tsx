import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Modal as RNModal,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "../../hooks";
import { Block, Button, Input, Text } from "../../components";
import { useNavigation } from "@react-navigation/native";

import {
  getTokens,
  createToken,
  skipToken,
  completeToken,
  reassignToken,
  getAppointments,
} from "../../api/tokens";

type TokenRow = {
  token_id: string;
  token_number: number;
  patient_name: string;
  doctor_name: string;
  department: string;
  appointment_time: string;
  status: string;
};

export default function TokenQueueList() {
  const { colors, sizes } = useTheme();
  const navigation = useNavigation<any>();

  const [rows, setRows] = useState<TokenRow[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(240);
  const [query, setQuery] = useState("");

  /* ===============================
     FETCH TOKENS
  =============================== */

const refresh = useCallback(async () => {
  try {
    const res = await getTokens();
    console.log("API RESPONSE:", res.data);
    setRows(res.data.data);
  } catch {
    Alert.alert("Error", "Failed to load tokens");
  }
}, []);

  useEffect(() => {
    refresh();
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      const res = await getAppointments();
      setAppointments(res.data.data);
    } catch {
      console.log("Failed to load appointments");
    }
  };

  /* ===============================
     AUTO REFRESH QUEUE
  =============================== */

useEffect(() => {

  refresh();
  loadAppointments();

  const interval = setInterval(() => {
    loadAppointments();
    refresh();
  }, 5000); // refresh every 5 seconds

  return () => clearInterval(interval);

}, []);

  /* ===============================
     SEARCH FILTER
  =============================== */

  const filtered = useMemo(() => {
    const q = query.toLowerCase();

    return rows.filter((r) =>
      r.patient_name?.toLowerCase().includes(q) 
    );
  }, [rows, query]);

  /* ===============================
     GENERATE TOKEN
  =============================== */

  const generateToken = async () => {
    if (!selectedAppointment) {
      Alert.alert("Select Appointment");
      return;
    }

    try {
      await createToken({
        appointment_id: selectedAppointment.id,
        
      });
      Alert.alert("Token generated");
      setModalOpen(false);
      setSelectedAppointment(null);
      refresh();
    } catch {
      Alert.alert("Token generation failed");
    }
  };

  /* ===============================
     ACTIONS
  =============================== */

const onSkip = async (row: any) => {
  try {
    await skipToken(row.token_id);
    refresh();
  } catch {
    Alert.alert("Failed to skip token");
  }
};

  const onComplete = async (row: TokenRow) => {
    await completeToken(row.token_id);
    refresh();
  };

  const onReassign = async (row: TokenRow) => {
    const doctorId = "new-doctor-id";
    await reassignToken(row.token_id, doctorId);
    refresh();
  };

  

  /* ===============================
     STATUS PILL
  =============================== */

  const StatusPill = ({ status }: any) => {
    let bg = colors.primary;

    if (status === "SKIPPED") bg = colors.gray;
    if (status === "COMPLETED") bg = colors.success;
    if (status === "WAITING") bg = colors.warning;

    return (
      <View style={[styles.pill, { backgroundColor: bg }]}>
        <Text size={12} color={colors.white} semibold>
          {status}
        </Text>
      </View>
    );
  };

  /* ===============================
     ROW
  =============================== */

  const renderRow = ({ item, index }: any) => (
        <TouchableOpacity
        style={styles.row}
        onPress={() => navigation.navigate("TokenDetails", { id: item.token_id })}
      >

        {/* SL NO */}
        <Text style={{ width: 40 }}>
          {index + 1}
        </Text>

        {/* PATIENT DETAILS */}
        <View style={{ flex: 1 }}>
          <Text semibold>
            {item.patient_name}
          </Text>

          <Text size={12}>
            Token #{item.token_number}
          </Text>

          <Text size={12}>
            {item.department}
          </Text>
        </View>

        {/* STATUS */}
        <View style={{ width: 100 }}>
          <StatusPill status={item.status} />
        </View>

        {/* ACTIONS */}
        <View
          style={{
            width: 90,
            flexDirection: "row",
            justifyContent: "flex-end",
          }}
        >

          {/* SKIP */}
          <TouchableOpacity
            style={{ marginRight: 12 }}
            onPress={(e) => {
              e.stopPropagation();
              onSkip(item);
            }}
          >
            <MaterialIcons
              name="skip-next"
              size={20}
              color={colors.warning}
            />
          </TouchableOpacity>

          {/* REASSIGN */}
          <TouchableOpacity
            style={{ marginRight: 12 }}
            onPress={() =>
  navigation.navigate("TokenReassign", {
    id: item.token_id
  })
}
          >
            <MaterialIcons
              name="swap-horiz"
              size={20}
              color={colors.primary}
            />
          </TouchableOpacity>

          {/* COMPLETE */}
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              onComplete(item);
            }}
          >
            <MaterialIcons
              name="check-circle"
              size={20}
              color={colors.success}
            />
          </TouchableOpacity>

        </View>

      </TouchableOpacity>
  );

  /* ===============================
     UI
  =============================== */

  return (
    <Block safe style={{ flex: 1, backgroundColor: colors.background }}>
      {/* HEADER */}
      <View
        style={[styles.headerFixed, { backgroundColor: colors.background }]}
        onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}
      >
        <Block padding={sizes.m}>
          <Block row justify="space-between" align="center">
            <Text h5 semibold>
              Token & Queue
            </Text>
          </Block>

          <Block row marginTop={sizes.m}>
            <Block flex={1} marginRight={10}>
              <Button
                primary
                onPress={() => {
                  setModalOpen(true);
                  setSelectedAppointment(null);
                }}
              >
                <Text semibold color={colors.white}>
                  + Generate Token
                </Text>
              </Button>
            </Block>
          </Block>

          <Block row marginTop={sizes.m}>
            <Block flex={1}>
              <Input
                placeholder="Search patient..."
                value={query}
                onChangeText={setQuery}
              />
            </Block>
          </Block>

          <View style={[styles.tableHeader, { borderColor: colors.gray }]}>
            <Text style={{ width: 40 }}>SL</Text>
            <Text style={{ flex: 1 }}>Patient</Text>
            <Text style={{ width: 100 }}>Status</Text>
            <Text style={{ width: 90, textAlign: "right" }}>Actions</Text>
          </View>
        </Block>
      </View>

      {/* LIST */}

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
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
            behavior={Platform.OS === "android" ? "padding" : "height"}
          >
            <SafeAreaView>
              <View style={styles.modalCard}>
                <ScrollView>
                  <Text h5 semibold>
                    Generate Token
                  </Text>

                  {!selectedAppointment && (
                    <>
                      <Text marginTop={20}>Select Appointment</Text>

                      {appointments.map((a: any) => (
                        <TouchableOpacity
                          key={a.id}
                          style={styles.appointmentRow}
                          onPress={() => setSelectedAppointment(a)}
                        >
                          <Text semibold>
                            {a.patient.first_name} {a.patient.last_name}
                          </Text>

                          <Text size={12}>
                            {a.appointment_date} {a.appointment_time}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </>
                  )}

                  {selectedAppointment && (
                    <>
                      <Input
                        label="Patient"
                        value={
                          selectedAppointment.patient.first_name +
                          " " +
                          selectedAppointment.patient.last_name
                        }
                        editable={false}
                      />

                      <Input
                        label="Doctor"
                        value={selectedAppointment.doctor?.name ?? ""}
                        editable={false}
                      />

                      <Input
                        label="Department"
                        value={
                          selectedAppointment.department?.department_name ?? ""
                        }
                        editable={false}
                      />

                      <Input label="Status" value="WAITING" editable={false} />
                    </>
                  )}

                  <Block row justify="space-between" marginTop={sizes.l}>
                    <Button
                      gray
                      onPress={() => setModalOpen(false)}
                      style={{ flex: 1, marginRight: 10 }}
                    >
                      <Text>Cancel</Text>
                    </Button>

                    <Button
                      primary
                      onPress={generateToken}
                      style={{ flex: 1 }}
                      disabled={!selectedAppointment}
                    >
                      <Text color={colors.white}>Generate Token</Text>
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
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 999,
  },

  tableHeader: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 12,
    marginTop: 16,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: "#fff",
  },

  pill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.35)",
  },

  modalCard: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },

  appointmentRow: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
});