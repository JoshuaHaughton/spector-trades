// react window optimization
import * as React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import Autocomplete, { autocompleteClasses } from '@mui/material/Autocomplete';
import useMediaQuery from '@mui/material/useMediaQuery';
import ListSubheader from '@mui/material/ListSubheader';
import Popper from '@mui/material/Popper';
import { useTheme, styled } from '@mui/material/styles';
import { VariableSizeList } from 'react-window';

import {coinsList} from "../../../__mocks__/coins-list";
import { TextField, Typography } from '@mui/material';

// react-window optimization START
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

// react-window optimization END

const assetItems = coinsList.map(c => ({id: c.id, code: c.symbol.toUpperCase(), type: 'Cryptocurrency', label: `${c.symbol.toUpperCase()} - ${c.name}`, price: 1000}));

export const CryptoAutoComplete = ({setAssetSelection}) => {
  const [priceHelperText, setPriceHelperText] = React.useState(" ");

  return (
    <Autocomplete 
    disablePortal
    disableListWrap
    id="asset-select"
    options={assetItems}
    sx={{ width: 300 }}
    isOptionEqualToValue={(option, value) => option.label === value.label}
    renderInput={(params) => <TextField variant="standard" helperText={priceHelperText} {...params} label="Asset" />}
    PopperComponent={StyledPopper}
    ListboxComponent={ListboxComponent}
    renderOption={(props, option) => [props, option.label]}
    renderGroup={(params) => params}
    onChange={(_event, value) => {
      if (value !== null) {
        axios.post('/api/crypto', {id: value.id}).then(res => {
          const price = Object.values(res.data)[0]['cad'];
          value.price = price * 100;
          setAssetSelection(value);
          setPriceHelperText(price);
        });
      } else {
        setAssetSelection(null);
        setPriceHelperText(" ");
      }
    }}
  />
  );
};