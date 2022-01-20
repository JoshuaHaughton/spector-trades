import { Tab, Tabs } from '@mui/material';

import { useState } from 'react';
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
    format: (value) => (value / 100).toFixed(2),
  },
];

function createData(quantity, buyPrice, date) {
  const timestamp = (new Date()).toLocaleString();
  return { quantity, buyPrice, date};
}

const rows = [
  createData(3025, 391, 354),
  createData(50, 11, 65),
  createData(2599, 208, 973),
  createData(120, 415, 434),
  createData(9, 52, 103),
  createData(100, 1057, 400),
  createData(207, 3108, 200),
];

export const GroupedAssets = ({assets}) => {
  const grouped = {};
  assets.forEach(a => {
    if (!grouped[a.name]) {
      grouped[a.name] = []
    }
    grouped[a.name].push(a);
  });

  // Need to handle errors if there are no assets in portfolio!
  // Next step is make tabs a component and conditionally render it

  
  //const rows = grouped[value].map(asset => createData(asset.units, asset.price_at_purchase, asset.created_at));
  
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
      <GroupedAssetsTabs assets={Object.keys(grouped)} />
      </Paper>
    );
}