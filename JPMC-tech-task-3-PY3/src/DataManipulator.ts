import { ServerRespond } from './DataStreamer';

export interface Row {
  // the changes here reflect the changed structure of the return object of the generateRow function
  // MUST correspond to schema of the table in Graph component
  price_abc: number,
  price_def: number,
  ratio: number,
  timestamp: Date,
  upper_bound: number,
  lower_bound: number,
  trigger_alert: number | undefined,
}


export class DataManipulator {
  // return value changed from array of Row objects to a single Row object
  static generateRow(serverRespond: ServerRespond[]): Row { 
    // compute for price_abc and price_def properly and use them to compute ratio
    const priceABC = (serverRespond[0].top_ask.price + serverRespond[0].top_bid.price) / 2;
    const priceDEF = (serverRespond[1].top_ask.price + serverRespond[1].top_bid.price) / 2;
    const ratio = priceABC / priceDEF
    // upper and lower bounds remain constant at 1.05 and 0.95
    const upperBound = 1 + 0.05
    const lowerBound = 1 - 0.05
      return {
        price_abc: priceABC,
        price_def: priceDEF,
        ratio,
        timestamp: serverRespond[0].timestamp > serverRespond[1].timestamp ? serverRespond[0].timestamp : serverRespond[1].timestamp,
        upper_bound: upperBound,
        lower_bound: lowerBound,
        // if threshold is passed by ratio, trigger_alert holds ratio value, otherwise it remains undefined
        trigger_alert: (ratio > upperBound || ratio < lowerBound) ? ratio : undefined,
      };
  }
}
