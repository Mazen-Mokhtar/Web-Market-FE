'use client';

import { Users, Target, Award, Heart, Globe, Code, Zap, Shield } from 'lucide-react';

export default function AboutPage() {
  const features = [
    {
      icon: Globe,
      title: 'مواقع متنوعة',
      description: 'مجموعة واسعة من المواقع في مختلف المجالات والتخصصات'
    },
    {
      icon: Code,
      title: 'جودة عالية',
      description: 'جميع المواقع مطورة بأحدث التقنيات ومعايير الجودة العالمية'
    },
    {
      icon: Zap,
      title: 'سرعة في التسليم',
      description: 'تسليم فوري للمواقع بعد إتمام عملية الشراء'
    },
    {
      icon: Shield,
      title: 'أمان وموثوقية',
      description: 'نضمن أمان المعاملات وحماية بيانات العملاء'
    }
  ];

  const team = [
    {
      name: 'أحمد محمد',
      role: 'مؤسس ومطور رئيسي',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300',
      description: 'خبرة 8 سنوات في تطوير المواقع والتطبيقات'
    },
    {
      name: 'فاطمة أحمد',
      role: 'مديرة التصميم',
      image: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=300',
      description: 'متخصصة في تصميم واجهات المستخدم وتجربة المستخدم'
    },
    {
      name: 'محمد علي',
      role: 'مطور واجهات أمامية',
      image: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=300',
      description: 'خبير في React وNext.js وتقنيات الويب الحديثة'
    }
  ];

  const stats = [
    { number: '500+', label: 'موقع متاح' },
    { number: '1000+', label: 'عميل راضي' },
    { number: '50+', label: 'فئة مختلفة' },
    { number: '99%', label: 'معدل الرضا' }
  ];

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            من نحن
          </h1>
          <p className="text-xl text-dark-300 mb-8 leading-relaxed">
            نحن منصة رائدة في مجال بيع المواقع الجاهزة، نهدف إلى توفير حلول ويب متكاملة 
            وعالية الجودة للأفراد والشركات الراغبة في إطلاق مشاريعهم الرقمية بسرعة وكفاءة.
          </p>
          <div className="flex justify-center space-x-4 space-x-reverse">
            <div className="w-16 h-16 bg-red-gradient rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-2xl">W</span>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-dark-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="text-center md:text-right">
              <div className="w-16 h-16 bg-blue-900/30 rounded-xl flex items-center justify-center mx-auto md:mx-0 mb-6">
                <Target className="text-blue-400" size={32} />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">رؤيتنا</h2>
              <p className="text-dark-300 leading-relaxed">
                أن نكون المنصة الأولى عالمياً في مجال توفير المواقع الجاهزة عالية الجودة، 
                ونساهم في تمكين رواد الأعمال والشركات من تحقيق أهدافهم الرقمية بأسرع وقت وأقل تكلفة.
              </p>
            </div>

            <div className="text-center md:text-right">
              <div className="w-16 h-16 bg-green-900/30 rounded-xl flex items-center justify-center mx-auto md:mx-0 mb-6">
                <Heart className="text-green-400" size={32} />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">مهمتنا</h2>
              <p className="text-dark-300 leading-relaxed">
                نسعى لتوفير مواقع ويب احترافية ومتطورة تلبي احتياجات عملائنا المتنوعة، 
                مع ضمان أعلى معايير الجودة والأمان، وتقديم دعم فني متميز لضمان نجاح مشاريعهم.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              لماذا تختارنا؟
            </h2>
            <p className="text-dark-300 text-lg">
              نقدم لك أفضل الحلول والخدمات في مجال المواقع الجاهزة
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-red-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="text-red-400" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-dark-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-dark-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              إنجازاتنا بالأرقام
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-red-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-dark-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              فريق العمل
            </h2>
            <p className="text-dark-300 text-lg">
              تعرف على الفريق المتميز الذي يقف وراء نجاح منصتنا
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-dark-800 rounded-xl p-6 text-center border border-dark-700">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold text-white mb-2">{member.name}</h3>
                <p className="text-red-400 mb-3">{member.role}</p>
                <p className="text-dark-300 text-sm">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-dark-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
            قيمنا الأساسية
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="w-16 h-16 bg-blue-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Award className="text-blue-400" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">الجودة</h3>
              <p className="text-dark-300">
                نلتزم بتقديم أعلى معايير الجودة في جميع منتجاتنا وخدماتنا
              </p>
            </div>

            <div>
              <div className="w-16 h-16 bg-green-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="text-green-400" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">العملاء أولاً</h3>
              <p className="text-dark-300">
                رضا عملائنا هو أولويتنا القصوى ونسعى دائماً لتجاوز توقعاتهم
              </p>
            </div>

            <div>
              <div className="w-16 h-16 bg-purple-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap className="text-purple-400" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">الابتكار</h3>
              <p className="text-dark-300">
                نواكب أحدث التطورات التقنية ونبتكر حلولاً متطورة ومبدعة
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            هل لديك أسئلة؟
          </h2>
          <p className="text-dark-300 text-lg mb-8">
            نحن هنا لمساعدتك. تواصل معنا في أي وقت
          </p>
          <a
            href={`https://wa.me/+201234567890?text=${encodeURIComponent('مرحباً! أريد الاستفسار عن خدماتكم')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center space-x-2 space-x-reverse"
          >
            <span>تواصل معنا</span>
          </a>
        </div>
      </section>
    </div>
  );
}