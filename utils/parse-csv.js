import { camelCaseAll } from 'string-casing'
import { sanitizeInput, sanitizeWithPreset } from '@book-and-ledger/sanitizers'
import { parseStringToNumber, dollarsToCents } from '@book-and-ledger/numbers'

import displayToLtree from '../map-names/display-to-ltree'
import displayToTags from '../map-names/display-to-tags'

// Converts CSV to JSON
export default function parseCsv(csvString) {

  // Each transaction is delineated by a newline
  const [ header, ...body ] = csvString.split('\n')
  // Pull the column names and map to transaction object keys
  const cols = header.split(',')
  const colMap = {
    date: 'transactionDate',
    amount: 'transactionAmount',
    party: 'partyName',
    tags: 'tags',
    generalLedgerEntries: 'glEntries',
    businessPurpose: 'businessPurpose',
    attendees: 'attendees',
    notes: 'notes'
  }

  const discardedCols = []

  const trxCols = cols.reduce((acc, col, i) => {
    // Convert to camelCase
    const cleanCol = camelCaseAll(col.toLowerCase())

    // Discard any unknown columns
    if (!colMap[cleanCol]) {
      // Track which cols where discarded
      discardedCols.push(i)

      return acc
    }

    // Map the appropriate columns
    acc = [...acc, colMap[cleanCol]]
    return acc
  }, [])

  // Verify we have the required keys
  const requiredCols = [
    'transactionDate',
    'transactionAmount',
    'partyName',
    'glEntries'
  ]

  // We don't have the required columns
  if (!requiredCols.every((col) => trxCols.includes(col))) {
    throw new Error('colsMissing')
  }

  // CSV looks good, process the transactions
  return body.reduce((trxsAcc, row, i) => {
    // Pull the row data
    let data = row.split(',')

    /*
    Programs such as Excel sometimes add extra columns. Remove them for CSV parsing.
    */
    if (data.length !== trxCols.length) {
      const diff = data.length - trxCols.length
      // Remove the extra columns
      data = data.slice(0, data.length - diff)
    }

    const isBlank = data.every((el) => {
      return !el
    })

    // Remove any extra rows (again, MS Excel)
    if (isBlank) {
      return trxsAcc
    }

    // convert to an object
    const trx = data.reduce((trxAcc, dataPoint, j) => {
      // Make sure it's not a discarded column
      if (discardedCols.includes(j)) {
        return trxAcc
      }

      // Pull the appropriate key
      const key = trxCols[j]

      // Handle tags
      if (key === 'tags') {
        trxAcc[key] = dataPoint.length > 0
          ? dataPoint.split(';')
              .map((tag) => {
                const re = /[\s_]+/g

                return sanitizeInput(tag).replace(re, '-').toLowerCase()
              })
          : []

      // Convert glEntries to an array of objects
      } else if (key === 'glEntries') {

        trxAcc[key] = dataPoint.split(';')
          // filter out empty strings
          .filter((el) => {
            return el.length > 0
          })
          .map((entry) => {
            const [ entryName, displayName, entryAmount ] = entry.split(':')

            const cleanDisplay = displayName.split('.').map((piece) => {
              return sanitizeInput(piece, {allowDot: true})
            }).join('.')

            const cleanEntryAmount = sanitizeWithPreset({
              input: entryAmount,
              preset: 'number'
            })

            return {
              entryName: sanitizeInput(entryName.toLowerCase(), {
                allowSingleWhitespace: false,
                allowUnderscore: false,
                allowDash: false
              }),
              displayName: cleanDisplay,
              accountName: displayToLtree(cleanDisplay),
              entryAmount: dollarsToCents(parseStringToNumber(cleanEntryAmount))
            }
          })

      // Handle transactionAmount
      } else if (key === 'transactionAmount') {
        const trxAmount = sanitizeWithPreset({
          input: dataPoint,
          preset: 'number'
        })

        trxAcc[key] = dollarsToCents(parseStringToNumber(trxAmount))

      // Handle other transaction keys
      } else {
        trxAcc[key] = dataPoint.trim()
      }

      return trxAcc
    }, {})

    return [...trxsAcc, trx]
  }, [])
}
