import React from 'react'
import { TouchableOpacity, View, Text, Image, StyleSheet } from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import HTMLView from 'react-native-htmlview'

const TrendingItem = (props) => {
  const { item, onSelect } = props
  if (!item) {
    return null
  }
  let description = `<p>${item.description}</p>`

  let FavoriteButton = (
    <TouchableOpacity
      style={{
        padding: 6
      }}
      onPress={() => { }}
      underLayColor="transparent"
    >
      <FontAwesome
        name="star-o"
        size={26}
        style={{
          color: 'red'
        }}
      />
    </TouchableOpacity>
  )

  return (
    <TouchableOpacity
      onPress={onSelect}
    >
      <View style={styles.cell_container}>
        <Text style={styles.title}>
          {item.fullName}
        </Text>
        <HTMLView 
          value={description}
          onLinkLongPress={(url) => {}}
          stylesheet={{
            p: styles.description,
            a: styles.description
          }}
        />
        {/* <Text style={styles.description}>
          {item.description}
        </Text> */}
        <View style={styles.row}>
          <View style={styles.row}>
            <Text>Built By: </Text>
            {
              item.contributors.map((con, i) => i%2===0 ? null : (
                <Image
                  key={i}
                  style={{
                    height: 22,
                    width: 22,
                    margin: 2
                  }}
                  source={{
                    uri: con
                  }}
                />
              ))
            }
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between'
            }}
          >
            <Text>Fork: </Text>
            <Text>{item.forkCount}</Text>
          </View>
          {/* <TouchableOpacity
            style={{
              padding: 6
            }}
            onPress={() => { }}
            underLayColor="transparent"
          >
            <FontAwesome
              name="star-o"
              size={26}
              style={{
                color: 'red'
              }}
            />
          </TouchableOpacity> */}
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  cell_container: {
    backgroundColor: 'white',
    padding: 10,
    marginLeft: 5,
    marginRight: 5,
    marginVertical: 3,
    borderColor: '#ddd',
    borderWidth: 0.5,
    borderRadius: 2,
    shadowColor: 'gray',
    shadowOffset: {
      width: 0.5,
      height: 0.5
    },
    shadowRadius: 1,
    elevation: 2
  },
  row: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center'
  },
  title: {
    fontSize: 16,
    marginBottom: 2,
    color: '#212121'
  },
  description: {
    fontSize: 14,
    marginBottom: 2,
    color: '#757575'
  }
})

export default TrendingItem
