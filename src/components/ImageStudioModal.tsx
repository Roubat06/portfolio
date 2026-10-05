import React, { useState } from 'react';
import { Sparkles, Image as ImageIcon, Upload, Download, RefreshCw, X, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface ImageStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_PROMPTS = [
  'Futuristic isometric architecture diagram of Striveda with modular time, money, and habit nodes on black marble',
  'Cyber-security document scanner interface for TamperLock highlighting altered text in vibrant glowing red bounding boxes',
  'Harmonic acoustic soundscape waves on charcoal glass with cyan and emerald gradient lines for LifeCoachX audio therapy',
  'Minimalist student commerce exchange platform layout with clean travertine stone blocks and frosted glass cards',
  'High-contrast technical visualization of AI text tone calibration across warm, assertive, and diplomatic spectrums for Sonor',
];

export const ImageStudioModal: React.FC<ImageStudioModalProps> = ({ isOpen, onClose }) => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '16:9' | '4:3' | '3:4'>('1:1');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requiresPaidKey, setRequiresPaidKey] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateOrEdit = async () => {
    if (!prompt.trim() || loading) return;

    setLoading(true);
    setError(null);
    setRequiresPaidKey(false);

    try {
      const response = await fetch('/api/image-studio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          base64Image: uploadedImage || undefined,
          aspectRatio,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        if (data.requiresPaidKey) {
          setRequiresPaidKey(true);
        }
        throw new Error(data.error || 'Failed to generate image with gemini-3.1-flash-image-preview.');
      }

      setGeneratedImage(data.imageUrl);
    } catch (err: any) {
      console.error('Image studio error:', err);
      setError(err?.message || 'Image generation failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fadeIn"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-2xl bg-white text-[#050505] rounded-3xl border border-neutral-300 shadow-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top gradient accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-violet-600 via-indigo-600 to-pink-500" />

        <div className="flex items-start justify-between gap-4 pb-4 border-b border-neutral-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-violet-600 font-semibold mb-1">
              <Sparkles className="w-3.5 h-3.5 text-pink-500" />
              <span>Model: gemini-3.1-flash-image-preview · Create & Edit Images</span>
            </div>
            <h3 className="text-xl md:text-2xl font-bold font-display text-neutral-900">
              AI Image Studio
            </h3>
            <p className="text-xs text-neutral-600 mt-0.5">
              Use text prompts to create new visual concepts or upload an image to edit it with Gemini.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 rounded-xl text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-5 my-5">
          {/* Mode Switch / Image Upload for Edit Mode */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-violet-50/70 to-pink-50/50 border border-violet-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs space-y-0.5">
              <div className="font-bold text-neutral-900 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-violet-600" />
                <span>{uploadedImage ? 'Editing Uploaded Image' : 'Creating New Image'}</span>
              </div>
              <p className="text-neutral-600">
                {uploadedImage
                  ? 'Gemini will edit your uploaded image according to your prompt.'
                  : 'Optionally upload an image below if you want to edit an existing asset.'}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-violet-200 bg-white text-xs font-semibold text-violet-700 hover:bg-violet-50 transition-colors cursor-pointer shadow-xs">
                <Upload className="w-3.5 h-3.5" />
                <span>{uploadedImage ? 'Change Image' : 'Upload to Edit'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {uploadedImage && (
                <button
                  type="button"
                  onClick={() => setUploadedImage(null)}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  Clear Image
                </button>
              )}
            </div>
          </div>

          {uploadedImage && (
            <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-200">
              <img
                src={uploadedImage}
                alt="Source preview"
                className="w-16 h-16 object-cover rounded-lg border border-neutral-300 shrink-0"
              />
              <div className="text-xs text-neutral-700 flex-1 truncate">
                <div className="font-semibold text-neutral-900">Source Image Loaded</div>
                <div className="text-neutral-500 truncate">
                  Now enter instructions to transform or edit this image
                </div>
              </div>
            </div>
          )}

          {/* Prompt Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-neutral-800">
              {uploadedImage ? 'Edit Instructions Prompt' : 'Image Generation Prompt'}
            </label>
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={
                uploadedImage
                  ? 'e.g. "Add a glowing neon cyan grid overlay and make the background dark slate"'
                  : 'e.g. "Isometric architectural diagram of Striveda personal finance and habit ecosystem on obsidian"'
              }
              className="w-full p-3.5 text-sm bg-neutral-50 border border-neutral-300 rounded-xl text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
            />
          </div>

          {/* Aspect Ratio Selector (Create mode) */}
          {!uploadedImage && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-neutral-600 mr-2">Aspect Ratio:</span>
              {(['1:1', '16:9', '4:3', '3:4'] as const).map((ratio) => (
                <button
                  key={ratio}
                  type="button"
                  onClick={() => setAspectRatio(ratio)}
                  className={`px-3 py-1 text-xs font-mono rounded-lg border transition-all cursor-pointer ${
                    aspectRatio === ratio
                      ? 'bg-violet-600 text-white border-violet-600 font-bold shadow-xs'
                      : 'bg-white text-neutral-700 border-neutral-300 hover:border-neutral-400'
                  }`}
                >
                  {ratio}
                </button>
              ))}
            </div>
          )}

          {/* Quick Presets */}
          <div className="space-y-1.5">
            <div className="text-xs font-semibold text-neutral-500">Project Concept Presets:</div>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_PROMPTS.map((p, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setPrompt(p)}
                  className="px-2.5 py-1 text-xs text-left bg-neutral-100 hover:bg-violet-100 hover:text-violet-900 text-neutral-700 rounded-lg transition-colors cursor-pointer"
                >
                  {p.slice(0, 48)}...
                </button>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <button
            type="button"
            disabled={loading || !prompt.trim()}
            onClick={handleGenerateOrEdit}
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-pink-600 text-white font-bold text-xs shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:brightness-105 active:scale-98 transition-all disabled:opacity-40 cursor-pointer"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Processing with gemini-3.1-flash-image-preview...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>
                  {uploadedImage ? 'Apply Edits to Image' : 'Generate Image with Gemini'}
                </span>
              </>
            )}
          </button>

          {/* Error Message */}
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-rose-900">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <span>Image Generation Notice</span>
              </div>
              <p>{error}</p>
              {requiresPaidKey && (
                <p className="text-neutral-700 pt-1 border-t border-rose-200">
                  Note: In Google AI Studio, the model{' '}
                  <code className="bg-rose-100 px-1 py-0.5 rounded font-mono">
                    gemini-3.1-flash-image-preview
                  </code>{' '}
                  requires a project with billing/paid tier enabled.
                </p>
              )}
            </div>
          )}

          {/* Generated Result Preview */}
          {generatedImage && (
            <div className="pt-4 border-t border-neutral-200 space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-800">
                  Generated Output (gemini-3.1-flash-image-preview):
                </span>
                <a
                  href={generatedImage}
                  download="gemini-generated-image.png"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-violet-600 hover:text-violet-800"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Image</span>
                </a>
              </div>
              <div className="rounded-2xl overflow-hidden border border-neutral-300 bg-neutral-900 flex items-center justify-center p-2">
                <img
                  src={generatedImage}
                  alt="Generated by Gemini"
                  className="max-h-[380px] w-auto object-contain rounded-xl"
                />
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
