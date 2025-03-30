
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";

const QuotationPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the first step
    navigate("/quotation/client");
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto py-8 px-4">
        <div className="text-center">
          <p>Redirecting to quotation process...</p>
        </div>
      </main>
    </div>
  );
};

export default QuotationPage;
