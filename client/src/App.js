import React, { useState, useEffect, useCallback } from "react";
import TextField from "@mui/material/TextField";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import "./App.css";

function NewItem({ setNeedsUpdate }) {
  const [item, setItem] = useState("");

  const saveNewItem = useCallback(async (item) => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ item }),
    };
    await fetch("/api/add_recurring_item", requestOptions);
    setNeedsUpdate(true);
    setItem("")
  }, [setNeedsUpdate, setItem]);

  return (
    <span className="NewItem">
      <TextField
        label="item"
        onChange={(e) => setItem(e.target.value)}
        variant="standard"
        value={item}
        inputProps={{
          onKeyPress: async (event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              console.log("sundra1", item);
              await saveNewItem(item);
            }
          },
        }}
      />
    </span>
  );
}

function ExistingItemList({ items, setNeedsUpdate }) {
  const handleCheck = useCallback(async (event, item) => {
    if (event.target.checked) {
      console.log("sundra", item);
      const requestOptions = {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item }),
      };
      await fetch("/api/remove_recurring_item", requestOptions);
      setNeedsUpdate(true);
    }
  }, [setNeedsUpdate]);

  return (
    <FormGroup>
      {items.map((item, i) => (
        <FormControlLabel
          // TODO (sandrasandeep): prevent onChange when label, not checkbox, is clicked
          control={<Checkbox onChange={async (e) => await handleCheck(e, item)} />}
          label={item}
          key={i}
        />
      ))}
    </FormGroup>
  );
}

function App() {
  const [recurringList, setRecurringList] = useState([]);
  const [needsUpdate, setNeedsUpdate] = useState(true);

  useEffect(() => {
    if (needsUpdate) {
      fetch("/api/get_recurring_list")
      .then((result) => result.json())
      .then((result) => {
        setRecurringList(result);
      });
      setNeedsUpdate(false);
    }
  }, [needsUpdate, setNeedsUpdate]);

  return (
    // TODO(sandra-sandeep): add weekly (non-recurring) grocery list too.
    <div>
      {typeof recurringList === "undefined" ? (
        <p>Loading...</p>
      ) : (
        // TODO(sandra-sandeep): Make it cute.
        <div>
          <ExistingItemList items={recurringList} setNeedsUpdate={setNeedsUpdate} />
          <NewItem setNeedsUpdate={setNeedsUpdate} />
        </div>
      )}
    </div>
  );
}

export default App;
