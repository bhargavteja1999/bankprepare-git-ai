import { createContext, useContext, useState } from "react";
const AppContext = createContext(null);
export function AppProvider({ children }) {
  const [page, setPage] = useState("landing");
  return <AppContext.Provider value={{ page, setPage }}>{children}</AppContext.Provider>;
}
export const useApp = () => useContext(AppContext);
export default AppContext;
