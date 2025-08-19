import React, { useEffect, useState } from 'react';
import { Image, ImageSourcePropType, View } from 'react-native';

interface TabIconProps {
  source: ImageSourcePropType;
  focused: boolean;
  height: number;
  marginTop: number;
}

export default function TabIcon({ source, focused, height, marginTop }: TabIconProps) {
  const [width, setWidth] = useState<number | null>(null);

  useEffect(() => {
    const asset = Image.resolveAssetSource(source as any);
    Image.getSize(
      asset.uri,
      (w, h) => {
        setWidth(height * (w / h));
      },
      (err) => console.error('Image load failed', err)
    );
  }, []);

  if (width === null) return null;

  return (
    <View style={{ width, height, marginTop, justifyContent: 'center', alignItems: 'center' }}>
      <Image
        source={source}
        style={{ width, height, opacity: focused ? 1 : 0.85 }}
        resizeMode="contain"
      />
    </View>
  );
}
