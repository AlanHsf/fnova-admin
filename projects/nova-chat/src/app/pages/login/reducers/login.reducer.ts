import { loginAction } from '../actions';
import { LoginStore } from '../stores/login.store';
let loginInit = {
    isLoginSuccess: false,
    loginTip: '',
    isButtonAvailable: false,
    actionType: 'init',
    userInfo: {
        username: '',
        password: ''
    },
    loginRemember: false
};

export let loginReducer = (state: LoginStore = loginInit, { type, payload }) => {
    if (type) {
        let stateTmp:any = {};
        Object.keys(state).forEach((key)=>{
            stateTmp[key] = JSON.parse(JSON.stringify(state[key]))
        })
        stateTmp.actionType = type;
        state = stateTmp;
        // state.actionType = type;
    }
    switch (type) {
        case loginAction.loginSuccess:
            state.isLoginSuccess = true;
            state.loginTip = '';
            state.userInfo.username = payload.username;
            state.userInfo.password = payload.password;
            state.loginRemember = payload.loginRemember;
            break;
        case loginAction.loginFailed:
            state.isLoginSuccess = false;
            if (Number(payload.code) === 880106) {
                state.loginTip = '账号已被禁用';
            } else {
                state.loginTip = '用户名或密码错误';
            }
            break;
        case loginAction.isButtonAvailableAction:
            isButtonAvailable(state, payload);
            break;
        case loginAction.emptyTip:
            state.loginTip = '';
            break;
        default:
    }
    return state;
};
// 判断按钮是否可以点击的状态
function isButtonAvailable(state: LoginStore, payload) {
    if (payload.password.length > 0 && payload.username.length > 0) {
        state.isButtonAvailable = true;
    } else {
        state.isButtonAvailable = false;
    }
}
