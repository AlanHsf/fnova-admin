import { appAction } from '../actions';
interface AppStore {
    actionType: string;
    errorApiTip: object;
    tipModal: object;
}
let appInit: AppStore = {
    actionType: '',
    errorApiTip: {},
    tipModal: {}
};
export let appReducer = (state: AppStore = appInit, { type, payload }) => {
    let stateTmp:any = {};
    Object.keys(state).forEach((key)=>{
        stateTmp[key] = JSON.parse(JSON.stringify(state[key]))
    })
    stateTmp.actionType = type;
    state = stateTmp;
    // state.actionType = type;
    switch (type) {
        case appAction.errorApiTip:
            state.errorApiTip = payload;
            break;
        case appAction.tipModal:
            state.tipModal = payload;
            break;
        default:
    }
    return state;
};
