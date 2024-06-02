import React, { useState, useEffect, useCallback } from "react";
// import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { FormLabel } from "@mui/material";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import './App.css';
// import Stack from "@mui/material/Stack";

function AddRecurringFieldForm() {
  const [item, setItem] = useState("");

  const saveNewItem = useCallback(() => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ item }),
    };

    fetch("/api/add_recurring_item", requestOptions);
  }, [item]);

  return (
    <form onSubmit={saveNewItem}>
      <div>
        <FormLabel>Enter Grocery Item</FormLabel>
      </div>
      <TextField
        label="item"
        onChange={(e) => setItem(e.target.value)}
        variant="outlined"
        value={item}
      ></TextField>
      <div>
        <Button type="submit">Submit</Button>
      </div>
    </form>
  );
}

function GroceryList({ items }) {
  return (
    <FormGroup>
      {items.map((item, i) => (
        <FormControlLabel control={<Checkbox />} label={item} key={i} />
      ))}
    </FormGroup>
  );
}

function App() {
  const [recurringList, setRecurringList] = useState([]);

  useEffect(() => {
    fetch("/api/get_recurring_list")
      .then((result) => result.json())
      .then((result) => {
        console.log(result);

        setRecurringList(result);
      });
  }, []);

  return (
    <div>
      {typeof recurringList === "undefined" ? (
        <p>Loading...</p>
      ) : (
        <div className="Container">
          <GroceryList items={recurringList} />
          <AddRecurringFieldForm />
        </div>
      )}
    </div>
  );
}

export default App;
