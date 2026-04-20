import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DecisionProvider } from "@/context/DecisionContext";
import Home from "./pages/Home.tsx";
import Create from "./pages/Create.tsx";
import Eliminate from "./pages/Eliminate.tsx";
import Result from "./pages/Result.tsx";
import History from "./pages/History.tsx";
import Log from "./pages/Log.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <DecisionProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<Create />} />
            <Route path="/eliminate" element={<Eliminate />} />
            <Route path="/result" element={<Result />} />
            <Route path="/history" element={<History />} />
            <Route path="/log" element={<Log />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </DecisionProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
