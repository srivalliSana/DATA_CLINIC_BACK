import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function GetStartedPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");
    
    if (!user || !token) {
      // If not logged in, redirect to login
      navigate("/auth/login");
    }
  }, [navigate]);

  const handleGetStarted = () => {
    // Navigate to upload dataset page
    navigate("/upload-dataset");
  };

  return (
    <>
      {/* gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-top)] to-[var(--bg-bottom)]" />
      
      <div className="relative z-10">
        
        <main className="mx-auto max-w-4xl px-5 pt-10 pb-16">
          <div className="text-center space-y-8">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight" style={{color:'var(--title)'}}>
              Ready to Get Started?
            </h1>
            <p className="text-lg md:text-xl text-black/80 dark:text-white/90 max-w-2xl mx-auto">
              Upload your dataset and let us help you preprocess it for better insights.
            </p>
            
            <div className="space-y-6">
              <div className="glass p-8 rounded-2xl max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold mb-4" style={{color:'var(--title)'}}>
                  What happens next?
                </h2>
                <div className="space-y-4 text-left">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-[var(--cta)] rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                    <p>Upload your dataset (CSV, Excel, or JSON format)</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-[var(--cta)] rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
                    <p>We'll automatically preprocess your data (remove null values, handle duplicates, etc.)</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-[var(--cta)] rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
                    <p>Get insights and recommendations for your clean dataset</p>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={handleGetStarted}
                className="btn btn-primary shadow-card text-lg px-8 py-4"
              >
                Upload Your Dataset
              </button>
            </div>
          </div>
        </main>
      </div>
      
      {/* rounded container border */}
      <div className="pointer-events-none absolute inset-3 rounded-[2rem] border border-black/10 dark:border-white/10" />
    </>
  );
}




