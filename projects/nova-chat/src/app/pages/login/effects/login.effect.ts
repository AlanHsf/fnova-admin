import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, Action } from '@ngrx/store';
import { AppStore } from '../../../app.store';
import { loginAction } from '../actions';
import { appAction } from '../../../actions';
import { global, ApiService } from '../../../services/common';
import { catchError, exhaustMap, map, switchMap,filter } from 'rxjs/operators';

@Injectable()
export class LoginEffect {
    // 登录
    private login$: Observable<Action> = createEffect(()=> this.actions$
        .pipe(
        ofType(loginAction.login),
        map(result => (result as any).payload),
        switchMap(async (val:any) => {
            let loginObj = {
                username: val.username,
                password: val.password,
                is_md5: val.md5
            };
            let data: any = await this.apiService.login(loginObj);
            if (data.code) {
                this.store$.dispatch({
                    type: loginAction.loginFailed,
                    payload: data
                });
            } else {
                global.user = data.username;
                this.store$.dispatch({
                    type: loginAction.loginSuccess,
                    payload: val
                });
            }
            return { type: '[login] login useless' };
        })
        )
    );
    constructor(
        private actions$: Actions,
        private store$: Store<AppStore>,
        private apiService: ApiService
    ) { }
}
