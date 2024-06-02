import React, { useState, useEffect, useCallback } from "react";
// import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { FormControl, FormLabel } from "@mui/material";

function BasicTextFields() {
  const [item, setItem] = useState("");
  const saveNewItem = useCallback(() => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ item }),
    };

    fetch("/api/add_recurring_item", requestOptions);
    // .then((response) => response.json())
    // .then((data) => setPostId(data.id));
  }, [item]);

  return (
    <FormControl onSubmit={saveNewItem}>
      <FormLabel>Enter Grocery Item</FormLabel>
      <TextField
        label="item"
        onChange={(e) => setItem(e.target.value)}
        variant="outlined"
        value={item}
      ></TextField>
      <Button type="submit">Submit</Button>
    </FormControl>
  );
}
function App() {
  const [recurringList, setRecurringList] = useState([{}]);

  useEffect(() => {
    fetch("/api/get_recurring_list")
      .then((result) => result.json())
      .then((result) => {
        setRecurringList(result);
        console.log(result);
      });
  }, []);

  return (
    <div>
      {typeof recurringList.items === "undefined" ? (
        <p>Loading...</p>
      ) : (
        <div>
          {/* (recurringList.items.map((item, i) => <p key={i}>{item}</p>)) */}
          <h1>Add To List:</h1>
          <BasicTextFields />
        </div>
        // data.members.map((member, i) => <p key={i}>{member}</p>)
      )}
    </div>
  );
}

export default App;
