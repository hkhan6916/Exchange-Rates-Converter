import { Component } from "@angular/core";
import { GlobalService } from "./global.service";
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  public baseCurrency = this.global.baseCurrency;
  public toCurrency = this.global.toCurrency
  public currencies = this.global.currencies;
  public history = this.global.history
  public loading = false;

  constructor(
    private global: GlobalService,
  ) {}
  ngOnInit() {
    this.global.getCurrencies();
  }

  async changeDate($event?: Event) {
    let dateNumber = this.getvalidDateTime($event.target["value"]);
    this.loading = true;
    this.global.history.date = dateNumber;
    await this.global.getCurrencies();
  }

  getLatestCurrency() {
    let currency = this.currencies.selected.currency
    this.global.HTTPReq(
      this.global.exchangeAPI,`latest?base=${this.baseCurrency.active}&symbols=${currency}`
    )
  }

  getvalidDateTime(datestring: string) { // returns todays date if date is in the future
    let now = new Date().getTime();
    let date = new Date(datestring).getTime();
    if (!date || typeof date != "number" || date > now) {
      console.log('INVALID DATE')
      return now
    }
    return date;
  }
}
