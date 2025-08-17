import React, { useState } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { 
  Search, 
  ExternalLink, 
  Book, 
  Wrench, 
  AlertTriangle,
  Lightbulb,
  MapPin,
  Globe
} from 'lucide-react';

export const SearchSystem: React.FC = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const searchCategories = [
    { id: 'all', label: t('الكل', 'All'), icon: Search },
    { id: 'parts', label: t('قطع الغيار', 'Parts'), icon: Wrench },
    { id: 'dtc', label: t('أكواد الأعطال', 'DTC Codes'), icon: AlertTriangle },
    { id: 'manuals', label: t('الدلائل', 'Manuals'), icon: Book },
    { id: 'tips', label: t('نصائح', 'Tips'), icon: Lightbulb },
  ];

  const mockSearchResults = [
    {
      id: 1,
      title: 'حساس تدفق الهواء - Mass Air Flow Sensor',
      description: 'موقع حساس تدفق الهواء في محرك تويوتا كامري 2018',
      category: 'parts',
      url: 'https://www.toyota.com/owners/parts-service',
      type: 'external'
    },
    {
      id: 2,
      title: 'DTC P0171 - System Too Lean Bank 1',
      description: 'شرح مفصل لكود العطل P0171 وطرق الإصلاح',
      category: 'dtc',
      url: 'https://www.obd-codes.com/p0171',
      type: 'external'
    },
    {
      id: 3,
      title: 'دليل فحص حساسات الهواء',
      description: 'دليل شامل لفحص وتشخيص حساسات الهواء في السيارات',
      category: 'manuals',
      url: '#',
      type: 'internal'
    },
    {
      id: 4,
      title: 'نصائح فحص الفولتية بالملتيمتر',
      description: 'كيفية فحص الفولتية بشكل صحيح باستخدام جهاز الملتيمتر',
      category: 'tips',
      url: '#',
      type: 'internal'
    }
  ];

  const performSearch = () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    
    // محاكاة البحث
    setTimeout(() => {
      const filtered = mockSearchResults.filter(result => 
        (selectedCategory === 'all' || result.category === selectedCategory) &&
        (result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
         result.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      
      setSearchResults(filtered);
      setIsSearching(false);
    }, 1000);
  };

  const getCategoryIcon = (category: string) => {
    const categoryData = searchCategories.find(cat => cat.id === category);
    const Icon = categoryData?.icon || Search;
    return <Icon className="w-4 h-4" />;
  };

  const getCategoryBadgeVariant = (category: string) => {
    switch (category) {
      case 'parts': return 'primary';
      case 'dtc': return 'danger';
      case 'manuals': return 'success';
      case 'tips': return 'warning';
      default: return 'gray';
    }
  };

  return (
    <div className="space-y-6">
      {/* عنوان الصفحة */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {t('البحث الذكي', 'Smart Search')}
        </h1>
        <p className="text-gray-600 mt-1">
          {t('ابحث عن قطع الغيار والمعلومات التقنية', 'Search for parts and technical information')}
        </p>
      </div>

      {/* نموذج البحث */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* فئات البحث */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('فئة البحث', 'Search Category')}
              </label>
              <div className="flex flex-wrap gap-2">
                {searchCategories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`
                        inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
                        transition-colors duration-200
                        ${selectedCategory === category.id
                          ? 'bg-blue-100 text-blue-700 border border-blue-200'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }
                      `}
                    >
                      <Icon className="w-4 h-4" />
                      {category.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* مربع البحث */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('كلمات البحث', 'Search Terms')}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && performSearch()}
                  placeholder={t('مثال: حساس الهواء كامري 2018', 'Example: air sensor camry 2018')}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <Button onClick={performSearch} disabled={isSearching}>
                  <Search className="w-4 h-4 me-2" />
                  {isSearching ? t('جاري البحث...', 'Searching...') : t('بحث', 'Search')}
                </Button>
              </div>
            </div>

            {/* اقتراحات سريعة */}
            <div>
              <p className="text-sm text-gray-600 mb-2">
                {t('اقتراحات سريعة:', 'Quick suggestions:')}
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  'حساس الهواء',
                  'كود P0171',
                  'فحص الفولتية',
                  'مخطط الأسلاك',
                  'برمجة الثروتل'
                ].map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => setSearchQuery(suggestion)}
                    className="px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* نتائج البحث */}
      {searchResults.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {t('نتائج البحث', 'Search Results')} ({searchResults.length})
          </h2>
          
          <div className="space-y-4">
            {searchResults.map((result) => (
              <Card key={result.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getCategoryIcon(result.category)}
                        <h3 className="text-lg font-medium text-gray-900">
                          {result.title}
                        </h3>
                        <Badge 
                          variant={getCategoryBadgeVariant(result.category)}
                          size="sm"
                        >
                          {searchCategories.find(cat => cat.id === result.category)?.label}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-600 mb-4">
                        {result.description}
                      </p>
                      
                      <div className="flex items-center gap-3">
                        <Button 
                          size="sm"
                          onClick={() => result.type === 'external' ? window.open(result.url, '_blank') : null}
                        >
                          {result.type === 'external' ? (
                            <>
                              <ExternalLink className="w-4 h-4 me-2" />
                              {t('فتح الرابط', 'Open Link')}
                            </>
                          ) : (
                            <>
                              <Book className="w-4 h-4 me-2" />
                              {t('عرض التفاصيل', 'View Details')}
                            </>
                          )}
                        </Button>
                        
                        {result.type === 'external' && (
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Globe className="w-4 h-4" />
                            <span>{t('رابط خارجي', 'External link')}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* حالة البحث الفارغة */}
      {searchResults.length === 0 && searchQuery && !isSearching && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {t('لم يتم العثور على نتائج', 'No results found')}
            </h3>
            <p className="text-gray-600">
              {t('جرب استخدام كلمات مختلفة أو اختر فئة أخرى', 'Try using different words or select another category')}
            </p>
          </CardContent>
        </Card>
      )}

      {/* حالة البداية */}
      {searchResults.length === 0 && !searchQuery && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {t('ابدأ البحث', 'Start Searching')}
            </h3>
            <p className="text-gray-600 mb-4">
              {t('استخدم البحث للعثور على قطع الغيار ومعلومات تقنية مفيدة', 'Use search to find parts and helpful technical information')}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 text-start">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <h4 className="font-medium text-blue-900">
                    {t('مواقع القطع', 'Part Locations')}
                  </h4>
                </div>
                <p className="text-sm text-blue-700">
                  {t('اعثر على موقع أي قطعة في السيارة', 'Find the location of any part in the car')}
                </p>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-green-600" />
                  <h4 className="font-medium text-green-900">
                    {t('أكواد الأعطال', 'Error Codes')}
                  </h4>
                </div>
                <p className="text-sm text-green-700">
                  {t('تفسير شامل لجميع أكواد الأعطال', 'Comprehensive explanation of all error codes')}
                </p>
              </div>
              
              <div className="p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Book className="w-5 h-5 text-yellow-600" />
                  <h4 className="font-medium text-yellow-900">
                    {t('الدلائل التقنية', 'Technical Manuals')}
                  </h4>
                </div>
                <p className="text-sm text-yellow-700">
                  {t('دلائل مفصلة لجميع عمليات الصيانة', 'Detailed manuals for all maintenance procedures')}
                </p>
              </div>
              
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="w-5 h-5 text-purple-600" />
                  <h4 className="font-medium text-purple-900">
                    {t('نصائح الخبراء', 'Expert Tips')}
                  </h4>
                </div>
                <p className="text-sm text-purple-700">
                  {t('نصائح عملية من خبراء التشخيص', 'Practical tips from diagnostic experts')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};