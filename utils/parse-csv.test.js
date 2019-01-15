import test from 'tape'

import parseCsv from './parse-csv'

test('parseCsv -- Parse a CSV string', function(t) {
  const csvString = `Date,Amount,Party,Tags,General ledger entries,Business purpose,Attendees,Notes
2018-02-17,10,Quality LLC,,credit:Liabilities.Payables.John Smith:10;debit:Expenses.Rent.John Smith:10,Engage in commerce,Buzz English Marketing,Some very important notes
2018-01-24,20,Quality LLC,ocean,credit:Assets.Accounts Receivable:20;debit:Assets.Cash:20;,Engage in commerce,Buzz English Marketing,Some very important notes`

  const actual = parseCsv(csvString)
  const expected = [
    {
      transactionDate: '2018-02-17',
      transactionAmount: 1000,
      partyName: 'Quality LLC',
      tags: [],
      glEntries: [
        {
          entryName: 'credit',
          displayName: 'Liabilities.Payables.John Smith',
          accountName: 'liabilities.payables.john_smith',
          entryAmount: 1000
        },
        {
          entryName: 'debit',
          displayName: 'Expenses.Rent.John Smith',
          accountName: 'expenses.rent.john_smith',
          entryAmount: 1000
        }
      ],
      businessPurpose: 'Engage in commerce',
      attendees: 'Buzz English Marketing',
      notes: 'Some very important notes'
    },
    {
      transactionDate: '2018-01-24',
      transactionAmount: 2000,
      partyName: 'Quality LLC',
      tags: ['ocean'],
      glEntries: [
        {
          entryName: 'credit',
          displayName: 'Assets.Accounts Receivable',
          accountName: 'assets.accounts_receivable',
          entryAmount: 2000
        },
        {
          entryName: 'debit',
          displayName: 'Assets.Cash',
          accountName: 'assets.cash',
          entryAmount: 2000
        }
      ],
      businessPurpose: 'Engage in commerce',
      attendees: 'Buzz English Marketing',
      notes: 'Some very important notes'
    },
  ]


  t.deepEqual(
    actual,
    expected
  )

  t.end()
})

test('parseCsv -- Parse a CSV string with extras', function(t) {
  const csvString = `Date,Amount,Party,Tags,General ledger entries,Business purpose,Attendees,Notes
2018-02-17,10,Quality LLC,,credit:Liabilities.Payables.John Smith:10;debit:Expenses.Rent.John Smith:10,Engage in commerce,Buzz English Marketing,Some very important notes,,
2018-01-24,20.5,Quality LLC,ocean,credit:Assets.Accounts Receivable:20.5;debit:Assets.Cash:20.5;,Engage in commerce,Buzz English Marketing,Some very important notes
,,,,,,,,,`

  const actual = parseCsv(csvString)
  const expected = [
    {
      transactionDate: '2018-02-17',
      transactionAmount: 1000,
      partyName: 'Quality LLC',
      tags: [],
      glEntries: [
        {
          entryName: 'credit',
          displayName: 'Liabilities.Payables.John Smith',
          accountName: 'liabilities.payables.john_smith',
          entryAmount: 1000
        },
        {
          entryName: 'debit',
          displayName: 'Expenses.Rent.John Smith',
          accountName: 'expenses.rent.john_smith',
          entryAmount: 1000
        }
      ],
      businessPurpose: 'Engage in commerce',
      attendees: 'Buzz English Marketing',
      notes: 'Some very important notes'
    },
    {
      transactionDate: '2018-01-24',
      transactionAmount: 2050,
      partyName: 'Quality LLC',
      tags: ['ocean'],
      glEntries: [
        {
          entryName: 'credit',
          displayName: 'Assets.Accounts Receivable',
          accountName: 'assets.accounts_receivable',
          entryAmount: 2050
        },
        {
          entryName: 'debit',
          displayName: 'Assets.Cash',
          accountName: 'assets.cash',
          entryAmount: 2050
        }
      ],
      businessPurpose: 'Engage in commerce',
      attendees: 'Buzz English Marketing',
      notes: 'Some very important notes'
    },
  ]

  t.deepEqual(
    actual,
    expected
  )

  t.end()
})
