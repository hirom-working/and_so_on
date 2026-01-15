import { X, Mail, Star, ExternalLink } from 'lucide-react'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

const credits = [
  { name: 'YAMASHITA Hiromu', role: 'アプリ開発' },
  { name: 'OMI Shinya', role: '環境音制作' },
]


export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  if (!isOpen) return null

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleRateApp = () => {
    // iOS App Store review URL placeholder
    // Replace with actual App Store ID when available
    window.open('https://apps.apple.com/app/idXXXXXXXXXX?action=write-review', '_blank')
  }

  const handleFeedback = () => {
    window.location.href = 'mailto:support@and-so-on.koyatsu.me?subject=Feedback'
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="bg-gradient-to-br from-[#F8EED8] via-[#F4E4BC] to-[#E8D8A8] rounded-3xl shadow-[20px_20px_60px_#a8a098,-10px_-10px_30px_#ffffff] w-[340px] max-h-[80vh] overflow-hidden relative">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-retro-dark/10">
          <h2 className="text-lg font-bold text-retro-dark tracking-wide">設定</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-retro-dark/10 hover:bg-retro-dark/20 transition-colors"
          >
            <X size={18} className="text-retro-dark" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[calc(80vh-60px)] space-y-5">
          {/* Version */}
          <section>
            <h3 className="text-xs font-bold text-retro-dark/50 uppercase tracking-wider mb-2">バージョン</h3>
            <p className="text-retro-dark font-mono">v3.0.0</p>
          </section>

          {/* Credits */}
          <section>
            <h3 className="text-xs font-bold text-retro-dark/50 uppercase tracking-wider mb-2">クレジット</h3>
            <div className="space-y-0">
              {credits.map((credit) => (
                <div
                  key={credit.name}
                  className="flex items-center justify-between py-0.5 px-2"
                >
                  <span className="text-sm text-retro-dark">{credit.name}</span>
                  <span className="text-xs text-retro-dark/40">{credit.role}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Legal Links */}
          <section>
            <h3 className="text-xs font-bold text-retro-dark/50 uppercase tracking-wider mb-2">法的情報</h3>
            <div className="space-y-1.5">
              <a
                href="/privacy.html"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between py-2 px-2 rounded-lg hover:bg-retro-dark/5 transition-colors"
              >
                <span className="text-sm text-retro-dark">プライバシーポリシー</span>
                <ExternalLink size={14} className="text-retro-dark/40" />
              </a>
            </div>
          </section>

          {/* Action Buttons */}
          <section className="space-y-2 pt-2">
            <button
              onClick={handleFeedback}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-b from-[#5a5550] to-[#4a4540] text-white/90 font-medium shadow-[0_4px_8px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.1)] hover:from-[#6a6560] hover:to-[#5a5550] active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] transition-all"
            >
              <Mail size={18} />
              <span>フィードバックを送る</span>
            </button>
            <button
              onClick={handleRateApp}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-b from-[#e8a040] to-[#d89030] text-white font-medium shadow-[0_4px_8px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.2)] hover:from-[#f0a848] hover:to-[#e09838] active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] transition-all"
            >
              <Star size={18} />
              <span>アプリを評価する</span>
            </button>
          </section>
        </div>
      </div>
    </div>
  )
}
