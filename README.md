# FinClick.AI - منصة التحليل المالي الذكي الثوري

<div align="center">
  <img src="/logo.png" alt="FinClick.AI Logo" width="200"/>
  <h3>Revolutionary Intelligent Financial Analysis Platform</h3>
  <p>181 نوع تحليل مالي بضغطة زر واحدة</p>
</div>

## 🚀 المميزات الرئيسية

- ✨ **181 نوع تحليل مالي** شامل ومتكامل
- 🤖 **ذكاء اصطناعي متقدم** لمعالجة البيانات والتحليل
- 📊 **تقارير احترافية** بصيغ PDF, Word, Excel, PowerPoint
- 🌍 **مقارنات عالمية** على جميع المستويات
- 🔒 **أمان عالي** وحماية كاملة للبيانات
- ⚡ **سرعة فائقة** - نتائج في ثوانٍ معدودة
- 🌐 **ثنائي اللغة** عربي وإنجليزي بالكامل

## 📋 المتطلبات

- Node.js 18+ 
- npm أو yarn
- حساب Supabase
- مفاتيح API المطلوبة

## 🛠️ التثبيت

### 1. استنساخ المشروع

```bash
git clone https://github.com/yourusername/finclick-ai.git
cd finclick-ai
```

### 2. تثبيت الحزم

```bash
npm install
# أو
yarn install
```

### 3. إعداد متغيرات البيئة

قم بإنشاء ملف `.env.local` في المجلد الرئيسي وأضف المتغيرات التالية:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Gemini
GEMINI_API_KEY=your_gemini_api_key

# Financial Modeling Prep
FMP_API_KEY=your_fmp_api_key

# MongoDB
MONGODB_URI=your_mongodb_uri

# GitHub
GITHUB_TOKEN=your_github_token

# PayTabs Payment Gateway
PAYTABS_SERVER_KEY=your_paytabs_server_key
PAYTABS_CLIENT_KEY=your_paytabs_client_key
PAYTABS_PROFILE_ID=your_paytabs_profile_id

# SMTP Email Settings
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=finclick.ai@gmail.com
SMTP_PASS=your_email_password

# JWT Secret
JWT_SECRET=your_very_long_random_jwt_secret_key
```

### 4. إعداد قاعدة البيانات Supabase

#### جداول قاعدة البيانات المطلوبة:

```sql
-- جدول المستخدمين
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  company TEXT,
  phone TEXT,
  role TEXT CHECK (role IN ('admin', 'user', 'guest')),
  subscription JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- جدول التحليلات
CREATE TABLE analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  company_name TEXT,
  sector TEXT,
  activity TEXT,
  legal_entity TEXT,
  comparison_level TEXT,
  years_count INTEGER,
  analysis_types TEXT[],
  language TEXT CHECK (language IN ('ar', 'en')),
  status TEXT CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  result_data JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- جدول الاشتراكات
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  plan TEXT CHECK (plan IN ('monthly', 'annual')),
  status TEXT CHECK (status IN ('active', 'inactive', 'cancelled', 'expired')),
  amount DECIMAL(10, 2),
  currency TEXT DEFAULT 'SAR',
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  auto_renew BOOLEAN DEFAULT true,
  payment_method TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- جدول المدفوعات
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  subscription_id UUID REFERENCES subscriptions(id),
  amount DECIMAL(10, 2),
  currency TEXT DEFAULT 'SAR',
  status TEXT CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  payment_method TEXT,
  transaction_id TEXT,
  gateway_response JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- إنشاء الفهارس
