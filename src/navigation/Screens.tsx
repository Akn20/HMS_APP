import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {Articles, Components, Home, Profile, Register, Pro, } from '../screens';
import {useScreenOptions, useTranslation} from '../hooks';
import StockList from '../screens/PharmacyStock/PharmacyStockList';
import LowStocks from '../screens/PharmacyStock/LowStocks';
import ExpiryList from '../screens/PharmacyExpiry/ExpiryList';
import ExpiryDetail from '../screens/PharmacyExpiry/ExpiryDetail';
import StockDetails from '../screens/PharmacyStock/StockDetails';
import TokenQueueList from '../screens/ReceptionistToken/TokenQueueList';
import TokenDetails from '../screens/ReceptionistToken/TokenDetails';
import TokenReassign from '../screens/ReceptionistToken/TokenReassign';
import NursingNotesList from '../screens/NursingNotes/NursingNotesList';
import NursingNoteForm from '../screens/NursingNotes/NursingNoteForm';
import NursingNoteDetails from '../screens/NursingNotes/NursingNoteDetails';
import PharmacyDashboard from '../screens/PharmacyDashboard/PharmacyDashboard';
import EmergencyRegistration from '../screens/EmergencyRegistration/EmergencyRegistration';
const Stack = createStackNavigator();

export default () => {
  const {t} = useTranslation();
  const screenOptions = useScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions.stack}>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{title: t('navigation.home')}}
      />
        <Stack.Screen
        name="PharmacyDashboard"
        component={PharmacyDashboard}
        options={{ title: 'Pharmacy Dashboard' }}
      />
      <Stack.Screen
        name="StockList"
        component={StockList}
        options={{ title: 'Stock Management' }}
      />
  <Stack.Screen
    name="LowStocks"
    component={LowStocks}
  />
      <Stack.Screen
        name="StockDetails"
        component={StockDetails}
        options={{ title: 'Stock Details' }}
      />
      <Stack.Screen
        name="ExpiryList"
        component={ExpiryList}
        options={{ title: 'Expiry Management' }}
      />
          <Stack.Screen
      name="ExpiryDetail"
      component={ExpiryDetail}
    />

      <Stack.Screen
        name='TokenQueueList'
        component={TokenQueueList}
        options={{title: 'Token Management'}}
        />

      <Stack.Screen
        name='TokenDetails'
        component={TokenDetails}
        options={{title:'Token Details'}}
        />

        <Stack.Screen
          name="EmergencyRegistration"
          component={EmergencyRegistration}
          options={{ title: 'Emergency Registration' }}
        />
        <Stack.Screen
          name="TokenReassign"
          component={TokenReassign}
        />
        <Stack.Screen
          name="NursingNotesList"
          component={NursingNotesList}
          options={{ title: 'Nurse Management' }}
        />
        <Stack.Screen
          name="NursingNoteForm"
          component={NursingNoteForm}
        />
        <Stack.Screen
          name="NursingNoteDetails"
          component={NursingNoteDetails}
        />

      <Stack.Screen
        name="Components"
        component={Components}
        options={screenOptions.components}
      />

      <Stack.Screen
        name="Articles"
        component={Articles}
        options={{title: t('navigation.articles')}}
      />

      <Stack.Screen name="Pro" component={Pro} options={screenOptions.pro} />

      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{headerShown: false}}
      />
      
      <Stack.Screen
        name="Register"
        component={Register}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};
