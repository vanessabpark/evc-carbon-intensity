import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import { createStore } from "redux";
import { Loading } from "./components/loading/Loading";
import { Form } from "./components/form/Form";
import { IntensityIndex } from "./components/intensityIndex/IntensityIndex";
import { useDispatch, useSelector } from "react-redux";

const store = createStore(reducer);

function App() {
  const [fetchedData, setFetchedData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lowRangeIntensity, setLowRangeIntensity] = useState([]);

  const submitHandler = (selectedDate, postcode) => {
    const isoDate = selectedDate.toISOString();
    fetchData(isoDate, postcode);
  };

  const fetchData = async (isoDate, postcode) => {
    if (!isoDate || !postcode) {
      alert("Please select a date and enter a post code.");
      return;
    }
    setLoading(true);

    try {
      const url = `https://api.carbonintensity.org.uk/regional/intensity/${isoDate}/fw24h/postcode/${postcode}`;

      const response = await axios.get(url);
      console.log("response", response);
      const responseData = response.data.data.data;
      console.log("responseData", responseData);
      setFetchedData(responseData);
      filterIntensity(responseData);
    } catch (error) {
      console.error("Error", error);
    }
    setLoading(false);
  };

  const filterIntensity = (data) => {
    console.log("HEYdata", data);
    const lowIntensityItems = data.filter((item) => {
      return (
        item.intensity.index === "low" || item.intensity.index === "very low"
      );
    });
    console.log("lowIntensityItems", lowIntensityItems);
    setLowRangeIntensity(lowIntensityItems);
  };

  // useEffect(() => {
  //   filterIntensity();
  // }, [fetchedData]);

  return (
    <div>
      {loading && <Loading />}
      <Form submitHandler={submitHandler} />
      <IntensityIndex lowRangeIntensity={lowRangeIntensity} />
    </div>
  );
}

export default App;
