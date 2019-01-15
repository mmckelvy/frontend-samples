import test from 'tape'

import replaceWithBalance from './replace-with-balance'

test('replaceWithBalance -- Should replace with balance', function(t) {
  const metric = {
    calculation: '{assets.cash} + {assets.accounts_receivable} - {liabilities.debt} - {liabilities.payables}'
  }

  const accounts = [
    {
      accountName: 'assets.cash',
      balance: 5000
    },
    {
      accountName: 'assets.accounts_receivable',
      balance: 2000
    },
    {
      accountName: 'liabilities.debt',
      balance: 3400
    },
    {
      accountName: 'liabilities.payables',
      balance: 1500
    }
  ]

  t.equal(
    replaceWithBalance({metric, accounts}),
    '50 + 20 - 34 - 15',
  )

  t.end()
})

test('replaceWithBalance -- Handle partials', function(t) {
  const metric = {
    calculation: '{assets.cash} + {assets.accounts_receivable.*.foo} - {liabilities.debt} - {liabilities.payables}'
  }

  const accounts = [
    {
      accountName: 'assets.cash',
      balance: 5000
    },
    {
      matchName: 'assets.accounts_receivable.*.foo',
      balance: 2000
    },
    {
      accountName: 'liabilities.debt',
      balance: 3400
    },
    {
      accountName: 'liabilities.payables',
      balance: 1500
    }
  ]

  t.equal(
    replaceWithBalance({metric, accounts}),
    '50 + 20 - 34 - 15',
  )

  t.end()
})
