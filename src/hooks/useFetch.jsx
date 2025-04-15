import { useState, useEffect } from "react";

const useFetch = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reLoading, setReLoading] = useState(true);
  const [error, setError] = useState(null);
  const baseUrl = import.meta.env.VITE_API_URL;

  const [refreshFlag, setRefreshFlag] = useState(false); // Flag pour forcer un rechargement

  useEffect(() => {
    let isMounted = true; // Pour éviter les erreurs si le composant est démonté
    setReLoading(true);

    const fetchData = async () => {
      try {
        const response = await fetch(baseUrl + url, options);
        if (!response.ok) {
          throw new Error(`Erreur: ${response.statusText}`);
        }
        const result = await response.json();
        if (isMounted) {
          setData(result);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
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
    }; // Cleanup en cas de démontage
  }, [url, refreshFlag]); // Le `refreshFlag` déclenche la refetch

  const refetch = () => setRefreshFlag(!refreshFlag); // Toggle pour recharger les données

  return { data, loading, reLoading, error, refetch }; // On retourne aussi la fonction `refetch`
};

export default useFetch;
