import React, { useState } from 'react'
import { Modal, TouchableOpacity, StyleSheet, View, Text } from 'react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import TimeSpan from '../model/TimeSpan';
import DeviceInfo from 'react-native-device-info';

export const TimeSpans = [
  new TimeSpan('今 天', 'since=daily'),
  new TimeSpan('本 周', 'since=weekly'),
  new TimeSpan('本 月', 'since=monthly')
]

const TrendingDialog = (props) => {
  const { visible, onClose, onSelect, onShow, onDismiss } = props
  // const [ visible, setVisible ] = useState(false)

  return (
    <Modal
      transparent={true}
      visible={visible}
      onRequestClose={() => onClose()}
    >
      <TouchableOpacity
        style={styles.container}
        onPress={() => onDismiss()}
      >
        <MaterialIcons
          name="arrow-drop-up"
          size={36}
          style={styles.arrow}
        />
        <View
          style={styles.content}
        >
          {
            TimeSpans.map((t, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => onSelect(t)}
                underlayColor='transparent'
              >
                <View
                  style={styles.textContainer}
                >
                  <Text
                    style={styles.text}
                  >
                    {t.showText}
                  </Text>
                </View>
                {
                  i !== TimeSpans.length - 1 && <View style={styles.line} />
                }
              </TouchableOpacity>
            ))
          }
        </View>
      </TouchableOpacity>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    flex: 1,
    alignItems: 'center',
    paddingTop: DeviceInfo.getSystemName() !== 'Android' ? 30 : 0
  },
  arrow: {
    marginTop: 40,
    color: 'white',
    padding: 0,
    margin: -15
  },
  content: {
    backgroundColor: 'white',
    borderRadius: 3,
    paddingTop: 3,
    paddingBottom: 3,
    marginRight: 3
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  text: {
    fontSize: 16,
    color: 'black',
    fontWeight: '400',
    padding: 8,
    paddingLeft: 26,
    paddingRight: 26
  },
  line: {
    height: 0.3,
    backgroundColor: 'darkgray'
  }
})

export default TrendingDialog