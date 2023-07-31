import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Main.css";

function Main() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    fetchItems();
    setCurrentDate(formatDate(new Date()));
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/items");
      setItems(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const addItem = async () => {
    if (newItem.trim() !== "") {
      try {
        const response = await axios.post("http://localhost:5000/api/items", {
          name: newItem,
        });
        setItems([...items, response.data]);
        setNewItem("");
      } catch (error) {
        console.log(error);
      }
    }
  };

  const deleteItem = async (itemName) => {
    try {
      const itemsToDelete = items.filter((item) => item.name === itemName);
      if (itemsToDelete.length > 0) {
        const deleteRequests = itemsToDelete.map((item) =>
          axios.delete(`http://localhost:5000/api/items/${item._id}`)
        );
        await Promise.all(deleteRequests);
        const updatedItems = items.filter(
          (item) =>
            !itemsToDelete.some((deleteItem) => deleteItem._id === item._id)
        );
        setItems(updatedItems);
      } else {
        alert("Item does not exist");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (newItem.trim() !== "") {
      try {
        const addButtonClicked = event.nativeEvent.submitter.innerText === "+";
        const deleteButtonClicked =
          event.nativeEvent.submitter.innerText === "-";
        if (addButtonClicked) {
          await addItem();
        } else if (deleteButtonClicked) {
          await deleteItem(newItem);
        }
        setNewItem("");
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleInputKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };

  const formatDate = (date) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  /*const getCurrentTime = () => {
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const timeString = `${hours}:${minutes < 10 ? "0" + minutes : minutes}`;
    return timeString;
  };*/

  return (
    <div className="main">
      <div className="main-container">
        <div className="date-and-time">
          <h3>
            {currentDate}
            {/* - {getCurrentTime()}*/}
          </h3>
        </div>
        <div className="box">
          <div className="heading">
            <h1>Task Tracker</h1>
          </div>
          <form onSubmit={handleFormSubmit}>
            <button className="button" type="submit">
              -
            </button>
            <input
              type="name"
              value={newItem}
              onChange={(event) => setNewItem(event.target.value)}
              onKeyDown={handleInputKeyDown}
              placeholder="Item Name"
              autoComplete="off"
              required
            />
            <button className="button" type="submit">
              +
            </button>
          </form>
          <hr />
          <ul>
            {items.map((item) => (
              <li key={item._id}>{item.name}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Main;
