import { Dimensions, PixelRatio } from "react-native";

const { width } = Dimensions.get("window");
const baseWidth = 360;
const scale = width / baseWidth;

export const normalize = (size) => {
    if (typeof size !== "number") return size;
    const newSize = size * scale * 0.75;
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
};