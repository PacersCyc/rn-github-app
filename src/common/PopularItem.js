import React, { useState, useEffect } from 'react'
import { TouchableOpacity, View, Text, Image, StyleSheet } from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import FavoriteButtom from './FavoriteButton'

const PopularItem = (props) => {
  console.log('PopularItem', props)
  const { theme, projectModel, onSelect, onFavorite } = props
  const { item } = projectModel

  const [ isFavorite, setIsFavorite ] = useState(projectModel.isFavorite)

  const changeFavorite = (isFavorite) => {
    setIsFavorite(isFavorite)
    onFavorite(projectModel.item, isFavorite)
  }

  useEffect(() => {
    setIsFavorite(projectModel.isFavorite)
  }, [projectModel.isFavorite])

  if (!item || !item.owner) {
    return null
  }

  return (
    <TouchableOpacity
      onPress={() => {
        onSelect(changeFavorite)
      }}
    >
      <View style={styles.cell_container}>
        <Text style={styles.title}>
          {item.full_name}
        </Text>
        <Text style={styles.description}>
          {item.description}
        </Text>
        <View style={styles.row}>
          <View style={styles.row}>
            <Text>Author: </Text>
            <Image
              style={{
                height: 22,
                width: 22
              }}
              source={{
                uri: item.owner.avatar_url
              }}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between'
            }}
          >
            <Text>Stars: </Text>
            <Text>{item.stargazers_count}</Text>
          </View>
          <FavoriteButtom
            theme={theme}
            isFavorite={isFavorite}
            // projectModel={projectModel}
            onFavorite={(iF) => {
              changeFavorite(iF)
              // onFavorite(it, iF)
            }}
          />
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

export default PopularItem
