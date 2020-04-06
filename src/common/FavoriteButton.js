import React, { useState } from 'react'
import { TouchableOpacity, View, Text, Image } from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import PropTypes from 'prop-types'

const FavoriteButton = (props) => {
  // console.log('FavoriteButton', props)
  const { theme, onFavorite, isFavorite } = props

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
          color: theme.themeColor
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

export default FavoriteButton
