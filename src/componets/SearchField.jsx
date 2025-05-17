import React from "react";
import { TextField, Button, Autocomplete, Stack } from "@mui/material";

const SearchField = ({
  city,
  setCity,
  fetchWeatherByCity,
  suggestions,
  fetchCitySuggestions,
}) => (
  <Stack spacing={2} sx={{ width: '100%' }}>
    <Autocomplete
      freeSolo
      options={suggestions}
      inputValue={city}
      onInputChange={(event, newInputValue) => {
        setCity(newInputValue);
        fetchCitySuggestions(newInputValue);
      }}
      sx={{ width: '100%' }} // ✅ force Autocomplete to stretch
      renderInput={(params) => (
        <TextField
          {...params}
          fullWidth // ✅ force TextField to stretch inside
          label="Enter City"
          margin="normal"
        />
      )}
    />
    <Button
      variant="contained"
      onClick={fetchWeatherByCity}
      fullWidth // ✅ matches width with input
    >
      Get Weather
    </Button>
  </Stack>
);

export default SearchField;
