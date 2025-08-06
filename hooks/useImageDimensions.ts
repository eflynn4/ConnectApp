// hooks/useImageDimensions.ts
import { useEffect, useState } from "react";
import { Image, ImageResolvedAssetSource } from "react-native";

export default function useImageDimensions(imageSource: any) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const resolved: ImageResolvedAssetSource = Image.resolveAssetSource(imageSource);
    if (resolved && resolved.width && resolved.height) {
      setDimensions({ width: resolved.width, height: resolved.height });
    }
  }, [imageSource]);

  return dimensions;
}
