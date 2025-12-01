import { useState, useRef } from 'react';
import { ToneSelector } from './components/ToneSelector';
import { ResultGrid } from './components/ResultGrid';
import { generateCaptions, type CaptionsResponse } from './lib/api';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Image as ImageIcon, X } from "lucide-react";

function App() {
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('Profesional');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<CaptionsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleGenerate = async () => {
    if (!topic.trim() && !selectedFile) return;

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const data = await generateCaptions(topic, tone, selectedFile || undefined);
      setResults(data);
    } catch (err) {
      console.error(err);
      setError("Gagal membuat caption. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center py-10 px-4">
      <header className="mb-10 text-center space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
          OmniCaption AI
        </h1>
        <p className="text-muted-foreground text-lg">
          Generator Caption Media Sosial Next-Gen (Bahasa Indonesia)
        </p>
      </header>

      <main className="w-full max-w-4xl space-y-8">
        <div className="bg-card border border-border rounded-xl p-6 shadow-lg space-y-6">

          {/* Image Upload Area */}
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">
              Upload Foto (Opsional)
            </label>
            {!previewUrl ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
              >
                <ImageIcon className="w-10 h-10 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Klik untuk upload foto</p>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileSelect}
                />
              </div>
            ) : (
              <div className="relative rounded-lg overflow-hidden border border-border w-full max-w-xs mx-auto">
                <img src={previewUrl} alt="Preview" className="w-full h-auto object-cover" />
                <button
                  onClick={handleRemoveFile}
                  className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Topik atau Ide Konten
            </label>
            <Textarea
              placeholder="Contoh: Strategi marketing untuk UMKM di 2025..."
              className="resize-none h-32 text-base"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="space-y-2 flex-grow">
              <label className="text-sm font-medium leading-none">
                Pilih Nada Bicara
              </label>
              <ToneSelector value={tone} onChange={setTone} />
            </div>
            <Button
              onClick={handleGenerate}
              disabled={loading || (!topic.trim() && !selectedFile)}
              className="w-full sm:w-auto min-w-[150px] bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold transition-all duration-200 select-none"
            >
              {loading ? (
                <span className="flex items-center gap-2">Membuat...</span>
              ) : (
                <span className="flex items-center gap-2"><Sparkles className="w-4 h-4" /> Buat Caption</span>
              )}
            </Button>
          </div>

          {error && (
            <div className="text-red-500 text-sm mt-2">
              {error}
            </div>
          )}
        </div>

        <ResultGrid results={results} loading={loading} />
      </main>

      <footer className="mt-20 text-center text-sm text-muted-foreground">
        Crafted by Abhista
      </footer>
    </div>
  );
}

export default App;
