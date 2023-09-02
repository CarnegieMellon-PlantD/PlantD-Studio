import { createContext } from 'react';

type DashboardContextType = {
  dataGeneration: number;
};

const DashboardContext = createContext<DashboardContextType>({
  dataGeneration: 0,
});

export default DashboardContext;
