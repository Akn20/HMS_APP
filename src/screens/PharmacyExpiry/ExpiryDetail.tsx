import React from 'react';
import {useTheme} from '../../hooks';
import {Block, Text} from '../../components';

export default function ExpiryDetail({route}) {

  const {sizes} = useTheme();
  const {batch} = route.params;

  return (
    <Block safe padding={sizes.m}>

      <Text h4 semibold>
        Expiry Details
      </Text>

      <Block marginTop={sizes.m}>

        <Text >Medicine</Text>
        <Text semibold>{batch.medicine}</Text>

      
          <Text marginTop={10}>Batch Number</Text>
          <Text semibold>{batch.batch_number}</Text>
        

       
          <Text marginTop={10}>Expiry Date</Text>
          <Text semibold>{batch.expiry_date}</Text>
        

        
          <Text marginTop={10}>Quantity</Text>
          <Text semibold>{batch.quantity}</Text>
      
          <Text marginTop={10}>Status</Text>
          <Text semibold>{batch.status}</Text>
        

      </Block>

    </Block>
  );
}