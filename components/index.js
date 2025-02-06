import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
  Modal,
  TouchableOpacity,
  Button,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Picker} from '@react-native-picker/picker';
import axios from 'axios';
import Config from 'react-native-config';

const Currency = () => {
  const {API_KEY,BASE_URL} = Config
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [amount, setAmount] = useState('');
  const [exchangeRates, setExchangeRates] = useState({});
  const [toCurrency, setToCurrency] = useState('EUR');

  const [convertedAmount, setConvertedAmount] = useState('');
  const [conversionHistory, setConversionHistory] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  const handleChangeAmount = text => {
    setAmount(text);
  };


  const callConversionApiFetchData = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/${API_KEY}/latest/USD`,
      );
      if (res && res.data) {
        setExchangeRates(res?.data.conversion_rates);
      }
    } catch (error) {
        //Error will show when api fails
      Alert.alert(
        'Error: ',
        'Failed to fetch Exchange Rates. Please Try Again.',
      );
    }
  };

  useEffect(() => {
    callConversionApiFetchData();
  }, []);

  useEffect(() => {
    if (amount && exchangeRates[fromCurrency] && exchangeRates[toCurrency]) {
      //change should be when if we seleted both the picker
      const rate = exchangeRates[toCurrency] / exchangeRates[fromCurrency];
      const result = (amount * rate).toFixed(4);
      setConvertedAmount(result);
      //creating the the objects details for which operation has performed.

      const newConversionDetails = {
        id: Math.random().toString(),
        from: fromCurrency,
        to: toCurrency,
        amount: amount,
        result: result,
      };
      
     setConversionHistory(prev => [newConversionDetails, ...prev].slice(0, 5)); // as per req clice the 5 objects
    }
  }, [amount, exchangeRates, fromCurrency, toCurrency]);

  //show the last 5 conversion history

  const renderItems = ({item}) => {
    return ( <View style={styles.itemHistory}>
        <Text>{item.amount} {item.from} = {item.result} {item.to}</Text>
      </View>)
  };

  const handleOpenModal =(prop)=>{
    setIsVisible(prop)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Currency Converter</Text>
      <TextInput
        placeholder="Enter Amount"
        keyboardType="numeric"
        style={styles.input}
        onChangeText={text => {
          handleChangeAmount(text);
        }}
      />
      <Text style={styles.text}>From:</Text>
      <Picker
        style={styles.picker}
        selectedValue={fromCurrency}
        onValueChange={(itemValue, itemIndex) => setFromCurrency(itemValue)}>
        <Picker.Item label="USD" value="USD" />
        <Picker.Item label="AED" value="AED" />
        <Picker.Item label="INR" value="INR" />
        <Picker.Item label="AMD" value="AMD" />
        <Picker.Item label="ANG" value="ANG" />


      </Picker>
      <Text style={styles.text}>Show Converted Amount</Text>
      <Picker
        style={styles.picker}
        selectedValue={toCurrency}
        onValueChange={(itemValue, itemIndex) => setToCurrency(itemValue)}>
        <Picker.Item label="AED" value="AED" />
        <Picker.Item label="USD" value="USD" />
        <Picker.Item label="INR" value="INR" />
        <Picker.Item label="AMD" value="AMD" />
        <Picker.Item label="ANG" value="ANG" />
      </Picker>
      <TextInput
        placeholder="Result"
        keyboardType="numeric"
        style={styles.resultInput}
        value={convertedAmount}
        onChangeText={text => {
          handleChangeAmount(text);
        }}
      />
      <TouchableOpacity style={{fontSize: 20, marginBottom: 0}} onPress={()=>handleOpenModal(true)}>
        <Text>Show last 5 conversion Click Here</Text>
      </TouchableOpacity>
      {/* show last 5 conversion details  */}
     
      <Modal
        visible={isVisible}
        animationType="slide"
        onRequestClose={() => setIsVisible(false)}>
        <View style={styles.modalContainer}>
          <Text > Modal to show last conversion details</Text>
          <FlatList
            data={conversionHistory}
            renderItem={renderItems}
            keyExtractor={item => item.id}
          />
          <Button title= 'close' onPress={()=>handleOpenModal(false)}/>
        </View>
      </Modal>
    </View>
  );
};

export default Currency;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-evenly',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'grey',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    textAlign: 'center',
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 20,
  },
  from: {
    color: '#fff',
  },
  resultInput: {
    height: 40,
    borderColor: 'grey',
    borderWidth: 1,
    textAlign: 'center',
    marginTop: 30,
  },
  itemHistory: {
    padding: 10,
    borderBottomWidth: 1,
    backgroundColor: 'red',
  },
  text: {
    marginTop: 30,
    fontSize: 20,
  },

  modalContainer:{
    flex: 1,
    padding:20,
    justifyContent: 'center'
  },
  modalTitle:{
    fontSize: 20,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingTop:30
  }
});
