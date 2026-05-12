import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import { BURGER_LAYERS, PRICE_MAP,PLATFORM_FEE,} from "../src/utils/constants";
const App = () => {
  const [burgerSlices, setBurgerSlices] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const addSlice = (slice) => {
    if (burgerSlices.length >= 10) {
      toast.warning("Maximum 10 slices allowed");
      return;
    }
    setBurgerSlices([...burgerSlices, slice]);
  };
  const removeSlice = (index) => {
    const updated = [...burgerSlices];

    updated.splice(index, 1);

    setBurgerSlices(updated);
  };

  const totalPrice = useMemo(() => {
    let total = 0;

    burgerSlices.forEach((slice) => {
      total += PRICE_MAP[slice] || 0;
    });
    if (burgerSlices.includes("Paneer") && burgerSlices.includes("Cheese")) 
    {
        total -= 3;
    }

    for (let i = 0; i < burgerSlices.length - 1; i++)
    {
        if (burgerSlices[i] === "Aloo Tikki" && burgerSlices[i + 1] === "Aloo Tikki") 
        {
          total += 2;
        }
    }
    return (total + PLATFORM_FEE) * quantity;
  }, [burgerSlices, quantity]);
  const moveUp = (index) => {
    if (index === 0) return;

    const updated = [...burgerSlices];

    [updated[index], updated[index - 1]] = [updated[index - 1], updated[index]];

    setBurgerSlices(updated);
  };

  const moveDown = (index) => {
    if (index === burgerSlices.length - 1) return;

    const updated = [...burgerSlices];

    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];

    setBurgerSlices(updated);
  };
  const placeOrder = async () => {
    try {
      if (burgerSlices[0] !== "Bread") {
        toast.error("Burger must start with Bread");
        return;
      }

      if (burgerSlices[burgerSlices.length - 1] !== "Bread") {
        toast.error("Burger must end with Bread");
        return;
      }
      if (burgerSlices.length >= 10) {
        toast.error("Maximum 10 burger layers allowed");
        return;
      }
      if (!customerName) {
        toast.error("Please enter customer name");
        return;
      }

      if (!mobileNumber) {
        toast.error("Please enter mobile number");
        return;
      }
      if (!/^[6-9][0-9]{9}$/.test(mobileNumber)) {
        toast.error("Enter valid 10-digit mobile number");
        return;
      }
      if (burgerSlices.length === 0) {
        toast.error("Please add at least one burger layer");
        return;
      }
      if (address.length < 5) {
        toast.error("Address must be at least 5 characters");
        return;
      }
      if (!paymentMethod) {
        toast.error("Please select payment method");
        return;
      }
      for (let i = 1; i < burgerSlices.length - 1; i++) {
        if (burgerSlices[i] === "Bread") {
          toast.error("Bread cannot be in middle");
          return;
        }
      }

      setLoading(true);

      const response = await axios.post("http://localhost:8080/api/orders/create",
        {
          customerName,
          mobileNumber,
          address,
          paymentMethod,
          quantity,
          slices: burgerSlices,
          totalPrice,
        },
      );

      console.log("ORDER SUCCESS:", response.data);
      toast.success("Order Placed Successfully");
      setCustomerName("");
      setMobileNumber("");
      setAddress("");
      setBurgerSlices([]);
      setPaymentMethod("");
      setQuantity(1);
    } catch (err) {
      console.log(err);
      toast.error("Order failed to place. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        textAlign: "center",
        mb: 4,
        py: 2,
      }}
    >
      <ToastContainer position="top-right" autoClose={3000} />
      <Container maxWidth="lg">
        <Typography
          variant="h2"
          fontWeight="bold"
          sx={{
            fontSize: {
              xs: "2.5rem",
              md: "4rem",
            },
            letterSpacing: 1,
          }}
        >
          🍔{" "}
          <Box
            component="span"
            sx={{
              background: "linear-gradient(to right, #ff6b35, #ff8e53)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Burger Builder
          </Box>
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: "#5f5f5f",
            mt: 0.5,
            mb: 1,
            ml: 10,
            fontWeight: 400,
            textAlign: "center",
          }}
        >
          Create your dream burger with live pricing
        </Typography>
        <Grid container spacing={4} alignItems="flex-start">
          <Grid item xs={12} md={5}>
            <Card
              sx={{
                borderRadius: 5,
                boxShadow: 10,
                background: "white",
              }}
            >
              <CardContent>
                <Typography variant="h5" fontWeight="bold" mb={3}>
                  Burger Layers
                </Typography>
                <Stack spacing={2}>
                  {BURGER_LAYERS.map((item) => (
                    <Paper
                      key={item.name}
                      elevation={3}
                      sx={{
                        p: 2,
                        borderRadius: 4,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Box>
                        <Typography fontWeight="bold">{item.name}</Typography>

                        <Typography>₹{item.price}</Typography>
                      </Box>
                      <Button
                        variant="contained"
                        sx={{
                          borderRadius: 5,
                          px: 3,
                        }}
                        onClick={() => addSlice(item.name)}
                      >
                        Add
                      </Button>
                    </Paper>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={7}>
            <Card
              sx={{
                borderRadius: 5,
                boxShadow: 10,
                background: "white",
              }}
            >
              <CardContent>
                <Typography variant="h5" fontWeight="bold" mb={3}>
                  Your Burger
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    minHeight: 400,
                  }}
                >
                  <Box
                    sx={{
                      width: 260,
                      height: 50,
                      background: "#d2691e",
                      borderRadius: "100px 100px 20px 20px",
                      mb: 1,
                    }}
                  />
                  {burgerSlices.length === 0 && (
                    <Typography color="text.secondary" mt={10}>
                      Add burger layers to build your dream burger
                    </Typography>
                  )}

                  {burgerSlices.map((slice, index) => {
                    const item = BURGER_LAYERS.find((i) => i.name === slice);
                    return (
                      <Box
                        key={index}
                        sx={{
                          width: 250,
                          background: item?.color,
                          py: 1.5,
                          px: 2,
                          borderRadius: 5,
                          mb: 1,
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          boxShadow: 3,
                        }}
                      >
                        <Typography fontWeight="bold">{slice}</Typography>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Button size="small" onClick={() => moveUp(index)}>
                            ⬆
                          </Button>

                          <Button size="small" onClick={() => moveDown(index)}>
                            ⬇
                          </Button>

                          <IconButton
                            color="error"
                            onClick={() => removeSlice(index)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Box>
                    );
                  })}

                  <Box
                    sx={{
                      width: 260,
                      height: 35,
                      background: "#c68642",
                      borderRadius: "20px 20px 100px 100px",
                      mt: 1,
                    }}
                  />
                  {burgerSlices.length > 6 && (
                    <Paper
                      sx={{
                        p: 2,
                        mt: 2,
                        background: "#f5f5f5",
                        borderRadius: 3,
                        width: "100%",
                        maxWidth: 350,
                        textAlign: "center",
                      }}
                    >
                      <Typography fontWeight="bold" color="warning.main">
                        Chef suggests splitting this burger into two burgers
                      </Typography>
                    </Paper>
                  )}
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 2,
                    mt: 3,
                  }}
                >
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                  >
                    -
                  </Button>

                  <Typography variant="h6" fontWeight="bold">
                    Quantity: {quantity}
                  </Typography>

                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </Button>
                </Box>

                <Box mt={4}>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    sx={{
                      textDecoration: "underline",
                      textUnderlineOffset: "6px",
                      textDecorationThickness: "3px",
                    }}
                  >
                    Cart Summary
                  </Typography>

                  <Paper sx={{ p: 2, mt: 2, borderRadius: 3 }}>
                    <Typography>
                      <strong>Burger Configuration:</strong>
                    </Typography>

                    <Typography>{burgerSlices.join(" → ")}</Typography>

                    <Typography mt={2}>
                      <strong>Quantity:</strong> {quantity}
                    </Typography>

                    <Typography>
                      <strong>Total Price:</strong> ₹{totalPrice}
                    </Typography>

                    <Typography>
                      <strong>Address:</strong> {address || "-"}
                    </Typography>
                  </Paper>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 1.5,
                    mb: 4,
                    mt: 2,
                  }}
                >
                  {burgerSlices.map((slice, index) => (
                    <Chip key={index} label={slice} color="warning" />
                  ))}
                </Box>
                <Paper
                  sx={{
                    p: 3,
                    borderRadius: 4,
                    background: "linear-gradient(to right, #ff9966, #ff5e62)",
                    color: "white",
                  }}
                >
                  <Typography variant="h6" fontWeight="bold" mb={2}>
                    Price Summary
                  </Typography>
                  <Typography>Platform Fee: ₹5</Typography>

                  <Typography variant="h4" fontWeight="bold" mt={2}>
                    ₹{totalPrice}
                  </Typography>
                </Paper>
                <Box mt={4}>
                  <Typography variant="h5" fontWeight="bold" mb={2}>
                    Checkout
                  </Typography>

                  <TextField
                    fullWidth
                    label="Customer Name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Mobile Number"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    sx={{ mb: 2 }}
                  />

                  <TextField
                    fullWidth
                    label="Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <Box sx={{ mb: 2 }}>
                    <TextField
                      select
                      fullWidth
                      label="Payment Method"
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      sx={{ mb: 2 }}
                    >
                      <MenuItem value="UPI">UPI</MenuItem>
                      <MenuItem value="Cash">Cash</MenuItem>
                      <MenuItem value="COD">COD</MenuItem>
                      <MenuItem value="Net Banking">Net Banking</MenuItem>
                    </TextField>
                  </Box>
                  <Button
                    fullWidth
                    size="large"
                    variant="contained"
                    startIcon={<FastfoodIcon />}
                    sx={{
                      py: 1.5,
                      borderRadius: 4,
                      fontSize: 18,
                    }}
                    onClick={placeOrder}
                    disabled={loading}
                  >
                    {loading ? "Placing Order..." : "Place Order"}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default App;
