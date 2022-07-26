import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
// import "rxjs/operator/map"

@Injectable()
export class SignatureService {
    constructor(
        private http: HttpClient
    ) {}
    public requestSignature(url, data) {
        let headers = new HttpHeaders();
        headers.append('Content-Type', 'application/json');
        let options = { headers };
        return this.http.post(url, data, options)
        .pipe(map((res: any) => res._body ? res._body : res))
        .toPromise().catch((error) => {
            // 请求服务端签名接口错误
            console.log('请求服务端签名接口错误', error);
        });
    }
}
