import { Component, OnInit } from '@angular/core';
import * as Parse from "parse"; 
import { ActivatedRoute, Router } from "@angular/router";

@Component({
    selector: 'app-platform-app',
    templateUrl: './platform-app.component.html',
    styleUrls: ['./platform-app.component.scss']
})
export class PlatformAppComponent implements OnInit {

    constructor(private router: Router,) { }
    plugin:any = []
    async ngOnInit() {
       await this.getPlugin()
    }

    async getPlugin() {
        let DevPlugin = new Parse.Query('DevPlugin')
        DevPlugin.addAscending('index')
        DevPlugin.include('routers')
        let plugin = await DevPlugin.find()
        if(plugin && plugin.length > 0) {
            this.plugin = plugin
        }
    }

    toPlugin(item) {
        console.log(item.id)
        let params:any = {
            rid: item.id
        }
        if(item.get('data') && item.get('data').equalTo) {
            params.equalTo = item.get('data').equalTo
        }
        this.router.navigate([item.get('pageUrl'), params ])
    }

}
