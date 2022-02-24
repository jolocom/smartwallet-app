import { DrivingLicenseData } from "react-native-mdl";

export enum MdlActions {
    setDisplayData = 'setDisplayData'
}

export interface MdlState {
    displayData: DrivingLicenseData | null
}