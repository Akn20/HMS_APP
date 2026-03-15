import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Block, Text } from "../../components";
import { useTheme } from "../../hooks";
import { getTokenById } from "../../api/tokens";

export default function TokenDetails({ route }: any) {

  const { colors, sizes } = useTheme();
  const { id } = route.params;

  const [token, setToken] = useState<any>(null);

const loadData = async () => {
  try {
    const res = await getTokenById(id);
    console.log("TOKEN DETAILS:", res.data);
    setToken(res.data.data);
  } 
    catch (error: any) {
  console.log("TOKEN ERROR:", error?.response?.data || error.message);

    
  }
};

  useEffect(() => {
    loadData();
  }, []);

  if (!token) {
    return (
      <Block safe center>
        <Text>Loading...</Text>
      </Block>
    );
  }

  const statusColor =
    token.status === "WAITING"
      ? colors.warning
      : token.status === "SKIPPED"
      ? colors.danger
      : colors.success;

  return (
    <Block safe style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ padding: sizes.m }}>

        {/* TOKEN INFORMATION */}
        <Block style={styles.card}>

          <Text h5 semibold marginBottom={sizes.s}>
            Token Information
          </Text>

          <Block row justify="space-between" marginBottom={10}>
            <Text>Token Number</Text>
            <Text semibold>{token.token_number}</Text>
          </Block>

          <Block row justify="space-between" marginBottom={10}>
            <Text>Status</Text>
            <Text color={statusColor} semibold>
              {token.status}
            </Text>
          </Block>

        </Block>

        {/* APPOINTMENT DETAILS */}
        <Block style={styles.card} marginTop={sizes.m}>

          <Text h5 semibold marginBottom={sizes.s}>
            Appointment Details
          </Text>

          <Block row justify="space-between" marginBottom={10}>
            <Text>Patient</Text>
            <Text>{token.patient?.name}</Text>
          </Block>

          <Block row justify="space-between" marginBottom={10}>
            <Text>Doctor</Text>
            <Text>{token.doctor?.name}</Text>
          </Block>

          <Block row justify="space-between" marginBottom={10}>
            <Text>Department</Text>
            <Text>{token.department?.name}</Text>
          </Block>

          <Block row justify="space-between">
            <Text>Appointment Time</Text>
            <Text>{token.appointment?.time}</Text>
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