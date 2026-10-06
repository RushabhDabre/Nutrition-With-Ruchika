import React from "react";
import { Alert, Box, Button } from "@mui/material";

export default class BookingErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Booking flow crashed", { error, errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ p: 2, maxWidth: 560, mx: "auto" }}>
          <Alert
            severity="error"
            action={
              <Button color="inherit" size="small" onClick={this.handleReset}>
                Try again
              </Button>
            }
          >
            We could not open the booking form. Please try again.
          </Alert>
        </Box>
      );
    }

    return this.props.children;
  }
}
