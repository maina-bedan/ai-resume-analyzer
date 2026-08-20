import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumind" },
    { name: "description", content: "Smart feedback for your dream job!" },
  ];
}

export default function Home() {
  const { auth, kv } = usePuterStore();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);

  useEffect(() => {
    if (!auth.isAuthenticated) navigate('/auth?next=/');
  }, [auth.isAuthenticated]);

  const loadResumes = async () => {
    setLoadingResumes(true);

    const resumes = (await kv.list('resume:*', true)) as KVItem[];

    const parsedResumes = resumes?.map((resume) => (
        JSON.parse(resume.value) as Resume
    ));

    setResumes(parsedResumes || []);
    setLoadingResumes(false);
  };

  useEffect(() => {
    loadResumes();
  }, []);

  const handleWipeData = async () => {
    const confirmed = window.confirm(
        "Are you sure you want to wipe all stored resumes? This action cannot be undone."
    );

    if (!confirmed) return;

    try {
      await kv.flush();
      setResumes([]);
      alert("Database wiped successfully!");
    } catch (error) {
      console.error("Failed to wipe data:", error);
      alert("Error clearing database. Check console for details.");
    }
  };

  return (
      <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen">
        <Navbar />

        <section className="main-section">
          <div className="page-heading py-16 flex flex-col items-center">
            <h1>Track Your Applications & Resume Ratings</h1>
            {!loadingResumes && resumes?.length === 0 ? (
                <h2>No resumes found. Upload your first resume to get feedback.</h2>
            ) : (
                <h2>Review your submissions and check AI-powered feedback.</h2>
            )}

            {/* Developer Control Option */}
            <div className="mt-6 flex items-center gap-4">
              {resumes.length > 0 && (
                  <button
                      onClick={handleWipeData}
                      type="button"
                      className="px-4 py-2 text-sm font-semibold text-red-600 bg-red-100/80 hover:bg-red-200 rounded-xl transition-colors cursor-pointer shadow-sm"
                  >
                    Wipe All Data
                  </button>
              )}
            </div>
          </div>

          {loadingResumes && (
              <div className="flex flex-col items-center justify-center">
                <img src="/images/resume-scan-2.gif" className="w-[200px]" alt="Loading resumes" />
              </div>
          )}

          {!loadingResumes && resumes.length > 0 && (
              <div className="resumes-section">
                {resumes.map((resume) => (
                    <ResumeCard key={resume.id} resume={resume} />
                ))}
              </div>
          )}

          {!loadingResumes && resumes?.length === 0 && (
              <div className="flex flex-col items-center justify-center mt-10 gap-4">
                <Link to="/upload" className="primary-button w-fit text-xl font-semibold">
                  Upload Resume
                </Link>
              </div>
          )}
        </section>
      </main>
  );
}