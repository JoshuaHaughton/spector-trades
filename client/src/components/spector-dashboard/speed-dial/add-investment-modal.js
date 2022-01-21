import api from "../../../apis/api";
import { useCookies } from 'react-cookie';
import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  Divider,
  Typography,
  Modal,
  TextField,
} from "@mui/material";

// react window optimization
import * as React from 'react';
import PropTypes from 'prop-types';
import Autocomplete, { autocompleteClasses } from '@mui/material/Autocomplete';
import useMediaQuery from '@mui/material/useMediaQuery';
import ListSubheader from '@mui/material/ListSubheader';
import Popper from '@mui/material/Popper';
import { useTheme, styled } from '@mui/material/styles';
import { VariableSizeList } from 'react-window';

import {coinsList} from "../../../__mocks__/coins-list";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "100%",
  maxWidth: 600,
  bgcolor: "background.paper",
  border: "1px solid #555",
  boxShadow: 24,
  borderRadius: "8px",
};

// TODO: FIND API TO GENERATE THIS DATA
// const assetItems = [
//   { code: 'AAPL', type: 'Stocks', label: 'AAPL - Apple Inc. Common Stock - $168.74', price: 16874},
//   { code: 'MSFT', type: 'Stocks', label: 'MSFT - Microsoft Corporation Common Stock - $309.53', price: 30953},
//   { code: 'GOOG', type: 'Stocks', label: 'GOOG - Alphabet Inc. Class C Capital Stock - $2760.66', price: 276066},
//   { code: 'AMZN', type: 'Stocks', label: 'AMZN - Amazon.com, Inc. Common Stock - $3161.00', price: 316100},
//   { code: 'TSLA', type: 'Stocks', label: 'TSLA - Tesla, Inc. Common Stock - $1016.00', price: 101600},
// ];

// react-window optimization
const LISTBOX_PADDING = 8; // px

function renderRow(props) {
  const { data, index, style } = props;
  const dataSet = data[index];
  const inlineStyle = {
    ...style,
    top: style.top + LISTBOX_PADDING,
  };

  if (dataSet.hasOwnProperty('group')) {
    return (
      <ListSubheader key={dataSet.key} component="div" style={inlineStyle}>
        {dataSet.group}
      </ListSubheader>
    );
  }

  return (
    <Typography component="li" {...dataSet[0]} noWrap style={inlineStyle}>
      {dataSet[1]}
    </Typography>
  );
}

const OuterElementContext = React.createContext({});

const OuterElementType = React.forwardRef((props, ref) => {
  const outerProps = React.useContext(OuterElementContext);
  return <div ref={ref} {...props} {...outerProps} />;
});

function useResetCache(data) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (ref.current != null) {
      ref.current.resetAfterIndex(0, true);
    }
  }, [data]);
  return ref;
}

// Adapter for react-window
const ListboxComponent = React.forwardRef(function ListboxComponent(props, ref) {
  const { children, ...other } = props;
  const itemData = [];
  children.forEach((item) => {
    itemData.push(item);
    itemData.push(...(item.children || []));
  });

  const theme = useTheme();
  const smUp = useMediaQuery(theme.breakpoints.up('sm'), {
    noSsr: true,
  });

  const itemCount = itemData.length;
  const itemSize = smUp ? 36 : 48;

  const getChildSize = (child) => {
    if (child.hasOwnProperty('group')) {
      return 48;
    }

    return itemSize;
  };

  const getHeight = () => {
    if (itemCount > 8) {
      return 8 * itemSize;
    }
    return itemData.map(getChildSize).reduce((a, b) => a + b, 0);
  };

  const gridRef = useResetCache(itemCount);

  return (
    <div ref={ref}>
      <OuterElementContext.Provider value={other}>
        <VariableSizeList
          itemData={itemData}
          height={getHeight() + 2 * LISTBOX_PADDING}
          width="100%"
          ref={gridRef}
          outerElementType={OuterElementType}
          innerElementType="ul"
          itemSize={(index) => getChildSize(itemData[index])}
          overscanCount={5}
          itemCount={itemCount}
        >
          {renderRow}
        </VariableSizeList>
      </OuterElementContext.Provider>
    </div>
  );
});

const StyledPopper = styled(Popper)({
  [`& .${autocompleteClasses.listbox}`]: {
    boxSizing: 'border-box',
    '& ul': {
      padding: 0,
      margin: 0,
    },
  },
});

// react-window optimization

console.log('how many coins? ', coinsList.length);
const assetItems = coinsList.map(c => ({code: c.symbol, type: 'Cryptocurrency', label: `${c.symbol} - ${c.name}`, price: 1000}));

