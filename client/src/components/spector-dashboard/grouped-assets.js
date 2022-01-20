import { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import { GroupedAssetsTabs } from './grouped-assets-tabs';

const columns = [
  { id: 'quantity', 
    label: 'Quantity', 
    minWidth: 100,
    align: 'right',
    format: (value) => value.toLocaleString('en-US'),
  },
  { id: 'buyPrice', 
    label: 'Price', 
    minWidth: 90,
    align: 'right', 
    format: (value) => (value / 100).toFixed(2),
  },
  {
    id: 'date',
    label: 'Date',
    minWidth: 90,
    align: 'right',
    format: (value) => new Date(value),
  },
];

function createData(quantity, buyPrice, timestamp) {
  const date = new Date(timestamp).toLocaleString('en-US');
  return { quantity, buyPrice, date};
}

const createGroupedAssets = (assets) => {
  const grouped = {};
  assets.forEach(a => {
    if (!grouped[a.name]) {
      grouped[a.name] = []
    }
    grouped[a.name].push(a);
  });
  return grouped;
};

export const GroupedAssets = ({assets}) => {
  
  const grouped = createGroupedAssets(assets);
  const [name, setName] = useState(Object.keys(grouped)[0]);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const grouped = createGroupedAssets(assets);

    // I suspect this is doing the flickering after switching portfolios
    let newRows = [];
    if (grouped[name]) {
      newRows = grouped[name].map(asset => createData(asset.units, asset.price_at_purchase, asset.created_at));
    }
    setRows(() => newRows);
    if (!Object.keys(grouped).includes(name)) {
      setName(Object.keys(grouped)[0]);
    }
  }, [assets, name]);


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
      <GroupedAssetsTabs assets={Object.keys(grouped)} name={name} setName={setName} />
      </Paper>
    );
}