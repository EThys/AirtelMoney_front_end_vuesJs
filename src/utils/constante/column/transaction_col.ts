export const Transactioncolumns = [
  {
    field: 'branche.BrancheName',
    title: 'From Branch',
    width: '185px',
    filter: 'text',
    resizable: true,
    cell: 'BrancheCell',
    ClassName: 'sty'
  },
  {
    field: 'Number',
    title: 'Numéro',
    width: '185px',
    resizable: true,
    filter: 'text',
    cell: 'NumberCell',
    ClassName: 'sty'
  },
  {
    field: 'Amount',
    title: 'Amount',
    width: '185px',
    resizable: true,
    filter: 'text',
    ClassName: 'sty',
    cell: 'AmountCell'
  },
  {
    field: 'user_type.UserTypeName',
    title: 'Type',
    width: '185px',
    filter: 'text',
    resizable: true,
    cell: 'TypeCell',
    ClassName: 'sty'
  },
  {
    field: 'currency.CurrencyCode',
    title: 'Currency',
    filter: 'text',
    width: '185px',
    cell: 'CurrencyCell',
    resizable: true,
    ClassName: 'sty'
  },
  {
    field: 'Note',
    title: 'Notes',
    width: '185px',
    resizable: true,
    filter: 'text',
    ClassName: 'sty',
    cell: 'NoteCell'
  },
  {
    field: 'DateMovemented',
    title: 'Date',
    width: '150px',
    editable: false,
    resizable: true,
    ClassName: 'sty'
  },
  {
    field: 'Sent',
    title: 'Sent',
    width: '120px',
    cell: 'SendCell',
    resizable: true,
    ClassName: 'sty'
  },
  {
    field: 'Response',
    title: 'Response',
    width: '120px',
    resizable: true,
    cell: 'ResponceCell',
    ClassName: 'sty'
  },
  {
    field: 'Remove',
    title: 'Remove',
    width: '120px',
    resizable: true,
    cell: 'RemoveCell',
    ClassName: 'sty'
  }
]