CREATE INDEX idx_analyses_user_id ON analyses(user_id);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_payments_user_id ON payments(user_id);
```

### 5. تشغيل المشروع محلياً

```bash
npm run dev
# أو
yarn dev
```

افتح المتصفح على [http://localhost:3000](http://localhost:3000)

## 🚀 النشر على Vercel

### 1. رفع المشروع على GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. الربط مع Vercel

1. اذهب إلى [vercel.com](https://vercel.com)
2. اضغط على "Import Project"
3. اختر مستودع GitHub الخاص بك
4. أضف متغيرات البيئة في إعدادات Vercel
5. اضغط على "Deploy"

## 📱 الاستخدام

### حسابات النظام الافتراضية:

#### حساب المدير:
- **البريد:** Razan@FinClick.AI
- **كلمة المرور:** RazanFinClickAI@056300

#### حساب الضيف:
- **البريد:** Guest@FinClick.AI  
- **كلمة المرور:** GuestFinClickAI@123321

### خطوات التحليل:

1. **ارفق القوائم المالية** - PDF, Excel, Word أو صور
2. **حدد خيارات التحليل** - القطاع، النشاط، الكيان، المقارنة
3. **اضغط زر التحليل** - احصل على 181 تحليل في ثوانٍ

## 🏗️ هيكل المشروع

```
finclick-ai/
├── src/
│   ├── pages/          # صفحات Next.js
│   ├── components/      # مكونات React
│   ├── contexts/        # React Contexts
│   ├── hooks/          # Custom Hooks
│   ├── lib/            # المكتبات والأدوات
│   ├── services/       # خدمات API
│   ├── analysis/       # محرك التحليل المالي
│   ├── data/           # البيانات الثابتة
│   ├── locales/        # ملفات الترجمة
│   ├── styles/         # ملفات CSS
│   └── types/          # TypeScript Types
├── public/             # الملفات العامة
├── .env.local          # متغيرات البيئة
├── package.json        # التبعيات
├── tsconfig.json       # إعدادات TypeScript
├── tailwind.config.js  # إعدادات Tailwind
└── next.config.js      # إعدادات Next.js
```

## 🔧 التقنيات المستخدمة

- **Frontend:** Next.js 14, React 18, TypeScript
- **Styling:** Tailwind CSS, Framer Motion
- **Database:** Supabase (PostgreSQL)
- **AI/ML:** OpenAI GPT-4, Gemini, FinBERT
- **Charts:** Chart.js, D3.js, Recharts
- **Reports:** React-PDF, DOCX, PPTXGenJS
- **Payment:** PayTabs, Mada, Visa, PayPal
- **Deployment:** Vercel

## 📊 أنواع التحليل المتاحة

### التحليل الأساسي (55 نوع):
- التحليل الهيكلي للقوائم المالية (15)
- النسب المالية الأساسية (30)
- تحليلات التدفق والحركة (10)

### التحليل التطبيقي (38 نوع):
- تحليلات المقارنة المتقدمة (10)
- تحليلات التقييم والاستثمار (16)
- تحليلات الأداء والكفاءة (12)

### التحليل المتقدم (88 نوع):
- النمذجة والمحاكاة (15)
- التحليل الإحصائي والكمي (20)
- تحليل المحافظ والمخاطر (35)
- الكشف والتنبؤ الذكي (18)

## 🔒 الأمان والخصوصية

- تشفير كامل للبيانات (SSL/TLS)
- توافق مع معايير SAMA/CITC السعودية
- حماية GDPR/PDPL للبيانات الشخصية
- نسخ احتياطي يومي آمن
- مراقبة 24/7 للنظام

## 📞 الدعم الفني

- **البريد الإلكتروني:** finclick.ai@gmail.com
- **الهاتف:** 00966544827213
- **WhatsApp:** 00966544827213
- **Telegram:** 00966544827213

## 📄 الترخيص

جميع الحقوق محفوظة © 2025 FinClick.AI - رزان أحمد توفيق

## 🙏 شكر خاص

شكراً لجميع المساهمين والداعمين لهذا المشروع الثوري في عالم التحليل المالي.

---

<div align="center">
  صنع بـ ❤️ في المملكة العربية السعودية 🇸🇦
</div>
