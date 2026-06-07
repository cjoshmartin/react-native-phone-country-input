import { useMemo, useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  TouchableWithoutFeedback,
  TextInput,
  FlatList,
  Pressable,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { CountryCode } from '../consts/regions';
import {
  spacing,
  borderWidth as borders,
  fontSize as fontSizes,
  padding,
  borderWidth,
  radius,
  gap,
  SIDE_SCREEN_PADDING,
} from '../Styling/Sizing';
import { colors } from '../Styling/Colors';

export interface CountrySelectorModalProps extends React.ComponentProps<typeof Modal> {
  underlineModal?: typeof Modal | null;
  value: CountryCode | null;
  UserCountryCodes?: CountryCode[] | null;
  onSelectCountry: (country: CountryCode) => void;
  isOpen?: boolean;
  toggleModalVisablity: () => void;
}

export function CountrySelectorModal(props: CountrySelectorModalProps) {
  const { height } = useWindowDimensions();
  const [searchValue, setSearchValue] = useState('');

  const filtredCountryCodes = useMemo(() => {
    const sorted_value = props.UserCountryCodes?.sort((a, b) => a.name.localeCompare(b.name));
    if (searchValue.length < 1) {
      return sorted_value;
    }

    return sorted_value?.filter(
      ({ name, code, id }) =>
        name.includes(searchValue) || code.includes(searchValue) || id.includes(searchValue)
    );
  }, [props.UserCountryCodes, searchValue]);

  const UserModal = useMemo(() => {
    if (props.underlineModal) {
      console.log('underlineModal');
      return props.underlineModal;
    }
    console.log('underlineModal - underfine');
    return undefined;
  }, [props.underlineModal]);

  if (UserModal) {
    return <UserModal {...props} />;
  }
  return (
    <Modal animationType="slide" visible={props.isOpen} transparent>
      <View style={styles.overlay}>
        <TouchableWithoutFeedback
          onPress={() => {
            props.toggleModalVisablity();
            setSearchValue('');
          }}>
          <View style={StyleSheet.absoluteFillObject} />
        </TouchableWithoutFeedback>
        <View style={[styles.container, { height: height / 3 }]}>
          <View
            style={{
              backgroundColor: colors.white,
              padding: padding[3],
              borderTopLeftRadius: radius['3xl'],
              borderTopRightRadius: radius['3xl'],
            }}>
            <View style={styles.searchContainer}>
              <Feather name="search" size={16} color="gray" />
              <TextInput
                placeholder="Country name or code"
                style={styles.searchInput}
                value={searchValue}
                onChangeText={(value) => {
                  setSearchValue(value);
                }}
              />
            </View>
          </View>
          <FlatList
            ItemSeparatorComponent={() => <View style={styles.divider} />}
            data={filtredCountryCodes}
            keyExtractor={(item) => item.id}
            style={{
              borderTopLeftRadius: radius['lg'],
              borderTopRightRadius: radius['lg'],
            }}
            renderItem={({ item }) => {
              return (
                <Pressable
                  onPress={() => {
                    props.onSelectCountry(item);
                    props.toggleModalVisablity();
                    setSearchValue('');
                  }}
                  style={{
                    padding: spacing[3],
                    gap: spacing[1],
                    marginHorizontal: SIDE_SCREEN_PADDING,
                    backgroundColor: colors.white,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      gap: spacing[1],
                    }}>
                    <Text>{item.flag}</Text>
                    <Text>{item.name}</Text>
                    <Text>({item.code})</Text>
                  </View>
                  <View>
                    <Text
                      style={{
                        fontSize: fontSizes.xs,
                        color: colors.gray[400],

                        paddingHorizontal: padding[0.5],
                      }}>
                      {item.code} {item.mask.replace(/\#/g, '_')}
                    </Text>
                  </View>
                </Pressable>
              );
            }}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: colors.gray[200],
    // padding: spacing[5],
    gap: gap[4],
    borderTopLeftRadius: radius['3xl'],
    borderTopRightRadius: radius['3xl'],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  searchContainer: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: borders.DEFAULT,
    borderColor: colors.gray[100],
    paddingHorizontal: spacing[1],
    backgroundColor: colors.gray[300],
    borderRadius: radius['2xl'],
  },
  searchInput: {
    flex: 1,
    padding: spacing[1],
  },
  divider: {
    height: borderWidth.DEFAULT,
    backgroundColor: colors.gray[200],
    marginHorizontal: spacing[1.5],
  },
});
