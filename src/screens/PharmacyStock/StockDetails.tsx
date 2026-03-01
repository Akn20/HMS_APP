import React, {useEffect, useState} from 'react';
import {ScrollView} from 'react-native';
import {Block, Text} from '../../components';
import {getStockById} from '../../api/stocks';

export default function StockDetails({route}: any) {
  const {id} = route.params;
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    getStockById(id).then(res => setData(res.data.data));
  }, []);

  if (!data) return null;

  const expired = new Date(data.expiry_date) < new Date();
  const low = data.quantity <= data.reorder_level;

  return (
    <ScrollView style={{padding: 20}}>
      <Text h5 semibold>Batch Information</Text>

      <Block marginTop={15}>
        <Text>Medicine: {data.medicine?.medicine_name}</Text>
        <Text>Batch: {data.batch_number}</Text>
        <Text>Expiry: {data.expiry_date}</Text>
        <Text>Quantity: {data.quantity}</Text>
        <Text>Reorder Level: {data.reorder_level}</Text>
        <Text>
          Status:{' '}
          {expired ? 'Expired' : low ? 'Low Stock' : 'Active'}
        </Text>
      </Block>

      <Block marginTop={30}>
        <Text h5 semibold>Pricing</Text>
        <Text>Purchase Price: ₹ {data.purchase_price}</Text>
        <Text>MRP: ₹ {data.mrp}</Text>
        <Text>
          Total Stock Value: ₹{' '}
          {(data.quantity * data.purchase_price).toFixed(2)}
        </Text>
      </Block>
    </ScrollView>
  );
}