import { Pipe, PipeTransform } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
@Pipe({
  name: "html"
})
export class HtmlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {
  }
  transform(html) {
    // <style>body {margin:0;font-size:11pt;}</style>
    let style = `<style>body {margin:0;font-size:11pt;font-family: 'Microsoft Yahei', "Lucida Grande", "Tahoma", "Arial", "Helvetica", "sans-serif";}</style>`
    html = `${style} <div style="height:20cm;margin:0;">${html}</div>`

    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
