import { DrivingLicenseData } from "react-native-mdl";
import createAction from "~/utils/createAction";
import { MdlActions } from "./types";

export const setMdlDisplayData = createAction<DrivingLicenseData | null>(MdlActions.setDisplayData)