export const Transactioncolumns = [
  {
    field: 'branche.BrancheName',
    title: 'From Branch',
    width: '185px',
    filter: 'text',
    resizable: true,
    cell: 'BrancheCell'
  },
  { field: 'Number', title: 'Numéro', width: '130px', resizable: true, filter: 'text' },
  { field: 'Amount', title: 'Amount', width: '185px', resizable: true, filter: 'numeric' },
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
    width: '185px',
    editor: 'date',
    resizable: true,
    filter: 'text'
  },
  {
    field: 'Send',
    title: 'Send',
    width: '120px',
    resizable: true
  },
  { field: 'Response', title: 'Response', width: '120x', resizable: true },
  { field: 'Remove', title: 'Remove', width: '120px', resizable: true, cell: 'RemoveCell' }
]
