import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";

// Pages
import LandingPage from "@/pages/LandingPage";
import SplashPage from "@/pages/SplashPage";
import LoginPage from "@/pages/LoginPage";
import OtpPage from "@/pages/OtpPage";
import AddVehiclePage from "@/pages/AddVehiclePage";
import LocationPermissionPage from "@/pages/LocationPermissionPage";
import HomePage from "@/pages/HomePage";
import SearchPage from "@/pages/SearchPage";
import ResultsPage from "@/pages/ResultsPage";
import LotDetailsPage from "@/pages/LotDetailsPage";
import SlotSelectionPage from "@/pages/SlotSelectionPage";
import BookingSummaryPage from "@/pages/BookingSummaryPage";
import PaymentPage from "@/pages/PaymentPage";
import BookingConfirmationPage from "@/pages/BookingConfirmationPage";
import ActiveParkingPage from "@/pages/ActiveParkingPage";
import BookingHistoryPage from "@/pages/BookingHistoryPage";
import ReceiptPage from "@/pages/ReceiptPage";
import ProfilePage from "@/pages/ProfilePage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/splash" element={<SplashPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/otp" element={<OtpPage />} />
            <Route path="/add-vehicle" element={<AddVehiclePage />} />
            <Route path="/location-permission" element={<LocationPermissionPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/lot/:id" element={<LotDetailsPage />} />
            <Route path="/slot-selection" element={<SlotSelectionPage />} />
            <Route path="/booking/summary" element={<BookingSummaryPage />} />
            <Route path="/booking/payment" element={<PaymentPage />} />
            <Route path="/booking/confirmation" element={<BookingConfirmationPage />} />
            <Route path="/booking/active" element={<ActiveParkingPage />} />
            <Route path="/booking/history" element={<BookingHistoryPage />} />
            <Route path="/receipt/:id" element={<ReceiptPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
