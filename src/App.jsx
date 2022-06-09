import {
  Avatar,
  Box,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  IconButton,
  ListItemSecondaryAction,
} from "@mui/material";
import "./App.css";

import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import DirectionsIcon from "@mui/icons-material/Directions";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";

import { useImmer } from "use-immer";

import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Masonry from "@mui/lab/Masonry";

import items from "./items";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useEffect } from "react";
import React from "react";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const SnackbarAlert = ({ message }) => {
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    if (message) {
      setOpen(true);
    }
  }, [message]);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
      <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(0.5),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const Image = styled("img")({
  width: "100%",
  maxHeight: "600px",
  objectFit: "cover",
  objectPosition: "center",
  borderRadius: "5px",
  marginBottom: "10px",
});

function App() {
  const [cart, setCart] = useImmer([]);

  const [search, setSearch] = useImmer("");
  const [priceFilter, setPriceFilter] = useImmer("[0,600]");

  const [message, setMessage] = useImmer("");

  const addToCart = (item) => {
    if (itemIsInCart(item)) {
      // increase quantity
      setCart((draftCart) => {
        const cartItem = draftCart.find(
          (cartItem) => cartItem.title === item.title
        );
        cartItem.quantity += 1;
      });
    } else {
      // add item to cart
      setCart((draftCart) => [...draftCart, { ...item, quantity: 1 }]);
    }
    setMessage(`${item.title} added to cart`);
  };

  const itemIsInCart = (item) => {
    return cart.find((cartItem) => cartItem.title === item.title);
  };

  const removeFromCart = (item) => {
    setCart((draftCart) => {
      return draftCart.filter((cartItem) => cartItem.title !== item.title);
    });
    setMessage(`${item.title} removed from cart`);
  };

  let filteredItems = items
    .filter((item) => {
      return item.title.toLowerCase().includes(search.toLowerCase());
    })
    .filter((item) => {
      if (priceFilter === undefined) {
        return item;
      } else {
        return (
          item.price >= JSON.parse(priceFilter)[0] &&
          item.price <= JSON.parse(priceFilter)[1]
        );
      }
    });

  return (
    <Box>
      <Typography variant="h3">Shop</Typography>
      <SnackbarAlert message={message} />

      <Paper
        component="form"
        sx={{
          p: "2px 4px",
          display: "flex",
          alignItems: "center",
          width: 600,
          marginBottom: "10px",
        }}
      >
        <InputBase
          sx={{ ml: 1, flex: 2 }}
          placeholder="Search Items"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <IconButton type="submit" sx={{ p: "10px" }} aria-label="search">
          <SearchIcon />
        </IconButton>

        <FormControl
          sx={{
            flex: 1,
            marginLeft: "10px",
          }}
        >
          <InputLabel id="demo-simple-select-label">Price</InputLabel>
          <Select
            label="Price"
            value={priceFilter}
            onChange={(e) => setPriceFilter(e.target.value)}
          >
            <MenuItem value={"[60, 100]"}>60-100$</MenuItem>
            <MenuItem value={"[100, 200]"}>100-200$</MenuItem>
            <MenuItem value={"[0,600]"}>Any</MenuItem>
          </Select>
        </FormControl>
      </Paper>

      <Grid container spacing={2}>
        <Grid item xs={9}>
          <Masonry>
            {filteredItems.map((item) => (
              <Item
                key={item.title}
                onClick={() => {
                  addToCart(item);
                }}
              >
                <Image src={"./" + item.image} alt={item.title} />
                <Typography variant="h5">{item.title}</Typography>
                <Typography variant="h6">{item.price}</Typography>
              </Item>
            ))}
          </Masonry>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="h4">Cart</Typography>
          <List>
            {cart.map((item) => (
              <ListItem key={item.title}>
                <ListItemAvatar>
                  <Avatar src={"./" + item.image} />
                </ListItemAvatar>

                <ListItemText
                  primary={item.title}
                  secondary={item.price + " x " + item.quantity}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => {
                      removeFromCart(item);
                    }}
                  >
                    <RemoveCircleIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
            <ListItem>
              <Typography variant="h6">
                Total:{" "}
                {cart
                  .reduce((acc, item) => {
                    return acc + item ? +item.price * item.quantity : 0;
                  }, 0)
                  .toFixed(2)}
              </Typography>
            </ListItem>
          </List>
        </Grid>
      </Grid>
    </Box>
  );
}

export default App;
