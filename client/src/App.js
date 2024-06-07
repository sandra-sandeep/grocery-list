import React, { useState, useEffect, useCallback } from "react";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import FormGroup from "@mui/material/FormGroup";
import Checkbox from "@mui/material/Checkbox";
import "./App.css";

function NewItem({ setNeedsUpdate }) {
  const [item, setItem] = useState("");

  const saveNewItem = useCallback(
    async (item) => {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item }),
      };
      await fetch("/api/add_recurring_item", requestOptions);
      setNeedsUpdate(true);
      setItem("");
    },
    [setNeedsUpdate, setItem]
  );

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
              await saveNewItem(item);
            }
          },
        }}
      />
    </span>
  );
}

function ExistingItem({ item, setNeedsUpdate }) {
  const handleCheck = useCallback(
    async (event) => {
      if (event.target.checked && event.target === event.currentTarget) {
        console.log(event);
        const requestOptions = {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ item }),
        };
        await fetch("/api/remove_recurring_item", requestOptions);
        setNeedsUpdate(true);
      }
    },
    [setNeedsUpdate, item]
  );

  return (
    <span className="ExistingItem">
      <Typography gutterBottom={false}>
        {" "}
        <Checkbox onChange={async (e) => await handleCheck(e)} />
        {item}
      </Typography>
    </span>
  );
}

function ExistingItemList({ items, setNeedsUpdate }) {
  return (
    <FormGroup>
      {items.map((item, i) => (
        <ExistingItem key={i} item={item} setNeedsUpdate={setNeedsUpdate} />
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
    <div>
      {typeof recurringList === "undefined" ? (
        <p>Loading...</p>
      ) : (
        // TODO(sandra-sandeep): Make it cute.
        <div>
          <ExistingItemList
            items={recurringList}
            setNeedsUpdate={setNeedsUpdate}
          />
          <NewItem setNeedsUpdate={setNeedsUpdate} />
        </div>
      )}
    </div>
  );
}

export default App;
