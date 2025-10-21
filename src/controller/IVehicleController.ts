import type { Vehicle, VehicleWithStation, StationWithVehicles, VehicleDetail } from "../models/VehicleModel";

export interface IVehicleController {
    getAllVehicles(): Promise<{
        success: boolean,
        data: VehicleWithStation[],
        message?: string,
        error?: string,
    }>

    getAvailableVehicles(): Promise<{
        success: boolean,
        data: VehicleWithStation[],
        message?: string,
        error?: string,
    }>

    getVehiclesByStation(stationId: number): Promise<{
        success: boolean,
        data: Vehicle[],
        message?: string,
        error?: string,
    }>

    getVehicleDetail(vehicleId: number): Promise<{
        success: boolean,
        data: VehicleDetail | null,
        message?: string,
        error?: string,
    }>

    getAllStations(): Promise<{
        success: boolean,
        data: StationWithVehicles[],
        message?: string,
        error?: string,
    }>

    filterVehicles(
        vehicles: VehicleWithStation[],
        filters: {
            status?: Vehicle["status"],
            stationId?: number,
            minBattery?: number,
        }
    ): VehicleWithStation[]

    formatBattery(batteryLevel: number): string
    formatPrice(price: number): string
    isVehicleAvailable(vehicle: Vehicle): boolean
    formatMileage(mileage: number): string
}