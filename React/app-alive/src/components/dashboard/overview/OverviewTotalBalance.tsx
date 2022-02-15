import type { FC } from 'react';
import numeral from 'numeral';
import {
  Badge,
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography
} from '@material-ui/core';

interface Currency {
  amount: number;
  color: string;
  name: string;
}

const currencies: Currency[] = [
  {
    amount: 1234,
    color: '#6C76C4',
    name: 'TIMP3.SA'
  },
  {
    amount: 5441,
    color: '#33BB78',
    name: 'USIM5.SA'
  },
  {
    amount: 1076.81,
    color: '#FF4081',
    name: 'PETR4.SA'
  }
];

const OverviewTotalBalance: FC = (props) => (
  <Card {...props}>
    <CardHeader
      subheader={(
        <Typography
          color="textPrimary"
          variant="h4"
        >
          {numeral(3787681).format('$0,0.00')}
        </Typography>
      )}
      sx={{ pb: 0 }}
      title={(
        <Typography
          color="textSecondary"
          variant="overline"
        >
          Total na carteira
        </Typography>
      )}
    />
    <CardContent>
      <Divider sx={{ mb: 2 }} />
      <Typography
        color="textSecondary"
        variant="overline"
      >
        Ações atualmente
      </Typography>
      <List
        disablePadding
        sx={{ pt: 2 }}
      >
        {currencies.map((currency) => (
          <ListItem
            disableGutters
            key={currency.name}
            sx={{
              pb: 2,
              pt: 0
            }}
          >
            <ListItemText
              disableTypography
              primary={(
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}
                >
                  <Badge
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'left'
                    }}
                    variant="dot"
                    sx={{
                      pl: '20px',
                      '& .MuiBadge-badge': {
                        backgroundColor: currency.color,
                        left: 6,
                        top: 11
                      }
                    }}
                  >
                    <Typography
                      color="textPrimary"
                      variant="subtitle2"
                    >
                      {currency.name}
                    </Typography>
                  </Badge>
                  <Typography
                    color="textSecondary"
                    variant="subtitle2"
                  >
                    {numeral(currency.amount)
                      .format('$0,0.00')}
                  </Typography>
                </Box>
              )}
            />
          </ListItem>
        ))}
      </List>
    </CardContent>
  </Card>
);

export default OverviewTotalBalance;
