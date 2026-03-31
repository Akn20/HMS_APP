import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { Block, Text } from '../../components';
import { PieChart } from 'react-native-chart-kit';
import { getDashboard } from '../../api/pharmacydashboard';
import { useTheme } from '../../hooks';

const screenWidth = Dimensions.get('window').width;

export default function PharmacyDashboard() {
      const {sizes} = useTheme();
  const [data, setData] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  // ===============================
  // LOAD DATA
  // ===============================
  const loadDashboard = async () => {
    try {
      const res = await getDashboard();
      setData(res.data.data); // ✅ correct mapping
    } catch (error) {
      console.log('Dashboard Error:', error);
    }
  };

  useEffect(() => {
    loadDashboard();

    // 🔄 AUTO REFRESH EVERY 10 SEC
    const interval = setInterval(() => {
      loadDashboard();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // ===============================
  // PULL TO REFRESH
  // ===============================
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadDashboard();
    setRefreshing(false);
  }, []);

  // ===============================
  // LOADING
  // ===============================
  if (!data) {
    return (
      <View style={styles.center}>
        <Text>Loading Dashboard...</Text>
      </View>
    );
  }

  // ===============================
  // CHART DATA
  // ===============================
  const chartData = [
    {
      name: 'Available',
      population: data?.stock_distribution?.available ?? 0,
      color: '#28a745',
      legendFontColor: '#000',
      legendFontSize: 12,
    },
    {
      name: 'Low Stock',
      population: data?.stock_distribution?.low_stock ?? 0,
      color: '#ffc107',
      legendFontColor: '#000',
      legendFontSize: 12,
    },
    {
      name: 'Out of Stock',
      population: data?.stock_distribution?.out_of_stock ?? 0,
      color: '#dc3545',
      legendFontColor: '#000',
      legendFontSize: 12,
    },
  ];

  // ===============================
  // CARD
  // ===============================
  const Card = ({ title, value, color }: any) => (
    <View style={[styles.card, { borderLeftColor: color }]}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardValue}>{value}</Text>
    </View>
  );

  // ===============================
  // UI
  // ===============================
  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
        
      <Block padding={sizes.s} marginBottom={sizes.m}>
                  <Text h5 semibold>
                    Pharmacy Dashboard
                  </Text>
                </Block>

      {/* ROW 1 */}
      <View style={styles.row}>
        <Card
          title="Pending Prescriptions"
          value={data.pending_prescriptions ?? 0}
          color="#28a745"
        />
        <Card
          title="Today's Sales"
          value={`₹ ${data.today_sales ?? 0}`}
          color="#6c757d"
        />
      </View>

      {/* ROW 2 */}
      <View style={styles.row}>
        <Card
          title="Low Stock"
          value={data.low_stock ?? 0}
          color="#ffc107"
        />
        <Card
          title="Expiry Alerts"
          value={data.expiry_alerts ?? 0}
          color="#dc3545"
        />
      </View>

      {/* ROW 3 */}
      <View style={styles.row}>
        <Card
          title="Controlled Drugs"
          value={data.controlled_drugs ?? 0}
          color="#007bff"
        />
        <Card
          title="Return Requests"
          value={data.return_requests ?? 0}
          color="#28a745"
        />
      </View>

      {/* CHART */}
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Stock Distribution</Text>

        <PieChart
          data={chartData}
          width={screenWidth - 40}
          height={220}
          chartConfig={{
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            color: () => '#000',
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="10"
          absolute
        />
      </View>
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    borderLeftWidth: 6,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 13,
    color: '#6c757d',
  },
  cardValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 5,
  },
  chartCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    elevation: 3,
    marginTop: 10,
  },
  chartTitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});