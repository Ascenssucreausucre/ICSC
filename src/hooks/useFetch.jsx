import axios from "axios";
import { useState, useEffect } from "react";

const useFetch = (
  url,
  options = {
    withCredentials: true,
  }
) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reLoading, setReLoading] = useState(true);
  const [error, setError] = useState(null);
  const baseUrl = import.meta.env.VITE_API_URL;

  const [refreshFlag, setRefreshFlag] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setReLoading(true);

    const fetchData = async () => {
      try {
        const response = await axios.get(baseUrl + url, options);
        const result = response.data;
        if (isMounted) {
          setData(result);
        }
        console.log(result);
      } catch (err) {
        if (isMounted) {
          setError(err.message);
          console.error(err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
          setReLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [url, refreshFlag]);

  const refetch = () => setRefreshFlag(!refreshFlag);

  return { data, loading, reLoading, error, refetch };
};

export default useFetch;
