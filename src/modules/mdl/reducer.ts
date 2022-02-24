import { Action } from "~/types/actions";
import { MdlActions, MdlState } from "./types";

const initialState: MdlState = {
    displayData: null
}

const reducer = (state = initialState, action: Action<MdlActions, any>) => {
    switch(action.type) {
        case MdlActions.setDisplayData:
            return {...state, displayData: action.payload}
        default:
            return state
    }
}

export default reducer