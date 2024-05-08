//@ts-nocheck
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';
import ApiViewModel from './ApiViewModel';
import { notifyMessage } from './Utils';

const apiViewModel = new ApiViewModel();

const ChooseMDView = ({ onNavigate }) => {
  const [valueMd, setValueMd] = useState(null);
  const [valueRegion, setValueRegion] = useState(null);
  const [region, setRegion] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleGoToConsole = () => {
    if (valueMd && valueRegion) {
      onNavigate(valueMd, valueRegion);
    } else {
      console.error('Failed to navigate:', 'Please select both Maindealer and Region');
      notifyMessage('Please select both Maindealer and Region');
    }
  };

  const handleMdChange = async (selectedMd) => {
    setValueMd(selectedMd.value);
    const result = await apiViewModel.fetchRegionById(selectedMd.value);
    if (result.success) {
      console.log('Data fetched:', result.data);

      const regions = result.data.map(region => ({
        label: region.regional_name,
        value: region.regional_id
      }));

      setRegion(regions);
    } else {
      console.error('Failed to fetch data:', result.error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select Maindealers:</Text>
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={[
          { label: 'Wahana', value: '1' },
          { label: 'HS Astra', value: '2' },
          { label: 'MPM Brompit', value: '3' },
          { label: 'Daya Auto', value: '4' },
        ]}
        value={valueMd}
        labelField="label"
        valueField="value"
        placeholder="Select Maindealer"
        searchPlaceholder="Search..."
        search
        onChange={handleMdChange}
        searchablePlaceholderTextColor="#9FA5AA"
        searchableStyle={styles.searchableStyle}
      />

      <Text style={styles.label}>Select Region:</Text>
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={region}
        value={valueRegion}
        labelField="label"
        valueField="value"
        placeholder="Select Region"
        searchPlaceholder="Search..."
        search
        onChange={(item) => setValueRegion(item.value)}
        searchablePlaceholderTextColor="#9FA5AA"
        searchableStyle={styles.searchableStyle}
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleGoToConsole}>
        <Text style={styles.buttonText}>Go to Console</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  dropdown: {
    marginVertical: 10,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#3498db',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default ChooseMDView;