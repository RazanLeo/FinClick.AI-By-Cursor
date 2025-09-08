# دليل إصلاح مشكلة النشر على Vercel

## المشكلة التي تم حلها
كانت المشكلة في ملف `vercel.json` حيث كان يحتوي على إعدادات `functions` غير صحيحة:

```json
"functions": {
  "src/app/api/**/*.ts": {
    "runtime": "nodejs18.x"
  }
}
```

## الحل المطبق

### 1. إصلاح ملف vercel.json
تم إنشاء ملف `vercel.json` جديد ومبسط:

```json
{
  "version": 2,
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "outputDirectory": ".next",
  "env": {
    "NEXT_PUBLIC_APP_NAME": "FinClick.AI",
    "NEXT_PUBLIC_APP_URL": "https://finclick-ai.vercel.app",
    "NEXT_PUBLIC_APP_VERSION": "1.0.0"
  },
  "build": {
    "env": {
      "NEXT_PUBLIC_APP_NAME": "FinClick.AI",
      "NEXT_PUBLIC_APP_URL": "https://finclick-ai.vercel.app",
      "NEXT_PUBLIC_APP_VERSION": "1.0.0"
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "origin-when-cross-origin"
        }
      ]
    }
  ],
  "redirects": [
    {
      "source": "/home",
      "destination": "/",
      "permanent": true
    }
  ]
}
```

### 2. إضافة متغيرات البيئة المطلوبة
تم إنشاء ملف `.env.local` يحتوي على القيم الأساسية المطلوبة للبناء.

## خطوات النشر على Vercel

### 1. إعداد متغيرات البيئة في Vercel
اذهب إلى إعدادات المشروع في Vercel وأضف المتغيرات التالية:

#### متغيرات مطلوبة:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `GEMINI_API_KEY`
- `OPENAI_API_KEY`
- `FMP_API_KEY`
- `ALPHA_VANTAGE_API_KEY`
- `NEXT_PUBLIC_PAYTABS_MERCHANT_EMAIL`
- `NEXT_PUBLIC_PAYTABS_SECRET_KEY`
- `NEXT_PUBLIC_PAYTABS_SERVER_KEY`
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`

### 2. النشر
بعد إضافة المتغيرات، يمكنك النشر مباشرة من GitHub أو استخدام Vercel CLI:

```bash
vercel --prod
```

## ملاحظات مهمة

1. **لا ترفع ملف `.env.local`** إلى GitHub - إنه محمي بواسطة `.gitignore`
2. **أضف متغيرات البيئة الحقيقية** في إعدادات Vercel
3. **تأكد من أن جميع API keys صحيحة** قبل النشر
4. **اختبر المشروع محلياً** قبل النشر للتأكد من عمله

## التحقق من النشر
بعد النشر، تأكد من:
- أن الموقع يعمل بشكل صحيح
- أن جميع الصفحات تحمل بدون أخطاء
- أن API endpoints تعمل بشكل صحيح
- أن قاعدة البيانات متصلة بشكل صحيح

## الدعم
إذا واجهت أي مشاكل، راجع:
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- ملف `.env.example` للحصول على قائمة كاملة بالمتغيرات المطلوبة
