import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Screen } from '../../../components/Screen/Screen';
import { useTranslation } from 'react-i18next';
import { HeaderInspectionMode } from '../components/HeaderInspectionMode';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { InspectionStackParamsList } from '../../../routes/InspectionRoutes';
import { useInspectionContext } from '../../../hooks/useInspectionContext';
import { useSQLite } from '../../../hooks/useSQLite';
import { useResetNavigation } from '../../../hooks/useResetNavigation';

type ScreenProps = NativeStackScreenProps<
  InspectionStackParamsList,
  'ChooseColectScreen'
>;
export function ChooseColectScreen({}: ScreenProps) {
  const { areaOpened } = useInspectionContext();
  const { updateCollectionMethod, addSampling } = useSQLite();
  const { resetToSelectStepScreen } = useResetNavigation();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkCollectionMethod();
  }, [areaOpened]);

  function checkCollectionMethod() {
    if (!areaOpened) return;

    if (areaOpened?.collectionMethod !== '') {
      resetToSelectStepScreen(areaOpened?.collectionMethod)
    }

    setLoading(false);
  }

  async function handleGoToRealizeInspection(method: 'manual' | 'sampling') {
    if (!areaOpened) return;

    updateCollectionMethod(method, areaOpened?.id);

    if (method === 'manual') {
      await addSampling({
        areaId: areaOpened?.id,
        number: 1,
        size: areaOpened?.size,
        coordinate: '',
      });
    }

    resetToSelectStepScreen(method)
  }

  if (loading) {
    return (
      <Screen screenTitle={t('collectionMethod')} showBackButton>
        <View className="absolute w-screen h-screen items-center justify-center">
          <ActivityIndicator size={40} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen screenTitle={t('collectionMethod')} showBackButton>
      <HeaderInspectionMode />

      <View className="w-full items-center mt-10">
        <Text className="font-bold text-black text-xl">
          {t('howWouldYouLikeCollectData')}
        </Text>
        <Text className="mt-10 text-lg text-center text-gray-500">
          {t('descHowWouldYouLikeCollectData')}
        </Text>
      </View>

      <View className="w-full flex-row items-center mt-10">
        <TouchableOpacity
          className="w-[48%] h-12 rounded-2xl items-center justify-center bg-gray-300"
          onPress={() => handleGoToRealizeInspection('manual')}
        >
          <Text className="text-black font-semibold">{t('manual')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="w-[48%] h-12 rounded-2xl items-center justify-center ml-3 bg-gray-300"
          onPress={() => handleGoToRealizeInspection('sampling')}
        >
          <Text className="text-black font-semibold">{t('sampling')}</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}
