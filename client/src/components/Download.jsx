import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function Download() {
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const downloadFile = async () => {
    if (!token) return toast.error("Enter token or link");

    try {
      setLoading(true);
      let cleanToken = token.includes("/download/") ? token.split("/download/")[1] : token;

      const res = await axios.get(`http://localhost:5000/api/files/download/${cleanToken}${password ? `?password=${password}` : ""}`, { responseType: "blob" });
      const blobUrl = URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = "file";
      a.click();
      URL.revokeObjectURL(blobUrl);

      toast.success("File downloaded successfully!");
    } catch {
      toast.error("Invalid link or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 shadow-glow hover:shadow-xl transition-transform transform hover:scale-[1.02]">

      <h2 className="text-xl md:text-2xl font-semibold text-accent mb-6 flex items-center gap-2 animate-pulse">
        <svg className="w-6 h-6 text-accent animate-bounce" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M12 20v-12m0 0l4 4m-4-4l-4 4" />
        </svg>
        Secure Download
      </h2>

      <input type="text" value={token} onChange={e => setToken(e.target.value)} placeholder="Paste token or link"
        className="w-full mb-4 bg-transparent border border-white/20 rounded-lg px-4 py-3 focus:border-accent outline-none" />

      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password (if required)"
        className="w-full mb-4 bg-transparent border border-white/20 rounded-lg px-4 py-3 focus:border-accent outline-none" />

      <button
        onClick={downloadFile}
        disabled={loading}
        className={`w-full py-3 rounded-lg font-semibold transition ${loading ? "bg-gray-500 cursor-not-allowed" : "bg-accent text-black hover:shadow-glow hover:scale-[1.02]"}`}
      >
        {loading ? "Decrypting..." : "Decrypt & Download"}
      </button>
    </div>
  );
}
