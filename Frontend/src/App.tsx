import { BrowserRouter, Routes, Route} from "react-router";
// import NotFound from "./pages/Error/notFound";
import QuotationForm from "./pages/QuotationPage";
import { ScrollToTop } from "./components/UI/ScrollToTop";
import Header from "./components/Header";
import Home from "./pages/HomePage";
import BulkUploadForm from "./pages/BulkUploadPage";
import HistoryPage from "./pages/HistoryPage";



function App() {
  return (
    <BrowserRouter>
    <ScrollToTop/>
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/new-quote" element={<QuotationForm />} />
          <Route path="/bulk-upload" element={<BulkUploadForm />} />
          <Route path="/history" element={<HistoryPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;