'use client'

import { useRef } from 'react'

type FileUploadProps = {
  label: string
  accept: string
  file: File | null
  error?: string
  required?: boolean
  onChange: (file: File | null) => void
}

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ')
}

export default function FileUpload({
  label,
  accept,
  file,
  error,
  required = false,
  onChange,
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null
    if (selectedFile) {
      // Valida extensão do arquivo
      const allowedExtensions = accept.split(',').map((ext) => ext.trim().toLowerCase())
      const fileExtension = '.' + selectedFile.name.split('.').pop()?.toLowerCase()
      const mimeType = selectedFile.type.toLowerCase()

      // Verifica se a extensão ou o tipo MIME está na lista permitida
      const isValidExtension = allowedExtensions.some((ext) => {
        const normalizedExt = ext.toLowerCase()
        return (
          fileExtension === normalizedExt ||
          mimeType.includes(normalizedExt.replace('.', '')) ||
          (normalizedExt === '.jpg' && mimeType.includes('jpeg')) ||
          (normalizedExt === '.jpeg' && mimeType.includes('jpeg'))
        )
      })

      if (!isValidExtension) {
        alert(`Tipo de arquivo não permitido. Formatos aceitos: ${accept.split(',').map((ext) => ext.replace('.', '').toUpperCase()).join(', ')}`)
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
        return
      }
    }
    onChange(selectedFile)
  }

  const handleRemove = () => {
    onChange(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div
        className={cn(
          'rounded-xl border-2 border-dashed transition-colors',
          error
            ? 'border-red-300 bg-red-50/50'
            : file
              ? 'border-[var(--primary)] bg-[var(--secondary)]/20'
              : 'border-gray-300 bg-gray-50 hover:border-[var(--primary)]/50 hover:bg-gray-100/50',
          'cursor-pointer'
        )}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
        />

        {!file ? (
          <div className="flex flex-col items-center justify-center px-6 py-6 text-center">
            <svg
              className="w-10 h-10 text-gray-400 mb-3"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <polyline points="17 8 12 3 7 8" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="12" y1="3" x2="12" y2="15" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] text-white px-4 py-2 text-sm font-semibold shadow-sm hover:bg-[var(--accent)] transition"
              onClick={(e) => {
                e.stopPropagation()
                handleClick()
              }}
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <polyline points="17 8 12 3 7 8" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="12" y1="3" x2="12" y2="15" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Anexar arquivo
            </button>
            <p className="mt-2 text-xs text-gray-500">
              Formatos aceitos:{' '}
              {accept
                .split(',')
                .map((ext) => ext.replace('.', '').toUpperCase())
                .join(', ')}
            </p>
          </div>
        ) : (
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="flex-shrink-0">
                <svg
                  className="w-8 h-8 text-[var(--primary)]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <polyline points="14 2 14 8 20 8" strokeLinecap="round" strokeLinejoin="round" />
                  <line x1="16" y1="13" x2="8" y2="13" strokeLinecap="round" strokeLinejoin="round" />
                  <line x1="16" y1="17" x2="8" y2="17" strokeLinecap="round" strokeLinejoin="round" />
                  <polyline points="10 9 9 9 8 9" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                <p className="text-xs text-gray-500">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  handleClick()
                }}
                className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-[var(--primary)] hover:bg-[var(--secondary)] transition"
                aria-label="Substituir arquivo"
                title="Substituir arquivo"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path
                    d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                    strokeLinecap="round"
                  />
                  <path
                    d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5Z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  handleRemove()
                }}
                className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-red-600 hover:bg-red-50 transition"
                aria-label="Remover arquivo"
                title="Remover arquivo"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  )
}
