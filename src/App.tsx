import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Route, Routes } from "react-router-dom";
import { TooltipProvider } from "./lib/tooltip-stub";
import AppLayout from "./components/AppLayout";
import PhoneFrame from "./components/PhoneFrame";
import HomePage from "./pages/HomePage";
import CategoryPage from "./pages/CategoryPage";
import OrdersPage from "./pages/OrdersPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import ItemDetailPage from "./pages/ItemDetailPage";
import SelfDashboardPage from "./pages/SelfDashboardPage";
import CustomerDashboardPage from "./pages/CustomerDashboardPage";
import CustomerProfilePage from "./pages/CustomerProfilePage";
import CreateTicketPage from "./pages/CreateTicketPage";
import TicketDetailPage from "./pages/TicketDetailPage";
import HelpCenterPage from "./pages/HelpCenterPage";
import SmartCreateTicketPage from "./pages/SmartCreateTicketPage";
import HelpComplaintPage from "./pages/HelpComplaintPage";
import HelpInstallationPage from "./pages/HelpInstallationPage";
import FaqPage from "./pages/FaqPage";
import LiveChatPage from "./pages/LiveChatPage";
import MyBusinessPage from "./pages/MyBusinessPage";
import CustomerInstallBookingPage from "./pages/CustomerInstallBookingPage";
import WaRedirectPage  from "./pages/WaRedirectPage";
import SmsRedirectPage from "./pages/SmsRedirectPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <HashRouter>
        <PhoneFrame>
        <AppLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/category" element={<CategoryPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/orders/:orderId" element={<OrderDetailPage />} />
            <Route path="/orders/:orderId/item/:itemId" element={<ItemDetailPage />} />
            <Route path="/help" element={<HelpCenterPage />} />
            <Route path="/help/desk" element={<HelpCenterPage />} />
            <Route path="/help/complaint" element={<HelpComplaintPage />} />
            <Route path="/help/installation" element={<HelpInstallationPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/chat" element={<LiveChatPage />} />
            <Route path="/my-business" element={<MyBusinessPage />} />
            <Route path="/service/self" element={<SelfDashboardPage />} />
            <Route path="/service/self/create" element={<CreateTicketPage type="self" />} />
            <Route path="/service/customer" element={<CustomerDashboardPage />} />
            <Route path="/service/customer/create" element={<CreateTicketPage type="customer" />} />
            <Route path="/service/customer/:customerId" element={<CustomerProfilePage />} />
            <Route path="/ticket/create" element={<SmartCreateTicketPage />} />
            <Route path="/ticket/:ticketId" element={<TicketDetailPage />} />
            <Route path="/service/lookup" element={<CustomerDashboardPage />} />
            <Route path="/install/book" element={<CustomerInstallBookingPage />} />
            <Route path="/wa"           element={<WaRedirectPage />} />
            <Route path="/sms"          element={<SmsRedirectPage />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </AppLayout>
        </PhoneFrame>
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
