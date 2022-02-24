import { DrivingLicenseData } from "react-native-mdl";
import { RootReducerI } from "~/types/reducer";

export const getMdlDisplayData = (state: RootReducerI): DrivingLicenseData | null => state.mdl.displayData