export const Transactioncolumns = [
  {
    field: 'branche.BrancheName',
    title: 'From Branch',
    width: '185px',
    filter: 'text',
    resizable: true,
    cell: 'BrancheCell'
  },
  {
    field: 'Number',
    title: 'Numéro',
    width: '130px',
    resizable: true,
    filter: 'text',
    cell: 'NumberCell'
  },
  {
    field: 'Amount',
    title: 'Amount',
    width: '185px',
    resizable: true,
    filter: 'numeric'
  },
  {
    field: 'user_type.UserTypeName',
    title: 'Type',
    width: '185px',
    filter: 'text',
    resizable: true,
    cell: 'TypeCell'
  },
  {
    field: 'currency.CurrencyCode',
    title: 'Currency',
    filter: 'text',
    width: '185px',
    cell: 'CurrencyCell',
    resizable: true
  },
  { field: 'Note', title: 'Notes', width: '185px', resizable: true, filter: 'text' },
  {
    field: 'DateMovemented',
    title: 'DateMovemented',
    width: '190px',
    editable: false,
    resizable: true
  },
  {
    field: 'Sent',
    title: 'Sent',
    width: '115px',
    cell: 'SendCell',
    resizable: true
  },
  { field: 'Response', title: 'Response', width: '115x', resizable: true, cell: 'ResponceCell' },
  { field: 'Remove', title: 'Remove', width: '120px', resizable: true, cell: 'RemoveCell' }
]
