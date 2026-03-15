import React, {useEffect, useState} from 'react';
import {ScrollView} from 'react-native';
import {Block, Text} from '../../components';
import {useTheme} from '../../hooks';
import {getStockById} from '../../api/stocks';

export default function StockDetails({route}: any) {

  const {colors, sizes} = useTheme();
  const {id} = route.params;

  const [data, setData] = useState<any>(null);

  useEffect(() => {
    getStockById(id).then(res => {
      setData(res.data.data);
    });
  }, []);

  if (!data) return null;

  const expired = new Date(data.expiry_date) < new Date();
  const low = data.quantity <= data.reorder_level;

  let status = "Active";

  if (expired) status = "Expired";
  else if (low) status = "Low Stock";

  return (
    <ScrollView style={{backgroundColor: colors.background}}>

      <Block padding={sizes.m}>

        {/* MEDICINE DETAILS */}
        <Block
          style={{
            backgroundColor: "#fff",
            borderRadius: 12,
            padding: 16,
          }}
        >

          <Text h5 semibold>
            Medicine Information
          </Text>

          <Block marginTop={15}>

            <Text>Medicine Name</Text>
            <Text semibold>{data.medicine_name}</Text>

            <Block marginTop={10}>
              <Text>Generic Name</Text>
              <Text semibold>{data.generic_name}</Text>
            </Block>

            <Block marginTop={10}>
              <Text>Category</Text>
              <Text semibold>{data.category}</Text>
            </Block>

            <Block marginTop={10}>
              <Text>Manufacturer</Text>
              <Text semibold>{data.manufacturer}</Text>
            </Block>

          </Block>

        </Block>

        {/* BATCH DETAILS */}
        <Block
          marginTop={sizes.m}
          style={{
            backgroundColor: "#fff",
            borderRadius: 12,
            padding: 16,
          }}
        >
          

          <Text h5 semibold>
            Batch Information
          </Text>

          <Block marginTop={15}>

            <Text>Batch Number</Text>
            <Text semibold>{data.batch_number}</Text>

            <Block marginTop={10}>
              <Text>Expiry Date</Text>
              <Text semibold>{data.expiry_date}</Text>
            </Block>

            <Block marginTop={10}>
              <Text>Quantity</Text>
              <Text semibold>{data.quantity}</Text>
            </Block>

            <Block marginTop={10}>
              <Text>Reorder Level</Text>
              <Text semibold>{data.reorder_level}</Text>
            </Block>

            <Block marginTop={10}>
              <Text>Status</Text>
              <Text semibold>{status}</Text>
            </Block>

          </Block>

        </Block>

        {/* PRICING */}
        <Block
          marginTop={sizes.m}
          style={{
            backgroundColor: "#fff",
            borderRadius: 12,
            padding: 16,
          }}
        >

          <Text h5 semibold>
            Pricing Information
          </Text>

          <Block marginTop={15}>

            <Text>Purchase Price</Text>
            <Text semibold>₹ {data.purchase_price}</Text>

            <Block marginTop={10}>
              <Text>MRP</Text>
              <Text semibold>₹ {data.mrp}</Text>
            </Block>

            <Block marginTop={10}>
              <Text>Total Stock Value</Text>
              <Text semibold>
                ₹ {(data.quantity * data.purchase_price).toFixed(2)}
              </Text>
            </Block>

          </Block>

        </Block>

      </Block>

    </ScrollView>
  );
}