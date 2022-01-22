import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import axios from 'axios';

const columns = [
  {
    id: 'symbol',
    label: 'Name',
    minWidth: 90,
    align: 'right',
  },
  { id: 'totalValue', 
    label: 'Total\u00a0Value', 
    minWidth: 90,
    align: 'right', 
    format: (value) => (value / 100).toFixed(2),
  },
  { id: 'quantity', 
    label: 'Quantity', 
    minWidth: 100,
    align: 'right',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'avgPrice',
    label: 'Avg\u00a0Price',
    minWidth: 90,
    align: 'right',
    format: (value) => (value / 100).toFixed(2),
  },
  {
    id: 'plusMinusToday',
    label: '+ / -',
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

function createData(name, symbol, type, priceAtPurchase, quantity, createdAt) {
  const timestamp = new Date(createdAt).toLocaleString("en-US");
  const totalValue = priceAtPurchase * quantity;
  const avgPrice = priceAtPurchase;
  const plusMinusToday = 0; // Placeholder
  return { name, symbol, type, totalValue, quantity, avgPrice, plusMinusToday, timestamp };
}

export const IndividualAssets = ({assets, createAssetGraphData}) => {
  const rows = assets.map(a => createData(a.name, a.symbol, a.type, a.price_at_purchase, a.units, a.created_at));
  const handleClick = (row) => {
    if (row.type === "Cryptocurrency") {
      console.log(row);

      axios.post('/api/crypto-history', {id: row.name.toLowerCase()}).then(res => {
        if (res.data['prices']) {
          createAssetGraphData(res.data.prices);
        }
      });

    }
    // createAssetGraphData
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer component={Paper} sx={{ height: 450}}>
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
                  <TableRow hover role="checkbox" tabIndex={-1} key={idx} onClick={() => handleClick(row)}  >
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