export const AddInvestmentModal = ({ open, handleClose, portfolios, refreshDashboardState }) => {
  const [cookies, setCookie] = useCookies(['spector_jwt']);
  const [portfolioSelection, setPortfolioSelection] = useState(null);
  const [info, setInfo] = useState({visibility: 'hidden',
                                    severity: 'info',
                                    message: ''});
  const [totalValue, setTotalValue] = useState(0);
  const [assetSelection, setAssetSelection] = useState({});
  const [assetQuantity, setAssetQuantity] = useState(0);
  const [exitPoint, setExitPoint] = useState('');

  const portfolioItems = portfolios.map(p => ({id: p.id, label: p.name, live: p.live}));

  useEffect(() => {
    if (assetSelection && assetSelection['price']) {
      setTotalValue(assetSelection.price * assetQuantity);
    } else {
      setTotalValue(0);
    }
  }, [assetSelection, assetQuantity]);

  const resetForm = () => {
    setPortfolioSelection(null);
    setTotalValue(0);
    setAssetSelection(null);
    setAssetQuantity(0);
    setExitPoint(0);
    setInfo({visibility: 'hidden',
      severity: 'info',
      message: ''});
  };

  const resetBeforeClose = () => {
    resetForm();
    handleClose();
  }

  const handleSubmit = () => {
    if (!portfolioSelection) {
      setInfo({visibility: 'visible', severity: 'error', message: 'Must select portfolio!'});
    } else if (!assetSelection) {
      setInfo({visibility: 'visible', severity: 'error', message: 'Must select asset!'});
    } else if (assetQuantity < 1) {
      setInfo({visibility: 'visible', severity: 'error', message: 'Asset quantity must be at least 1!'});
    } else {
      const data = {
        name: portfolioSelection.label, 
        live: portfolioSelection.live, 
        asset: assetSelection.code, 
        type: assetSelection.type,
        exit_point: exitPoint,
        units: assetQuantity,
        price_at_purchase: assetSelection.price,
        sold: false,
      };
      const token = cookies.spector_jwt;
      const config = {
        headers: { Authorization: `Bearer ${token}`}
      };
      api.post('/orders', data, config).then(res => {
        refreshDashboardState();
        resetBeforeClose();
      }).catch(err => {
        console.log('error in posting asset order: ', err)
        resetBeforeClose();
      });
    }
  };

  return (
    <Modal
      open={open}
      onClose={resetBeforeClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      disableRestoreFocus
    >
      <Card
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box sx={style}>
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
            <Typography
              color="textSecondary"
              display="inline"
              variant="h5"
            >
              New Investment
            </Typography>
          </Box>
          <Divider />

          <Box sx={{ display:'flex', p: 2, justifyContent: 'center' }}>

            <Autocomplete 
              disablePortal
              id="portfolio-select"
              options={portfolioItems}
              sx={{ width: 250 }}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderInput={
                (params) => <TextField variant="standard" {...params} label="Portfolio" />
              }
              onChange={(_event, value) => {
                setPortfolioSelection(value);
              }}
            />

          </Box>

          <Box sx={{ display:'flex', p: 2, justifyContent: 'center', gap: 2 }}>

            <Autocomplete 
              disablePortal
              disableListWrap
              id="asset-select"
              options={assetItems}
              sx={{ width: 300 }}
              isOptionEqualToValue={(option, value) => option.label === value.label}
              renderInput={(params) => <TextField variant="standard" {...params} label="Asset" />}
              PopperComponent={StyledPopper}
              ListboxComponent={ListboxComponent}
              renderOption={(props, option) => [props, option.label]}
              renderGroup={(params) => params}
              onChange={(_event, value) => {
                setAssetSelection(value);
              }}
            />

            <TextField variant="standard" 
              id="quantity"
              placeholder="1"
              label="Quantity"
              onBlur={(event) => setAssetQuantity(prev => {
                  // Ensures the input is a number
                  if (isNaN(event.target.value)) {
                    event.target.value = prev;
                    return prev;
                  }
                  return Number(event.target.value);
                }
              )}
            />  

          </Box>

          <Box sx={{ display:'flex', p: 2, justifyContent: 'center' }}>
            <TextField
              id="exit-point"
              label="Exit Point"
              placeholder="1"
              variant="standard"
              onBlur={(event) => setExitPoint(prev => {
                  // Ensures the input is a number
                  if (isNaN(event.target.value)) {
                    event.target.value = prev;
                    return prev;
                  }
                  return Number(event.target.value);
                }
              )}
            />
          </Box>

          <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
            <Typography
              color="textSecondary"
              display="inline"
              variant="h5"
            >
              Total: ${(totalValue / 100).toFixed(2)}
            </Typography>
          </Box>

          {/* THE INFOBOX */}
          <Alert sx={{ visibility: info.visibility }} severity={info.severity}>{info.message}</Alert>
   
          <Divider />
          <Box sx={{ display:'flex', p: 2, justifyContent: 'center' }}>
              <Button onClick={handleSubmit} variant="outlined">Create</Button>
          </Box>
        </Box>
      </Card>
    </Modal>
  );
  
}