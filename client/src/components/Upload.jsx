import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [expires, setExpires] = useState(1);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const uploadFile = async () => {
    if (!file) return toast.error("Please select a file");

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("expiresInHours", expires);
      if (password) formData.append("password", password);

      const res = await axios.post("http://localhost:5000/api/files/upload", formData);
      toast.success("File uploaded successfully!");
      navigator.clipboard.writeText(res.data.downloadLink);
      toast("Link copied to clipboard", { icon: "🔗" });

    } catch {
      toast.error("Upload failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 shadow-glow hover:shadow-xl transition-transform transform hover:scale-[1.02]">

      <h2 className="text-xl md:text-2xl font-semibold text-accent mb-6 flex items-center gap-3 animate-pulse">
        <svg className="w-6 h-6 text-accent animate-bounce" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M12 4v12m0 0l-4-4m4 4l4-4" />
        </svg>
        Secure Upload
      </h2>

      {/* Drag & Drop */}
      <label className="block mb-4 cursor-pointer">
        <div
          className={`border-2 border-dashed rounded-xl p-6 text-center transition 
            ${file ? "border-success/60 shadow-glow" : "border-accent/40 hover:border-accent hover:shadow-glow"}
            flex flex-col items-center justify-center gap-2`}
          onDragOver={e => e.preventDefault()}
          onDrop={e => {
            e.preventDefault();
            setFile(e.dataTransfer.files[0]);
          }}
        >
          <svg className="w-12 h-12 text-accent animate-bounce" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 4v12m0 0l-4-4m4 4l4-4" />
          </svg>
          <p className="text-sm text-gray-300">{file ? file.name : "Drag & drop or click to upload"}</p>
          <p className="text-xs text-gray-500 mt-1">Encrypted before upload</p>
        </div>
        <input type="file" onChange={e => setFile(e.target.files[0])} className="hidden" />
      </label>

      <input type="number" min="1" value={expires} onChange={e => setExpires(e.target.value)} placeholder="Expiry (hours)"
        className="w-full mb-4 bg-transparent border border-white/20 rounded-lg px-4 py-3 focus:border-accent outline-none" />

      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password (optional)"
        className="w-full mb-4 bg-transparent border border-white/20 rounded-lg px-4 py-3 focus:border-accent outline-none" />

      <button
        onClick={uploadFile}
        disabled={loading}
        className={`w-full py-3 rounded-lg font-semibold transition ${loading ? "bg-gray-500 cursor-not-allowed" : "bg-accent text-black hover:shadow-glow hover:scale-[1.02]"}`}
      >
        {loading ? "Encrypting..." : "Encrypt & Upload"}
      </button>
    </div>
  );
}
