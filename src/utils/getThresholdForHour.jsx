import { rainfallThresholds } from "../data/adyar_besant_mylapore";
export const getThresholdForHour = (hour) => {
    return rainfallThresholds[hour] || 0;
  };