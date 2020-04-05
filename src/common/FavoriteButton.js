import React, { useState } from 'react'
import { TouchableOpacity, View, Text, Image, StyleSheet } from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import PropTypes from 'prop-types'

const FavoriteButton = (props) => {
  // console.log('FavoriteButton', props)
  const { onFavorite, isFavorite } = props

  // const [ isFavorite, setIsFavorite ] = useState(projectModel.isFavorite)

  // 模拟代替getDerivedStateFromProps方法
  // if (isFavorite !== projectModel.isFavorite) {
  //   setIsFavorite(projectModel.isFavorite)
  // }

  return (
    <TouchableOpacity
      underlayColor="transparent"
      style={{
        padding: 6
      }}
      onPress={() => { 
        // setIsFavorite(!isFavorite)
        // onFavorite(projectModel.item, !isFavorite)
        onFavorite(!isFavorite)
      }}
    >
      <FontAwesome 
        name={isFavorite ? 'star' : 'star-o'}
        size={26}
        style={{
          color: '#678'
        }}
      />
    </TouchableOpacity>
  )
}

FavoriteButton.propTypes = {
  projectModel: PropTypes.object,
  onSelect: PropTypes.func,
  onFavorite: PropTypes.func,
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

export default FavoriteButton
