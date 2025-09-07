import React, { useState } from 'react';

interface FooterProps {
  language: 'ar' | 'en';
}

const Footer: React.FC<FooterProps> = ({ language }) => {
  const t = (ar: string, en: string) => (language === 'ar' ? ar : en);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const openModal = (modalType: string) => {
    setActiveModal(modalType);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const renderModal = () => {
    if (!activeModal) return null;

    const modalContent = {
      vision: {
        ar: {
          title: 'الرؤية والرسالة والأهداف',
          content: `
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gold mb-3">الرؤية (Vision)</h3>
                <p className="text-gold/80 leading-relaxed">
                  أن نُحدث ثورة عالمية في عالم التحليل المالي من خلال منصة ذكاء اصطناعي سعودية مبتكرة ترافق صناع القرار لحظيًا، وتُصبح المعيار الذهبي للتحليل المالي الذكي الشامل لجميع أنواع التحليل المالي بضغطة زر. وأن نكون المستثمر الأول في التقنية المالية القائمة على الـ AI في المنطقة والعالم.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gold mb-3">الرسالة (Mission)</h3>
                <p className="text-gold/80 leading-relaxed">
                  تسخير قوة الذكاء الاصطناعي المتقدم لتوفير نظام تحليل مالي شامل وفوري يُمكّن جميع الشركات والمؤسسات والمنظمات من فهم أدائها المالي، اكتشاف المخاطر والفرص، واتخاذ قرارات دقيقة، بسرعة وسهولة غير مسبوقة، دون الحاجة لخبرات مالية متعمقة.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gold mb-3">الأهداف (Objectives)</h3>
                <ul className="space-y-2 text-gold/80">
                  <li>• قيادة التحول الرقمي في التحليل المالي</li>
                  <li>• إتاحة التحليل المالي العميق بضغطة زر</li>
                  <li>• الأتمتة الكاملة للعملية التحليلية</li>
                  <li>• الشمولية والعمق في التحليل</li>
                  <li>• سهولة الاستخدام</li>
                  <li>• السرعة والدقة والموثوقية</li>
                  <li>• تحقيق قيمة تجارية مستدامة</li>
                </ul>
              </div>
            </div>
          `
        },
        en: {
          title: 'Vision, Mission & Objectives',
          content: `
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gold mb-3">Vision</h3>
                <p className="text-gold/80 leading-relaxed">
                  To revolutionize the world of financial analysis through an innovative Saudi AI platform that accompanies decision-makers in real-time, becoming the gold standard for comprehensive intelligent financial analysis for all types of financial analysis at the click of a button. And to be the first investor in AI-based financial technology in the region and the world.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gold mb-3">Mission</h3>
                <p className="text-gold/80 leading-relaxed">
                  Harnessing the power of advanced artificial intelligence to provide a comprehensive and instant financial analysis system that enables all companies, institutions and organizations to understand their financial performance, discover risks and opportunities, and make accurate decisions with unprecedented speed and ease, without the need for deep financial expertise.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gold mb-3">Objectives</h3>
                <ul className="space-y-2 text-gold/80">
                  <li>• Lead digital transformation in financial analysis</li>
                  <li>• Provide deep financial analysis at the click of a button</li>
                  <li>• Complete automation of the analytical process</li>
                  <li>• Comprehensiveness and depth in analysis</li>
                  <li>• Ease of use</li>
                  <li>• Speed, accuracy and reliability</li>
                  <li>• Achieving sustainable commercial value</li>
                </ul>
              </div>
            </div>
          `
        }
      },
      services: {
        ar: {
          title: 'الخدمات الرئيسية',
          content: `
            <div className="space-y-4">
              <ul className="space-y-3 text-gold/80">
                <li>• تحليل مالي ذكي وفوري وتفصيلي لأكثر من 181 تحليلًا ماليًا مع الذكاء الاصطناعي</li>
                <li>• تقارير تفصيلية وعروض تقديمية تلقائية بجميع الصيغ جاهزة للعرض والتسليم والمناقشة باللغتين العربية والإنجليزية، أكثر من 50 صفحة</li>
                <li>• مقارنة أداء الشركة بمتوسط الصناعة ومقارنة أداء الشركة مع شركات مشابهة على المستوى المحلي والإقليمي والعالمي</li>
                <li>• لوحة تحكم تفاعلية مؤشرات الأداء الفورية مثل SWOT والمخاطر والتوقعات</li>
                <li>• رفع ملفات بأي صيغة يدعم أنواع ملفات متعددة وإدخال يدوي حتى 10 سنوات مالية</li>
                <li>• نظام اشتراكات وحسابات محمية حسابات للمستخدمين والمدراء وتجربة مجانية مع حماية واشتراك مباشر</li>
              </ul>
            </div>
          `
        },
        en: {
          title: 'Main Services',
          content: `
            <div className="space-y-4">
              <ul className="space-y-3 text-gold/80">
                <li>• Smart, instant and detailed financial analysis for more than 181 financial analyses with AI</li>
                <li>• Detailed reports and automatic presentations in all formats ready for display, delivery and discussion in Arabic and English, more than 50 pages</li>
                <li>• Compare company performance with industry average and compare company performance with similar companies at local, regional and global levels</li>
                <li>• Interactive dashboard with instant performance indicators such as SWOT, risks and forecasts</li>
                <li>• Upload files in any format supporting multiple file types and manual entry up to 10 financial years</li>
                <li>• Subscription system and protected accounts for users and administrators with free trial and direct subscription</li>
              </ul>
            </div>
          `
        }
      },
      privacy: {
        ar: {
          title: 'سياسة الخصوصية',
          content: `
            <div className="space-y-4">
              <p className="text-gold/80 leading-relaxed">
                مرحبًا بك في FinClick.AI. نحن نحترم خصوصيتك ونلتزم بحماية البيانات الشخصية الخاصة بك. توضح سياسة الخصوصية هذه كيفية جمعنا واستخدامنا وحمايتنا ومشاركتنا لمعلوماتك عند استخدامك لمنصتنا الذكية للتحليل المالي.
              </p>
              <div>
                <h4 className="text-lg font-semibold text-gold mb-2">المعلومات التي نجمعها</h4>
                <ul className="space-y-1 text-gold/80">
                  <li>• بيانات التسجيل (الاسم، البريد الإلكتروني، رقم الهاتف، اسم الشركة، القطاع، النشاط، الكيان القانوني ومعلومات الشركة العامة)</li>
                  <li>• بيانات الدفع (لا يتم تخزين بيانات البطاقة كاملة على خوادمنا)</li>
                  <li>• الملفات المالية التي تقوم برفعها (قوائم مالية، موازين مراجعة، جداول)</li>
                  <li>• بيانات الاستخدام والتفاعل داخل المنصة</li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gold mb-2">حماية البيانات</h4>
                <ul className="space-y-1 text-gold/80">
                  <li>• تشفير كامل للبيانات أثناء النقل (SSL) وداخل الخوادم</li>
                  <li>• سياسات وصول صارمة، ونسخ احتياطي دوري، ورصد اختراقات</li>
                  <li>• لا تتم مشاركة بياناتك مع أي طرف ثالث إلا بموافقتك أو وفقًا للقانون</li>
                </ul>
              </div>
            </div>
          `
        },
        en: {
          title: 'Privacy Policy',
          content: `
            <div className="space-y-4">
              <p className="text-gold/80 leading-relaxed">
                Welcome to FinClick.AI. We respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, protect and share your information when you use our intelligent financial analysis platform.
              </p>
              <div>
                <h4 className="text-lg font-semibold text-gold mb-2">Information We Collect</h4>
                <ul className="space-y-1 text-gold/80">
                  <li>• Registration data (name, email, phone number, company name, sector, activity, legal entity and general company information)</li>
                  <li>• Payment data (card data is not stored completely on our servers)</li>
                  <li>• Financial files you upload (financial statements, trial balances, tables)</li>
                  <li>• Usage and interaction data within the platform</li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gold mb-2">Data Protection</h4>
                <ul className="space-y-1 text-gold/80">
                  <li>• Complete encryption of data during transmission (SSL) and within servers</li>
                  <li>• Strict access policies, regular backups, and breach monitoring</li>
                  <li>• Your data is not shared with any third party except with your consent or according to law</li>
                </ul>
              </div>
            </div>
          `
        }
      },
      terms: {
        ar: {
          title: 'شروط الاستخدام',
          content: `
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-gold mb-2">الاستخدام المصرّح به</h4>
                <p className="text-gold/80">المنصة تخدم أغراض التحليل المالي فقط، ويُحظر استخدامها لأغراض غير قانونية أو مشبوهة أو لإنشاء خدمات منافسة.</p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gold mb-2">الملكية الفكرية</h4>
                <p className="text-gold/80">جميع حقوق النظم، الكود، المحتوى، التصميم، والتحليلات مملوكة حصريًا لـ FinClick.AI ولا يحق للمستخدم إعادة توزيع أو بيع المخرجات كمحتوى آلي.</p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gold mb-2">الاشتراك</h4>
                <p className="text-gold/80">أي تأخير في الدفع يوقف الحساب تلقائيًا. ولا يحق للمستخدم مشاركة الحساب مع غيره. اشتراك واحد = مستخدم واحد فقط.</p>
              </div>
            </div>
          `
        },
        en: {
          title: 'Terms of Use',
          content: `
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-gold mb-2">Authorized Use</h4>
                <p className="text-gold/80">The platform serves financial analysis purposes only, and its use for illegal, suspicious purposes or to create competing services is prohibited.</p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gold mb-2">Intellectual Property</h4>
                <p className="text-gold/80">All rights to systems, code, content, design, and analyses are exclusively owned by FinClick.AI and the user has no right to redistribute or sell outputs as automated content.</p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gold mb-2">Subscription</h4>
                <p className="text-gold/80">Any delay in payment automatically stops the account. The user has no right to share the account with others. One subscription = one user only.</p>
              </div>
            </div>
          `
        }
      },
      security: {
        ar: {
          title: 'سياسة الأمان',
          content: `
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-gold mb-2">حماية البنية التحتية</h4>
                <ul className="space-y-1 text-gold/80">
                  <li>• استضافة البيانات داخل مراكز بيانات سعودية آمنة متوافقة مع معايير SAMA / CITC</li>
                  <li>• استخدام جدر حماية متعددة الطبقات وأنظمة كشف التسلل</li>
                  <li>• تشفير الاتصال بالكامل باستخدام TLS 1.3 / HTTPS</li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gold mb-2">حماية البيانات</h4>
                <ul className="space-y-1 text-gold/80">
                  <li>• تشفير جميع الملفات والبيانات داخل قواعد البيانات بتقنيات AES-256</li>
                  <li>• تقسيم الصلاحيات بحيث لا يُسمح لأي موظف بالوصول لبيانات المستخدمين إلا عند الضرورة</li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gold mb-2">النسخ الاحتياطي</h4>
                <ul className="space-y-1 text-gold/80">
                  <li>• نسخ احتياطي يومي آمن داخل مراكز بيانات منفصلة داخل المملكة</li>
                  <li>• إمكانية الاسترجاع خلال دقائق في حال الطوارئ</li>
                </ul>
              </div>
            </div>
          `
        },
        en: {
          title: 'Security Policy',
          content: `
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-gold mb-2">Infrastructure Protection</h4>
                <ul className="space-y-1 text-gold/80">
                  <li>• Data hosting within secure Saudi data centers compliant with SAMA / CITC standards</li>
                  <li>• Use of multi-layer firewalls and intrusion detection systems</li>
                  <li>• Complete connection encryption using TLS 1.3 / HTTPS</li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gold mb-2">Data Protection</h4>
                <ul className="space-y-1 text-gold/80">
                  <li>• Encryption of all files and data within databases using AES-256 technologies</li>
                  <li>• Permission division so no employee can access user data except when necessary</li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gold mb-2">Backup</h4>
                <ul className="space-y-1 text-gold/80">
                  <li>• Daily secure backup within separate data centers within the Kingdom</li>
                  <li>• Recovery capability within minutes in emergency situations</li>
                </ul>
              </div>
            </div>
          `
        }
      },
      compliance: {
        ar: {
          title: 'سياسة الامتثال',
          content: `
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-gold mb-2">نظام حماية البيانات الشخصية السعودي (PDPL)</h4>
                <ul className="space-y-1 text-gold/80">
                  <li>• عدم جمع أي بيانات شخصية إلا بهدف تقديم الخدمة فقط</li>
                  <li>• الحصول على موافقة المستخدم الصريحة قبل معالجة بياناته</li>
                  <li>• السماح للمستخدم بالوصول أو التعديل أو حذف بياناته متى ما أراد</li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gold mb-2">البنك المركزي السعودي (SAMA)</h4>
                <ul className="space-y-1 text-gold/80">
                  <li>• تطبيق ضوابط الأمن السيبراني الصادرة من SAMA</li>
                  <li>• إجراء تقييم مخاطر دوري ورفع تقارير الامتثال عند الطلب</li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gold mb-2">هيئة الاتصالات والفضاء والتقنية (CITC)</h4>
                <ul className="space-y-1 text-gold/80">
                  <li>• استضافة البيانات ومعالجتها داخل المملكة</li>
                  <li>• الالتزام بسياسة Cloud Computing Regulatory Framework</li>
                </ul>
              </div>
            </div>
          `
        },
        en: {
          title: 'Compliance Policy',
          content: `
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-gold mb-2">Saudi Personal Data Protection Law (PDPL)</h4>
                <ul className="space-y-1 text-gold/80">
                  <li>• Not collecting any personal data except for the purpose of providing the service only</li>
                  <li>• Obtaining explicit user consent before processing their data</li>
                  <li>• Allowing the user to access, modify or delete their data whenever they want</li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gold mb-2">Saudi Central Bank (SAMA)</h4>
                <ul className="space-y-1 text-gold/80">
                  <li>• Apply cybersecurity controls issued by SAMA</li>
                  <li>• Conduct periodic risk assessment and submit compliance reports when requested</li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gold mb-2">Communications and Information Technology Commission (CITC)</h4>
                <ul className="space-y-1 text-gold/80">
                  <li>• Data hosting and processing within the Kingdom</li>
                  <li>• Commitment to Cloud Computing Regulatory Framework policy</li>
                </ul>
              </div>
            </div>
          `
        }
      },
      intellectual: {
        ar: {
          title: 'سياسة حقوق الملكية الفكرية',
          content: `
            <div className="space-y-4">
              <p className="text-gold/80 leading-relaxed">
                جميع الحقوق محفوظة © 2025 لصالح مالك ومنشئ منصة FinClick.AI - رزان أحمد توفيق
              </p>
              <div>
                <h4 className="text-lg font-semibold text-gold mb-2">الملكية الفكرية للنظام</h4>
                <p className="text-gold/80 leading-relaxed">
                  يُعتبر نظام FinClick.AI بجميع مكوناته البرمجية، فكرة النظام والمنصة وفكرة العمل وآلية سير العمل، هيكل المنصة، أساليب التحليل المالية المستخدمة، طريقة التشغيل، خوارزميات الذكاء الاصطناعي، التقنيات المستخدمة، نماذج التقارير، واجهات الاستخدام، قاعدة البيانات، أسلوب العرض وطريقة التقديم براءة اختراع مملوكة بالكامل لصاحب المنصة ومطورها.
                </p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gold mb-2">العلامة التجارية</h4>
                <p className="text-gold/80 leading-relaxed">
                  شعار FinClick.AI والاسم التجاري FinClick.AI وعبارة "FinClick.AI-Revolutionary Intelligent Financial Analysis System" هي علامة تجارية مسجّلة مملوكة لصاحب النظام.
                </p>
              </div>
            </div>
          `
        },
        en: {
          title: 'Intellectual Property Rights Policy',
          content: `
            <div className="space-y-4">
              <p className="text-gold/80 leading-relaxed">
                All rights reserved © 2025 for the owner and creator of FinClick.AI platform - Razan Ahmed Tawfiq
              </p>
              <div>
                <h4 className="text-lg font-semibold text-gold mb-2">System Intellectual Property</h4>
                <p className="text-gold/80 leading-relaxed">
                  The FinClick.AI system with all its software components, system idea and platform and business idea and workflow mechanism, platform structure, financial analysis methods used, operation method, artificial intelligence algorithms, technologies used, report templates, user interfaces, database, display style and presentation method are fully owned by the platform owner and developer.
                </p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gold mb-2">Trademark</h4>
                <p className="text-gold/80 leading-relaxed">
                  The FinClick.AI logo, trade name FinClick.AI and the phrase "FinClick.AI-Revolutionary Intelligent Financial Analysis System" are registered trademarks owned by the system owner.
                </p>
              </div>
            </div>
          `
        }
      },
      payment: {
        ar: {
          title: 'سياسة الدفع والاشتراك',
          content: `
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-gold mb-2">خطط الاشتراك</h4>
                <ul className="space-y-2 text-gold/80">
                  <li>• الاشتراك الشهري: 5,000 ريال سعودي</li>
                  <li>• الاشتراك السنوي: 60,000 ريال (خصم 10% عند الدفع السنوي = 54,000 ريال)</li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gold mb-2">وسائل الدفع</h4>
                <p className="text-gold/80">MADA / Visa / Master Card / PayPal / Apple Pay</p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gold mb-2">سياسة الاسترجاع</h4>
                <p className="text-gold/80">لا يوجد استرجاع مالي بعد بدء تفعيل الاشتراك بأي خطة وإرسال بيانات الدخول ولكن يمكن إلغاء التجديد المقبل بإشعار قبل 7 أيام من انتهاء الاشتراك.</p>
              </div>
            </div>
          `
        },
        en: {
          title: 'Payment and Subscription Policy',
          content: `
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-gold mb-2">Subscription Plans</h4>
                <ul className="space-y-2 text-gold/80">
                  <li>• Monthly subscription: 5,000 Saudi Riyals</li>
                  <li>• Annual subscription: 60,000 Riyals (10% discount on annual payment = 54,000 Riyals)</li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gold mb-2">Payment Methods</h4>
                <p className="text-gold/80">MADA / Visa / Master Card / PayPal / Apple Pay</p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gold mb-2">Refund Policy</h4>
                <p className="text-gold/80">No financial refund after starting subscription activation with any plan and sending login data, but the next renewal can be cancelled with notice 7 days before the subscription expires.</p>
              </div>
            </div>
          `
        }
      },
      manual: {
        ar: {
          title: 'دليل استخدام المنصة',
          content: `
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-gold mb-2">1. إنشاء حساب وتفعيل الاشتراك</h4>
                <ol className="space-y-1 text-gold/80 list-decimal list-inside">
                  <li>انتقل إلى صفحة الاشتراك</li>
                  <li>اختر الخطة (شهرية أو سنوية)</li>
                  <li>أدخل بياناتك (الاسم – البريد – رقم الجوال – اسم الشركة)</li>
                  <li>قم بالدفع عبر MADA / Visa / Master Card / PayPal / Apple Pay</li>
                  <li>ستصلك رسالة تفعيل على بريدك تحتوي على بيانات الدخول</li>
                </ol>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gold mb-2">2. بدء عملية التحليل</h4>
                <ol className="space-y-1 text-gold/80 list-decimal list-inside">
                  <li>إرفاق المستندات (PDF, Excel, Word, Scan أو صورة)</li>
                  <li>تحديد خيارات التحليل (اسم الشركة، القطاع، النشاط، الكيان القانوني)</li>
                  <li>اختيار نوع المقارنة (محلي، خليجي، عربي، عالمي)</li>
                  <li>اختيار سنوات التحليل (من سنة إلى عشر سنوات)</li>
                  <li>اختيار لغة التقرير (عربي أو إنجليزي)</li>
                  <li>اضغط زر "ابدأ التحليل"</li>
                </ol>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gold mb-2">3. النتائج والتقارير</h4>
                <ul className="space-y-1 text-gold/80">
                  <li>• مشاهدة لوحة التحليل على الشاشة</li>
                  <li>• تحميل تقرير Word / PDF شامل (50+ صفحة)</li>
                  <li>• تحميل عرض PowerPoint تلقائي</li>
                  <li>• طباعة التقارير والعروض التقديمية</li>
                </ul>
              </div>
            </div>
          `
        },
        en: {
          title: 'Platform User Manual',
          content: `
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-gold mb-2">1. Create Account and Activate Subscription</h4>
                <ol className="space-y-1 text-gold/80 list-decimal list-inside">
                  <li>Go to subscription page</li>
                  <li>Choose plan (monthly or annual)</li>
                  <li>Enter your data (name - email - phone - company name)</li>
                  <li>Pay via MADA / Visa / Master Card / PayPal / Apple Pay</li>
                  <li>You will receive an activation message on your email containing login data</li>
                </ol>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gold mb-2">2. Start Analysis Process</h4>
                <ol className="space-y-1 text-gold/80 list-decimal list-inside">
                  <li>Attach documents (PDF, Excel, Word, Scan or image)</li>
                  <li>Set analysis options (company name, sector, activity, legal entity)</li>
                  <li>Choose comparison type (local, Gulf, Arab, global)</li>
                  <li>Choose analysis years (from one to ten years)</li>
                  <li>Choose report language (Arabic or English)</li>
                  <li>Click "Start Analysis" button</li>
                </ol>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gold mb-2">3. Results and Reports</h4>
                <ul className="space-y-1 text-gold/80">
                  <li>• View analysis dashboard on screen</li>
                  <li>• Download comprehensive Word / PDF report (50+ pages)</li>
                  <li>• Download automatic PowerPoint presentation</li>
                  <li>• Print reports and presentations</li>
                </ul>
              </div>
            </div>
          `
        }
      }
    };

    const content = modalContent[activeModal as keyof typeof modalContent];
    if (!content) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-black border border-gold/30 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gold">
                {content[language].title}
              </h2>
              <button
                onClick={closeModal}
                className="text-gold/70 hover:text-gold text-2xl"
              >
                ×
              </button>
            </div>
            <div 
              className="prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: content[language].content }}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <footer className="bg-black/90 border-t border-gold/20 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-gold to-yellow-400 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-black font-bold text-xl">F</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gold">FinClick.AI</h3>
                  <p className="text-gold/60 text-sm">
                    {t('آخر تحديث: أغسطس 2025', 'Last Updated: August 2025')}
                  </p>
                </div>
              </div>
              <p className="text-gold/70 text-sm leading-relaxed">
                {t('منصة التحليل المالي الذكية والثورية', 'Revolutionary Intelligent Financial Analysis Platform')}
              </p>
            </div>

            {/* Quick Links - Company */}
            <div>
              <h4 className="text-gold font-semibold mb-4">{t('الشركة', 'Company')}</h4>
              <ul className="space-y-2 text-gold/70 text-sm">
                <li>
                  <button 
                    onClick={() => openModal('vision')}
                    className="hover:text-gold transition-colors text-left"
                  >
                    {t('الرؤية والرسالة والأهداف', 'Vision, Mission & Objectives')}
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => openModal('services')}
                    className="hover:text-gold transition-colors text-left"
                  >
                    {t('الخدمات الرئيسية', 'Main Services')}
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => openModal('manual')}
                    className="hover:text-gold transition-colors text-left"
                  >
                    {t('دليل الاستخدام', 'User Manual')}
                  </button>
                </li>
              </ul>
            </div>

            {/* Quick Links - Legal */}
            <div>
              <h4 className="text-gold font-semibold mb-4">{t('السياسات القانونية', 'Legal Policies')}</h4>
              <ul className="space-y-2 text-gold/70 text-sm">
                <li>
                  <button 
                    onClick={() => openModal('privacy')}
                    className="hover:text-gold transition-colors text-left"
                  >
                    {t('سياسة الخصوصية', 'Privacy Policy')}
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => openModal('terms')}
                    className="hover:text-gold transition-colors text-left"
                  >
                    {t('شروط الاستخدام', 'Terms of Use')}
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => openModal('security')}
                    className="hover:text-gold transition-colors text-left"
                  >
                    {t('سياسة الأمان', 'Security Policy')}
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => openModal('compliance')}
                    className="hover:text-gold transition-colors text-left"
                  >
                    {t('سياسة الامتثال', 'Compliance Policy')}
                  </button>
                </li>
              </ul>
            </div>

            {/* Quick Links - Rights & Payment */}
            <div>
              <h4 className="text-gold font-semibold mb-4">{t('الحقوق والدفع', 'Rights & Payment')}</h4>
              <ul className="space-y-2 text-gold/70 text-sm">
                <li>
                  <button 
                    onClick={() => openModal('intellectual')}
                    className="hover:text-gold transition-colors text-left"
                  >
                    {t('حقوق الملكية الفكرية', 'Intellectual Property Rights')}
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => openModal('payment')}
                    className="hover:text-gold transition-colors text-left"
                  >
                    {t('سياسة الدفع والاشتراك', 'Payment & Subscription Policy')}
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Information */}
          <div className="border-t border-gold/20 mt-8 pt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-gold font-semibold mb-4">{t('التواصل والدعم', 'Contact & Support')}</h4>
                <div className="space-y-2 text-gold/70 text-sm">
                  <p>📍 {t('المملكة العربية السعودية، جدة', 'Kingdom of Saudi Arabia, Jeddah')}</p>
                  <p>📧 Email: finclick.ai@gmail.com</p>
                  <p>📞 Phone: +966 54 482 7213</p>
                  <p>💬 WhatsApp: +966 54 482 7213</p>
                  <p>📱 Telegram: +966 54 482 7213</p>
                </div>
              </div>
              <div>
                <h4 className="text-gold font-semibold mb-4">{t('ساعات الدعم', 'Support Hours')}</h4>
                <div className="space-y-2 text-gold/70 text-sm">
                  <p>{t('دعم فني متوفر يوميًا', 'Technical support available daily')}</p>
                  <p>{t('من الساعة 10 صباحًا حتى 5 مساءً', 'From 10 AM to 5 PM')}</p>
                  <p>{t('بتوقيت السعودية', 'Saudi Arabia Time')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gold/20 mt-8 pt-8 text-center">
            <p className="text-gold/60 text-sm">
              © 2025 FinClick.AI {t('جميع الحقوق محفوظة', 'All Rights Reserved')} | 
              {t('صنع في المملكة العربية السعودية', 'Made in Kingdom of Saudi Arabia')} 🇸🇦
            </p>
            <p className="text-gold/50 text-xs mt-2">
              {t('رزان أحمد توفيق - مالك ومطور المنصة', 'Razan Ahmed Tawfiq - Platform Owner & Developer')}
            </p>
          </div>
        </div>
      </footer>
      {renderModal()}
    </>
  );
};

export default Footer;
