import { Modal, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function ModalDatePicker({ visible, dataPicker, onChange, maximumDate, minimumDate }) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
    >
      <DateTimePicker
        value={dataPicker}
        mode="date"
        display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
        onChange={onChange}
        maximumDate={maximumDate}
        minimumDate={minimumDate}
      />
    </Modal>
  );
}
