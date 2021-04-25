export default interface reading {
    status: number,
    heat_stable: boolean,
    gas_index: number, 
    meas_index: number,
    temperature: number, 
    pressure: number, 
    humidity: number,
    gas_resistance: number
}
