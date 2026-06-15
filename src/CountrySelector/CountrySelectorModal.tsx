import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  TouchableWithoutFeedback,
  TextInput,
  SectionList,
  Pressable,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';
import { CountryCode } from '../consts/regions';
import { getDefaultRegionWithNullableState } from '../utils/getDefaultRegion';
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
  underlineModal?: React.ComponentType<React.ComponentProps<typeof Modal>> | null;
  value: CountryCode | null;
  UserCountryCodes?: CountryCode[] | null;
  onSelectCountry: (country: CountryCode) => void;
  isOpen?: boolean;
  toggleModalVisablity: () => void;
}

const CLICK_COUNTS_KEY = '@country_selector_click_counts';
const RECENT_SECTION_COUNT = 4;

export function CountrySelectorModal(props: CountrySelectorModalProps) {
  const { height } = useWindowDimensions();
  const [searchValue, setSearchValue] = useState('');
  const [clickCounts, setClickCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    AsyncStorage.getItem(CLICK_COUNTS_KEY).then((raw) => {
      if (raw) setClickCounts(JSON.parse(raw));
    });
  }, []);

  const recordClick = useCallback(
    async (country: CountryCode) => {
      const updated = { ...clickCounts, [country.id]: (clickCounts[country.id] ?? 0) + 1 };
      setClickCounts(updated);
      await AsyncStorage.setItem(CLICK_COUNTS_KEY, JSON.stringify(updated));
    },
    [clickCounts]
  );

  const recentSection = useMemo(() => {
    const allCountries = props.UserCountryCodes ?? [];
    const defaultCountry = getDefaultRegionWithNullableState(allCountries);

    const topClicked = Object.entries(clickCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, RECENT_SECTION_COUNT)
      .map(([id]) => allCountries.find((c) => c.id === id))
      .filter((c): c is CountryCode => c != null);

    if (!defaultCountry && topClicked.length === 0) return null;

    const data: CountryCode[] = [];
    if (defaultCountry) data.push(defaultCountry);
    for (const c of topClicked) {
      if (!data.some((d) => d.id === c.id)) data.push(c);
    }

    return { title: 'Recent Countries', data };
  }, [clickCounts, props.UserCountryCodes]);

  const sections = useMemo(() => {
    const sorted = [...(props.UserCountryCodes ?? [])].sort((a, b) => a.name.localeCompare(b.name));
    const filtered =
      searchValue.length < 1
        ? sorted
        : sorted.filter(
            ({ name, code, id }) =>
              name.toLowerCase().includes(searchValue.toLowerCase()) ||
              code.includes(searchValue) ||
              id.toLowerCase().includes(searchValue.toLowerCase())
          );

    const grouped = filtered.reduce<Record<string, CountryCode[]>>((acc, country) => {
      let letter = country.name[0].toUpperCase();
      if (letter === 'Å') {
        letter = 'A';
      }
      if (!acc[letter]) acc[letter] = [];
      acc[letter].push(country);
      return acc;
    }, {});

    const alphaSections = Object.keys(grouped)
      .sort()
      .map((letter) => ({ title: letter, data: grouped[letter] }));

    return alphaSections;
  }, [props.UserCountryCodes, searchValue]);

  const allSections = useMemo(() => {
    if (searchValue.length > 0 || !recentSection) return sections;
    return [recentSection, ...sections];
  }, [recentSection, sections, searchValue]);

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
        <View style={[styles.container, { height: height / 2.5 }]}>
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
          <SectionList
            ItemSeparatorComponent={() => <View style={styles.divider} />}
            sections={allSections}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            style={{
              borderTopLeftRadius: radius['lg'],
              borderTopRightRadius: radius['lg'],
            }}
            renderSectionHeader={({ section }) => (
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionHeaderText}>{section.title}</Text>
              </View>
            )}
            renderItem={({ item, index, section }) => {
              const isSelected = item.id === props.value?.id;
              const isFirst = index === 0;
              const isLast = index === section.data.length - 1;
              return (
                <Pressable
                  onPress={() => {
                    recordClick(item);
                    props.onSelectCountry(item);
                    props.toggleModalVisablity();
                    setSearchValue('');
                  }}
                  style={{
                    padding: spacing[3],
                    gap: spacing[1],
                    marginHorizontal: SIDE_SCREEN_PADDING,
                    backgroundColor: isSelected ? colors.blue[50] : colors.white,
                    borderTopLeftRadius: isFirst ? radius.lg : 0,
                    borderTopRightRadius: isFirst ? radius.lg : 0,
                    borderBottomLeftRadius: isLast ? radius.lg : 0,
                    borderBottomRightRadius: isLast ? radius.lg : 0,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      gap: spacing[1],
                      alignItems: 'center',
                    }}>
                    <Text>{item.flag}</Text>
                    <Text
                      style={[{ flexShrink: 1 }, isSelected ? { fontWeight: '600' } : undefined]}>
                      {item.name}
                    </Text>
                    <Text>({item.code})</Text>
                    {isSelected && (
                      <Feather
                        name="check"
                        size={14}
                        color={colors.blue[500]}
                        style={{ marginLeft: 'auto' }}
                      />
                    )}
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
    // gap: gap[4],
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
  sectionHeader: {
    backgroundColor: colors.gray[200],
    paddingHorizontal: SIDE_SCREEN_PADDING,
    paddingVertical: spacing[2],
  },
  sectionHeaderText: {
    fontSize: fontSizes.xs,
    fontWeight: '700',
    color: colors.gray[500],
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
});
