import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  Text,
  SafeAreaView,
  StyleSheet,
  Alert,
  View,
  TextInput,
  Button,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

const App = () => {
  const [text, setText] = useState('');

  const [storedText, setStoredText] = useState([]);

  const removeValue = async () => {
    try {
      await AsyncStorage.removeItem('@storage_Key');
    } catch (e) {
      // remove error
    }
  };

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('@storage_Key');
      if (value !== null) {
        // value previously stored

        return value;
      }
    } catch (e) {
      // error reading value
    }
  };

  const storeData = async (value: string) => {
    try {
      const currentText = await getData();

      if (currentText) {
        const formatedCurrentText = JSON.parse(currentText);

        const values = [...formatedCurrentText, value];

        await AsyncStorage.setItem('@storage_Key', JSON.stringify(values));

        const newCurrentText = await getData();

        newCurrentText && setStoredText(JSON.parse(newCurrentText));
      } else {
        const valueToSave = [value];

        await AsyncStorage.setItem('@storage_Key', JSON.stringify(valueToSave));

        const newCurrentText = await getData();

        newCurrentText && setStoredText(JSON.parse(newCurrentText));
      }
    } catch (e) {
      // saving error
      Alert.alert(e);
    }
  };

  useEffect(() => {
    async function getDataToSaveInState() {
      const newData = await getData();

      if (newData) {
        const formatedNewData = JSON.parse(newData);

        setStoredText(formatedNewData);
      }
    }

    getDataToSaveInState();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.containerText}>Por favor, envie um texto</Text>
        <View style={styles.inputView}>
          <TextInput onChangeText={e => setText(e)} placeholder="Texto" />
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            storeData(text);
          }}>
          <Text style={styles.buttonText}>Enviar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          alignItems: 'center',
        }}
        style={styles.textList}>
        {storedText.map((text, index) => {
          return (
            <View key={index} style={styles.listItemView}>
              <Text style={styles.listItemViewText}>{text}</Text>
              <TouchableOpacity onPress={() => {}}>
                <Text style={styles.removeText}>Remover</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#1C325B',
  },

  form: {
    marginTop: 100,
    width: '100%',
    alignItems: 'center',
  },

  containerText: {
    color: '#FFF',
    fontSize: 18,
    width: '100%',
    textAlign: 'center',
  },

  inputView: {
    backgroundColor: '#FFF',
    width: '80%',
    height: 40,
    borderRadius: 5,
    justifyContent: 'center',
    paddingLeft: 15,
    marginTop: 10,
  },

  inputText: {
    color: '#000',
    width: '100%',
  },

  button: {
    backgroundColor: '#5199CF',
    width: '80%',
    height: 40,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },

  buttonText: {
    color: '#000',
    fontSize: 16,
  },

  textList: {
    width: 300,
    margin: 50,
  },

  listItemView: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    height: 45,
    borderBottomColor: '#000',
    flexDirection: 'row',
    borderBottomWidth: 0.3,
    backgroundColor: '#5568B5',
    paddingHorizontal: 10,
    borderRadius: 5,
  },

  listItemViewText: {
    fontSize: 14,
    color: '#000',
  },

  removeText: {
    fontSize: 10,
  },
});
