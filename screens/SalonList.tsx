import React from 'react';
import { FlatList, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSalons } from '../hooks/useSalons';   // custom hook that returns {salons}

export default function SalonList({ navigation }) {
  const { salons } = useSalons();           // already sorted by queue then distance

  return (
    <FlatList
      data={salons}
      keyExtractor={(s)=>s.id}
      renderItem={({item})=>(
        <TouchableOpacity style={styles.row}
          onPress={()=>navigation.navigate('SalonDetail',{id:item.id})}>
          <View>
            <Text style={styles.name}>{item.name}</Text>
            <Text>{item.queue} waiting • {item.distance.toFixed(1)} km</Text>
          </View>
        </TouchableOpacity>
      )}
    />
  );
}
const styles = StyleSheet.create({ row:{padding:16,borderBottomWidth:1,borderColor:'#eee'}, name:{fontSize:16,fontWeight:'600'} }); 