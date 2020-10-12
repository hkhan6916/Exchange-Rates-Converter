import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { currencies } from './interfaces'

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  public history = {
    date: new Date().getTime()-100*60*60*12
  }
  public baseCurrency = {
    dropdownList: [],
    active: "GBP",
    amount:1
  }
  public toCurrency = {
    dropdownList: [],
    active: "USD"
  }
  public currencies: currencies = {
    list: {},
    selected: {
      prices: [],
      currency: "",
      active:false
    },
  }
  public exchangeAPI ='https://api.exchangeratesapi.io/'

  constructor(private http: HttpClient) {
   }
  async HTTPReq(API, location?, element?): Promise<any> { // location and element must be optional
    if (!element) {
      element = {}
    }
    return new Promise((resolve, reject) => {
      let result
        result = this.http.get(API + location, element,
        ).subscribe(result => {
          let body = result
          if (body) {
            return resolve(body)
          } else {
            return reject(body)
          }
        })
    })
  }

  async getCurrencies() {
    let result = new Promise(async (resolve) => {
    let historyURLString = this.formatHistoryURLString()
      await this.HTTPReq(this.exchangeAPI,`${historyURLString}base=${this.baseCurrency.active}`).then((res)=>{
       let rates=res.rates
        if (this.baseCurrency.dropdownList.length < 1) {
          this.setCurrencyDropdownList(rates)
        }
        if (!this.currencies.selected.active) {
          this.currencies.list = rates
        } else {
          resolve()
         this.setPricesForSelectedCurrency(rates)
        }
      })
    })
    return result
  }

  formatDate(dateTime: number): string {
    let now = new Date().getTime()
    
    if (typeof dateTime != "number" || dateTime <= 0 || dateTime > now) dateTime = this.history.date
    let date = new Date(dateTime)

    return date.getFullYear() + "-" + (date.getMonth()+ 1 ) + "-" +
      (date.getDate() )
  }

  setPricesForSelectedCurrency(rates){
    let selectedExchange=this.currencies.selected.currency
    this.currencies.selected.prices=[]
    for(let time of Object.keys(rates)){
      this.currencies.selected.prices.push({
        time:time,
        value:rates[time][selectedExchange]
      })
    }
  }
  
  formatHistoryURLString(){
    let dateFormat = this.formatDate(this.history.date) + "?"
    return dateFormat
  }

  setCurrencyDropdownList(rates){
          for (let currency of Object.keys(rates)) {
            this.baseCurrency.dropdownList.push(currency)
      }
  }
}
