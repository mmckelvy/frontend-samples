import { centsToDollars } from '@book-and-ledger/numbers'
import { displayToLtree } from '../map-names'
/*
Converts {income.sales} to a balance (e.g. 80)

@param: object | metric.  Should have a 'calculation' key.
@param: [objects] | accounts.  Should have 'accountName' or 'matchName' and 'balance' keys.

@return: string.  The calculation string with accounts replaced with numbers
*/
export default function replaceWithBalance({ metric, accounts }) {
  const re = /{[^}]*}/g

  return metric.calculation.replace(re, (match) => {
    // Strip the braces
    const metricAcct = match.replace(/[{}]/g, '')

    // Swap out with the balances
    const b = accounts.find((account) => {
      const lMetric = displayToLtree(metricAcct)
      /*
      This ltree conversion step is necessary because while the metric accounts are already converted to ltrees, the accounts listed in the actual calculation are not.
      */

      return (account.accountName === lMetric || account.matchName === lMetric)
    }).balance

    return centsToDollars(b)
  })
}
