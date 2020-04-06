import React, { useState } from 'react'
import { Modal, TouchableOpacity, StyleSheet, View, Text, ScrollView, TouchableHighlight } from 'react-native'
import { connect } from 'react-redux'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import actions from '../action'
import DeviceInfo from 'react-native-device-info';
import ThemeDao from '../expand/dao/ThemeDao';
import globalStyles from '../res/styles/globalStyles';
import { transferToDoubleArr } from '../util';
import ThemeFactory, { ThemeFlags } from '../res/styles/ThemeFactory';

const CustomTheme = (props) => {
  const { visible, onClose, onSelect, onShow, onDismiss, onThemeChange } = props

  const displayData = transferToDoubleArr(Object.keys(ThemeFlags).map(k => ({name: k, theme: ThemeFlags[k]})), 3)
  console.log('displayData', displayData)
  const themeDao = new ThemeDao()

  const onSelectTheme = theme => {
    onClose()
    themeDao.save(ThemeFlags[theme])
    onThemeChange(ThemeFactory.createTheme(ThemeFlags[theme]))
  }

  return visible ? (
    <View style={globalStyles.root_container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={() => {
          onClose()
        }}
      >
        <View style={styles.modalContainer}>
          <ScrollView>
            {
              displayData.map((items, i) => (
                <View key={i} style={{flexDirection: 'row'}}>
                  {
                    items.map(item => item ? (
                      <TouchableHighlight
                        key={item.data.name}
                        style={{flex: 1}}
                        underlayColor="white"
                        onPress={() => {onSelectTheme(item.data.name)}}
                      >
                        <View style={[{backgroundColor: item.data.theme}, styles.themeItem]}>
                          <Text style={styles.themeText}>{item.data.name}</Text>
                        </View>
                      </TouchableHighlight>
                    ) : (
                      <View style={{flex: 1}} />
                    ))
                  }
                </View>
              ))
            }
          </ScrollView>
        </View>
      </Modal>
    </View>
  ) : null
}

const mapStateToProps = state => ({

})
const mapDispatchToProps = dispatch => ({
  onThemeChange: (theme) => {
    dispatch(actions.onThemeChange(theme))
  }
})

const styles = StyleSheet.create({
  themeItem: {
    flex: 1,
    height: 120,
    margin: 3,
    padding: 3,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  themeText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 16
  },
  modalContainer: {
    flex: 1,
    margin: 10,
    marginTop: Platform.OS === 'ios' ? 20: 10,
    backgroundColor: 'white',
    borderRadius: 3,
    shadowColor: "gray",
    shadowOffset: {
      width: 2,
      height: 2
    },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    padding: 3
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(CustomTheme)