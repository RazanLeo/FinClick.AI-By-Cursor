
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FileUploadZoneProps {
  onFileUpload: (files: File[]) => void;
  language: 'ar' | 'en';
  maxFiles?: number;
}

const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  onFileUpload,
  language,
  maxFiles = 10
}) => {
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [errors, setErrors] = useState<string[]>([]);

  const content = {
    ar: {
      dragDrop: 'اسحب وأفلت الملفات هنا',
      or: 'أو',
      browse: 'استعرض الملفات',
      accepted: 'الملفات المقبولة: PDF, Excel, Word, صور',
      maxSize: 'الحد الأقصى: غير محدود',
      maxFiles: `حتى ${maxFiles} ملفات`,
      uploading: 'جاري الرفع...',
      error: 'خطأ',
      success: 'تم الرفع بنجاح'
    },
    en: {
      dragDrop: 'Drag & drop files here',
      or: 'or',
      browse: 'Browse files',
      accepted: 'Accepted: PDF, Excel, Word, Images',
      maxSize: 'Max size: Unlimited',
      maxFiles: `Up to ${maxFiles} files`,
      uploading: 'Uploading...',
      error: 'Error',
      success: 'Uploaded successfully'
    }
  };

  const t = content[language];

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setErrors([]);

    if (rejectedFiles.length > 0) {
      const errorMessages = rejectedFiles.map(file => {
        if (file.errors[0]?.code === 'file-too-large') {
          return language === 'ar' ? 
            `${file.file.name}: حجم الملف كبير جداً` :
            `${file.file.name}: File too large`;
        }
        if (file.errors[0]?.code === 'file-invalid-type') {
          return language === 'ar' ?
            `${file.file.name}: نوع الملف غير مدعوم` :
            `${file.file.name}: File type not supported`;
        }
        return file.errors[0]?.message;
      });
      setErrors(errorMessages);
      return;
    }

    // محاكاة رفع الملفات مع شريط التقدم
    acceptedFiles.forEach(file => {
      // بدء التقدم
      setUploadProgress(prev => ({
        ...prev,
        [file.name]: 0
      }));

      // محاكاة التقدم
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          const currentProgress = prev[file.name] || 0;
          if (currentProgress >= 100) {
            clearInterval(interval);
            return prev;
          }
          return {
            ...prev,
            [file.name]: currentProgress + 10
          };
        });
      }, 200);
    });

    // استدعاء دالة رفع الملفات
    setTimeout(() => {
      onFileUpload(acceptedFiles);
      setUploadProgress({});
    }, 2000);
  }, [onFileUpload, language]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp'],
      'text/csv': ['.csv']
    },
    maxFiles,
    multiple: true
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${
          isDragActive ? 'border-gold bg-gold/10' :
          isDragReject ? 'border-red-500 bg-red-500/10' :
          'border-gold/30 hover:border-gold hover:bg-gold/5'
        }`}
      >
        <input {...getInputProps()} />
        
        <motion.div
          initial={{ scale: 1 }}
          animate={{ scale: isDragActive ? 1.1 : 1 }}
          transition={{ duration: 0.2 }}
        >
          <Upload className={`w-16 h-16 mx-auto mb-4 ${
            isDragActive ? 'text-gold' :
            isDragReject ? 'text-red-500' :
            'text-gold/50'
          }`} />
        </motion.div>

        <p className="text-gold text-lg font-semibold mb-2">
          {t.dragDrop}
        </p>
        
        <p className="text-gold/70 mb-4">
          {t.or}{' '}
          <span className="text-gold underline">
            {t.browse}
          </span>
        </p>

        <div className="flex flex-col items-center space-y-1 text-sm text-gold/60">
          <p>{t.accepted}</p>
          <p>{t.maxSize}</p>
          <p>{t.maxFiles}</p>
        </div>

        {isDragActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-gold/5 rounded-2xl pointer-events-none"
          />
        )}
      </div>

      {/* عرض التقدم */}
      <AnimatePresence>
        {Object.entries(uploadProgress).map(([fileName, progress]) => (
          <motion.div
            key={fileName}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-3 bg-black/50 backdrop-blur-lg rounded-lg p-3 border border-gold/20"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <FileText className="w-4 h-4 text-gold mr-2" />
                <span className="text-gold/80 text-sm">{fileName}</span>
              </div>
              <span className="text-gold text-sm">{progress}%</span>
            </div>
            <div className="w-full bg-gold/20 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="bg-gold h-2 rounded-full"
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* عرض الأخطاء */}
      <AnimatePresence>
        {errors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-3"
          >
            {errors.map((error, index) => (
              <div
                key={index}
                className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-2 flex items-start"
              >
                <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-red-400 text-sm">{error}</span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FileUploadZone;
