import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

const columns = [
  {
    id: 'symbol',
    label: 'Symbol',
    minWidth: 90,
    align: 'right',
  },
  { id: 'shares', 
    label: 'Shares', 
    minWidth: 100,
    align: 'right',
    format: (value) => value.toLocaleString('en-US'),
  },
  { id: 'buyPrice', 
    label: 'Buy\u00a0Price', 
    minWidth: 90,
    align: 'right', 
    format: (value) => (value / 100).toFixed(2),
  },
  {
    id: 'nowPrice',
    label: 'Price\u00a0Now',
    minWidth: 90,
    align: 'right',
    format: (value) => (value / 100).toFixed(2),
  },
  {
    id: 'returnValue',
    label: 'Return',
    minWidth: 100,
    align: 'right',
    format: (value) => (value / 100).toFixed(2),
  },
  {
    id: 'timestamp',
    label: 'Timestamp',
    minWidth: 190,
  },
];

function createData(symbol, shares, buyPrice, nowPrice, returnValue) {
  const timestamp = (new Date()).toLocaleString();
  return { symbol, shares, buyPrice, nowPrice, returnValue, timestamp };
}

const rows = [
  createData('TSLA', 3025, 391, 354, 32263),
  createData('TSLA', 3025, 391, 354, 32263),
  createData('TSLA', 3025, 391, 354, 32263),
  createData('AAPL', 50, 11, 65, 95961),
  createData('AAPL', 50, 11, 65, 95961),
  createData('MSFT', 2599, 208, 973, 3013),
  createData('NVDA', 120, 415, 434, 98330),
  createData('NVDA', 120, 415, 434, 98330),
  createData('NVDA', 120, 415, 434, 98330),
  createData('AMD', 9, 52, 103, 99870),
  createData('AMZN', 100, 1057, 400, 76924),
  createData('BTC', 207, 3108, 200, 3578),
  createData('ETH', 207, 3108, 200, 3578),
];

export const IndividualAssets = () => {

  return (

    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer component={Paper} sx={{ maxHeight: 450}}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .map((row, idx) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={idx}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === 'number'
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      </Paper>
    );
}