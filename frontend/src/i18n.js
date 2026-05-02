import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // SEO
      "seo": {
        "title": "Musdar.dev | Enterprise Software Development Agency",
        "description": "Musdar.dev is a premium software development agency building scalable web applications, mobile platforms, and custom SaaS solutions for modern businesses.",
        "keywords": "web development, mobile development, software development, SaaS, React, Node.js, custom software, Musdar, musdar.dev, software company, react development, node.js development, saas development, custom software development, react.js, node.js, saas, web development company, mobile development company, software development company, web development agency, mobile development agency, software development agency, software development services, mobile app development, web app development, custom software development services, mobile application development services, web application development services, custom software development services"
      },
      // Navbar
      "nav": {
        "services": "Services",
        "why_us": "Why Us",
        "case_studies": "Case Studies",
        "company": "Company",
        "contact": "Contact",
        "start_project": "Start Project"
      },
      // Hero
      "hero": {
        "tagline": "Transforming ideas into scalable software",
        "title_1": "We build web & mobile systems",
        "title_2": "that help you automate and increase ",
        "description": "Empowering modern businesses with custom web applications, mobile platforms, and AI-driven software architecture designed for peak performance.",
        "cta_primary": "Start Your Project",
        "cta_secondary": "View Case Studies",
        "tech_stack": "Engineered with modern technologies"
      },
      // Services
      "services": {
        "badge": "Our Capabilities",
        "title_1": "Enterprise-grade",
        "title_2": "Services",
        "description": "We provide end-to-end software development services tailored to accelerate your digital transformation.",
        "items": [
          {
            "title": "Web Application Development",
            "desc": "Custom, scalable web applications built with React, Node.js, and modern cloud architecture for high performance."
          },
          {
            "title": "Mobile App Solutions",
            "desc": "Cross-platform mobile applications for iOS and Android, delivering native-like experiences with React Native."
          },
          {
            "title": "Custom SaaS Platforms",
            "desc": "End-to-end development of Software-as-a-Service products, featuring secure authentication, billing, and multi-tenant architecture."
          },
          {
            "title": "AI & API Integration",
            "desc": "Connect your systems with robust RESTful APIs and integrate modern AI capabilities to automate business workflows."
          },
          {
            "title": "UI/UX System Design",
            "desc": "Intuitive, conversion-optimized user interfaces and comprehensive design systems tailored to your brand identity."
          }
        ]
      },
      // Why Choose Us
      "why_us": {
        "badge": "Our Advantage",
        "title_1": "Why partner with",
        "title_2": "Musdar.dev?",
        "description": "We don't just write code; we build strategic digital assets. Our approach combines deep technical expertise with business acumen to deliver software that drives real ROI.",
        "bullets": [
          "100% In-house Engineering Team",
          "Transparent Pricing & Timelines",
          "Modern Tech Stack Guarantee"
        ],
        "items": [
          {
            "title": "Agile Development",
            "desc": "We use agile methodologies to ensure rapid iterations, continuous delivery, and full transparency throughout the product lifecycle."
          },
          {
            "title": "Enterprise Security",
            "desc": "Security is built-in from day one. We implement industry best practices to protect your data and ensure compliance."
          },
          {
            "title": "Scalable Architecture",
            "desc": "Our solutions are engineered to grow with your business, utilizing cloud-native technologies capable of handling massive traffic."
          },
          {
            "title": "Dedicated Support",
            "desc": "Beyond launch, we provide ongoing maintenance, monitoring, and dedicated support to keep your software running perfectly."
          }
        ]
      },
      // Case Studies
      "case_studies": {
        "badge": "Our Work",
        "title_1": "Featured",
        "title_2": "Case Studies",
        "description": "Explore how we've helped companies transform their operations through custom software development.",
        "loading": "Loading...",
        "error": "Error: Unable to load case studies",
        "empty": "New case studies are being prepared for publication.",
        "metrics": {
          "speed": "Faster Load",
          "conversion": "Conversion"
        }
      },
      // About Company
      "about": {
        "badge": "About Musdar",
        "title_1": "Building software that",
        "title_2": "drives progress",
        "desc_1": "Founded on the belief that robust software architecture is the foundation of modern business, Musdar.dev partners with forward-thinking organizations to build scalable digital products.",
        "desc_2": "We consist of a dedicated team of full-stack engineers, UI/UX designers, and product strategists who are passionate about writing clean code and creating intuitive user experiences.",
        "stats": [
          { "label": "Projects Delivered", "value": "50+" },
          { "label": "Client Satisfaction", "value": "99%" },
          { "label": "Lines of Code", "value": "1M+" },
          { "label": "Years Experience", "value": "3+" }
        ]
      },
      // CTA Section
      "cta": {
        "title": "Ready to scale?",
        "description": "Let's discuss how our engineering team can help bring your vision to life. Fill out the form or reach out directly.",
        "email_label": "Email Us",
        "whatsapp_label": "WhatsApp",
        "form": {
          "name": "Full Name",
          "name_placeholder": "John Doe",
          "email": "Work Email",
          "email_placeholder": "john@company.com",
          "details": "Project Details",
          "details_placeholder": "Tell us about your project timeline and requirements...",
          "btn_idle": "Send Message",
          "btn_submitting": "Sending...",
          "btn_success": "Message Sent Successfully!",
          "btn_error": "Error! Try Again"
        }
      },
      // Footer
      "footer": {
        "description": "A premium software development agency specializing in scalable web applications, mobile platforms, and digital transformation for modern enterprises.",
        "services": "Services",
        "company": "Company",
        "about": "About Us",
        "case_studies": "Case Studies",
        "contact": "Contact",
        "privacy": "Privacy Policy",
        "rights": "All rights reserved.",
        "location": "Based in Saudi Arabia. Working Worldwide."
      }
    }
  },
  ar: {
    translation: {
      "seo": {
        "title": "مسدار | وكالة تطوير برمجيات المؤسسات والشركات",
        "description": "وكالة مسدار هي شريكك التقني لتطوير تطبيقات ويب قابلة للتوسع، حلول الجوال المبتكرة، ومنصات SaaS مخصصة للشركات والمؤسسات الحديثة في السعودية والخليج.",
        "keywords": "تطوير برمجيات، شركة برمجة، برمجة تطبيقات، تطوير ويب، برمجة تطبيقات الجوال، حلول SaaS، شركة تقنية، مسدار، تطوير برمجيات مخصصة، شركة برمجة في السعودية، تطوير تطبيقات الجوال، تطوير المواقع الإلكترونية، هندسة البرمجيات، تحول رقمي، برمجة مخصصة، ريأكت، نود جي اس، تطوير أنظمة الشركات"
      },
      "nav": {
        "services": "خدماتنا",
        "why_us": "لماذا نحن",
        "case_studies": "دراسات الحالة",
        "company": "الشركة",
        "contact": "اتصل بنا",
        "start_project": "ابدأ مشروعك"
      },
      "hero": {
        "tagline":"نحوّل الأفكار إلى برمجيات قابلة للتوسع",
        "title_1": "نبنى تطبيقات و منصات رقمية",
        "title_2": "لمساعدت شركتك على النمو  بسرعة.",
        "description": "نمكّن الشركات الحديثة من خلال تطبيقات ويب مخصصة، ومنصات هواتف محمولة، وبنية برمجية مدعومة بالذكاء الاصطناعي ومصممة لأعلى درجات الأداء.",
        "cta_primary": "ابدأ مشروعك",
        "cta_secondary": "شاهد أعمالنا",
        "tech_stack": "مُصمم بأحدث التقنيات"
      },
      "services": {
        "badge": "قدراتنا التقنية",
        "title_1": "خدمات بمستوى",
        "title_2": "المؤسسات",
        "description": "نقدم خدمات تطوير برمجيات شاملة ومصممة خصيصاً لتسريع التحول الرقمي لأعمالك.",
        "items": [
          {
            "title": "تطوير تطبيقات الويب",
            "desc": "تطبيقات ويب مخصصة وقابلة للتوسع، مبنية باستخدام React و Node.js وهندسة سحابية حديثة لضمان أداء عالٍ."
          },
          {
            "title": "حلول تطبيقات الجوال",
            "desc": "تطبيقات هواتف محمولة متوافقة مع أنظمة iOS و Android، تقدم تجارب سلسة وأداءً أصيلاً باستخدام React Native."
          },
          {
            "title": "منصات SaaS مخصصة",
            "desc": "تطوير شامل لمنتجات البرمجيات كخدمة (SaaS)، تتميز بأنظمة مصادقة آمنة، فواتير، وبنية متعددة المستأجرين."
          },
          {
            "title": "تكامل الذكاء الاصطناعي و API",
            "desc": "ربط أنظمتك بواجهات برمجة تطبيقات (API) قوية ودمج قدرات الذكاء الاصطناعي الحديثة لأتمتة سير العمل في شركتك."
          },
          {
            "title": "تصميم أنظمة UI/UX",
            "desc": "واجهات مستخدم بديهية ومُحسّنة لزيادة التحويلات، وأنظمة تصميم شاملة تتناسب مع هوية علامتك التجارية."
          }
        ]
      },
      "why_us": {
        "badge": "ما يميزنا",
        "title_1": "لماذا الشراكة مع",
        "title_2": "Musdar.dev؟",
        "description": "نحن لا نكتب الكود البرمجي فحسب؛ بل نبني أصولاً رقمية استراتيجية. يجمع نهجنا بين الخبرة الفنية العميقة والفهم التجاري لتقديم برمجيات تحقق عائداً حقيقياً على الاستثمار.",
        "bullets": [
          "فريق هندسي متكامل وداخلي 100%",
          "شفافية تامة في التسعير والجداول الزمنية",
          "ضمان استخدام أحدث التقنيات البرمجية"
        ],
        "items": [
          {
            "title": "تطوير مرن ورشيق (Agile)",
            "desc": "نستخدم منهجيات مرنة لضمان تسليم سريع ومتواصل، مع شفافية كاملة طوال دورة حياة المنتج."
          },
          {
            "title": "أمان على مستوى المؤسسات",
            "desc": "الأمان مدمج منذ اليوم الأول. نطبق أفضل ممارسات الصناعة لحماية بياناتك وضمان الامتثال للمعايير."
          },
          {
            "title": "بنية تقنية قابلة للتوسع",
            "desc": "تم تصميم حلولنا لتنمو مع عملك، باستخدام تقنيات سحابية قادرة على التعامل مع أحجام زيارات ضخمة."
          },
          {
            "title": "دعم فني متخصص",
            "desc": "ما بعد الإطلاق، نقدم صيانة مستمرة ومراقبة ودعماً مخصصاً للحفاظ على عمل برمجياتك بكفاءة تامة."
          }
        ]
      },
      "case_studies": {
        "badge": "أعمالنا",
        "title_1": "أبرز",
        "title_2": "دراسات الحالة",
        "description": "اكتشف كيف ساعدنا الشركات على تحويل عملياتها من خلال تطوير برمجيات مخصصة.",
        "loading": "جاري التحميل...",
        "error": "خطأ: تعذر تحميل دراسات الحالة",
        "empty": "يتم الآن إعداد دراسات حالة جديدة للنشر.",
        "metrics": {
          "speed": "سرعة التحميل",
          "conversion": "زيادة التحويلات"
        }
      },
      "about": {
        "badge": "عن مسدار",
        "title_1": "نبني برمجيات",
        "title_2": "تدفع عجلة التقدم",
        "desc_1": "تأسيساً على الإيمان بأن البنية البرمجية القوية هي أساس الأعمال الحديثة، تتعاون Musdar.dev مع المنظمات ذات الرؤية المستقبلية لبناء منتجات رقمية قابلة للتوسع.",
        "desc_2": "نحن فريق متخصص يتألف من مهندسي برمجيات متكاملين، ومصممي واجهات وتجارب المستخدم، واستراتيجيي منتجات يجمعهم الشغف بكتابة كود برمجي نظيف وابتكار تجارب استخدام بديهية.",
        "stats": [
          { "label": "مشروع تم تسليمه", "value": "+50" },
          { "label": "نسبة رضا العملاء", "value": "99%" },
          { "label": "سطر برمجي", "value": "+1M" },
          { "label": "سنوات من الخبرة", "value": "+3" }
        ]
      },
      "cta": {
        "title": "مستعد لتوسيع نطاق عملك؟",
        "description": "دعنا نناقش كيف يمكن لفريقنا الهندسي مساعدتك في تحويل رؤيتك إلى واقع. املأ النموذج أو تواصل معنا مباشرة.",
        "email_label": "راسلنا عبر البريد",
        "whatsapp_label": "واتساب",
        "form": {
          "name": "الاسم الكامل",
          "name_placeholder": "أحمد عبدالله",
          "email": "البريد الإلكتروني للعمل",
          "email_placeholder": "ahmed@company.com",
          "details": "تفاصيل المشروع",
          "details_placeholder": "أخبرنا عن الجدول الزمني لمشروعك ومتطلباتك...",
          "btn_idle": "إرسال الرسالة",
          "btn_submitting": "جاري الإرسال...",
          "btn_success": "تم إرسال رسالتك بنجاح!",
          "btn_error": "حدث خطأ! يرجى المحاولة مرة أخرى"
        }
      },
      "footer": {
        "description": "وكالة تطوير برمجيات رائدة متخصصة في تطبيقات الويب القابلة للتوسع، منصات الجوال، والتحول الرقمي للمؤسسات الحديثة.",
        "services": "خدماتنا",
        "company": "الشركة",
        "about": "من نحن",
        "case_studies": "دراسات الحالة",
        "contact": "اتصل بنا",
        "privacy": "سياسة الخصوصية",
        "rights": "جميع الحقوق محفوظة.",
        "location": "مقرنا في المملكة العربية السعودية. ونعمل حول العالم."
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", // default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
