// import { Injectable } from '@angular/core';
// import * as Parse from "parse";
// import { Observable, of } from 'rxjs';
// import { tap, delay } from 'rxjs/operators';
// import { Router } from '@angular/router';
// import { AuthService } from './auth.service';
// @Injectable({
//     providedIn: 'root',
// })
// export class DataService {
//     profile: any;
//     profileId: any;
//     constructor(private authService:AuthService) { }
//     queryProfile() {
//         let user;
//         let profile;
//         let profileId;
//         let company;
//         let departmentId;
//         let classId;
//         return () => {
//             user = Parse.User.current();
//             let queryProfile = new Parse.Query("Profile");
//             queryProfile.equalTo("user", user.id);
//             queryProfile.first().then(async res => {
//                 if (res && res.id) {
//                     profile = res.toJSON();
//                     profileId = res.id;
//                     company = res.get('company').id
//                     localStorage.setItem('company', company)
//                     departmentId = res.get('department').id
//                     classId = res.get("schoolClass").id;
//                 }
//             })
//             return { profile, departmentId, classId, company }
//         }

//     }
//     getMajors() {

//     }
//     getSchoolClass(classId) {
//         let SchoolClass;
//         let query = new Parse.Query("SchoolClass");
//         query.equalTo("objectId", classId);
//         query.first().then(res => {
//             SchoolClass = res;
//             console.log(res);
//         });
//         return SchoolClass

//     }
//     getEduFile() {

//     }
//     getArticle(profile) {
//         let schoolname;
//         let articles;
//         profile.get("department").fetch().then(department => {
//             let companyId = department.get("subCompany").id;
//             schoolname = companyId;
//             let queryArticle = new Parse.Query("Article");
//             queryArticle.equalTo("company", schoolname);
//             queryArticle.limit(5);
//             queryArticle.find().then(res => {
//                 articles = res;
//             });
//         });
//         return { schoolname, articles }
//     }
//     parseError(err){
//         if (err.toString().indexOf('209') != -1) {
//             console.log(err.toString(), err.toString().indexOf('209'));
//             this.authService.logout('notSession')
//           }
//     }
// }