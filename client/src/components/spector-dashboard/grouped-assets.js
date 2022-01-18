import { Tab, Tabs } from '@mui/material';

import { useState } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

const columns = [
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

function createData(shares, buyPrice, nowPrice, returnValue) {
  const timestamp = (new Date()).toLocaleString();
  return { shares, buyPrice, nowPrice, returnValue, timestamp };
}

const rows = [
  createData(3025, 391, 354, 32263),
  createData(50, 11, 65, 95961),
  createData(2599, 208, 973, 3013),
  createData(120, 415, 434, 98330),
  createData(9, 52, 103, 99870),
  createData(100, 1057, 400, 76924),
  createData(207, 3108, 200, 3578),
];

export const GroupedAssets = () => {
  const [value, setValue] = useState(0);
  
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

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
      <Tabs
        value={value}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="scrollable auto tabs example"
      >
          <Tab label="Item One" />
          <Tab label="Item Two" />
          <Tab label="Item Three" />
          <Tab label="Item Four" />
          <Tab label="Item Five" />
          <Tab label="Item Six" />
          <Tab label="Item Seven" />
        </Tabs>
      </Paper>
    );
}