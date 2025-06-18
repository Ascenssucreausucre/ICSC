import { createContext, useContext, useState } from "react";

const RegistrationPriceContext = createContext();

export const RegistrationPriceProvider = ({ children }) => {
  const [registrationPrices, setRegistrationPrices] = useState(null);

  return (
    <RegistrationPriceContext.Provider
      value={{
        registrationPrices,
        setRegistrationPrices,
      }}
    >
      {children}
    </RegistrationPriceContext.Provider>
  );
};

export const useRegistrationPrice = () => useContext(RegistrationPriceContext);
