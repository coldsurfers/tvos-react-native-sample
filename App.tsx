/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import Video, {DRMSettings, DRMType} from 'react-native-video';

import {Colors} from 'react-native/Libraries/NewAppScreen';

const API_URL_TO_FETCH_DRM_SOURCE_URI = '';
const PALLYCON_SITEID = '';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [source, setSource] = useState<{uri: string} | null>(null);
  const [drm, setDrm] = useState<DRMSettings | null>(null);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  useEffect(() => {
    // fairplay + drm packaged (pallycon) example
    async function fetchVideo() {
      const response = await fetch(API_URL_TO_FETCH_DRM_SOURCE_URI, {
        headers: {
          Authorization: 'Bearer ',
        },
      });
      const result = (await response.json()) as {
        fairplay_url: string;
        pallycon_token: string; // fake example
      };
      setSource({uri: result.fairplay_url});
      setDrm({
        type: DRMType.FAIRPLAY,
        licenseServer:
          'https://license-global.pallycon.com/ri/licenseManager.do',
        certificateUrl: `https://license.pallycon.com/ri/fpsKeyManager.do?siteId=${PALLYCON_SITEID}`,
        base64Certificate: true,
        headers: {
          'pallycon-customdata-v2': result.pallycon_token,
          'Content-Type': 'application/octet-stream',
        },
      });
    }
    fetchVideo();
  }, []);

  if (drm === null || source === null) {
    return null;
  }

  return (
    <SafeAreaView style={[backgroundStyle, {flex: 1}]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <Video
        source={source}
        drm={drm}
        style={[styles.fullScreen, StyleSheet.absoluteFillObject]}
        controls
        fullscreen
        resizeMode={'contain'}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  fullScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  activityIndicator: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default App;
