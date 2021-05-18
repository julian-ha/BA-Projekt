
export default interface message {
    deviceType: string,
    timestamp: Date,
    deviceId: string,
    temperature?: number,
    humidity?: number,
    co2ThresholdRed?: number,
    co2ThresholdYellow?: number,
    co2?: number,
    voc?: number,
    light?: number,
    loudness?: number,
    ambientTemperature?: number;
}
