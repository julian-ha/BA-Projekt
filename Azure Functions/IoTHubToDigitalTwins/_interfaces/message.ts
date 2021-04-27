export default interface message1 {
    status: number,
    heat_stable: boolean,
    gas_index: number, 
    meas_index: number,
    temperature: number, 
    pressure: number, 
    humidity: number,
    gas_resistance: number
}

export default interface message {
    timestamp: Date,
    deviceId: string,
    temperature: number,
    humidity: number,
    co2ThresholdRed: number,
    co2ThresholdYellow: number,
    co2: number,
    voc: number,
    light: number,
    loudness: number,
}
