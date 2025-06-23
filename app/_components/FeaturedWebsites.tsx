'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Eye, ExternalLink, MessageCircle } from 'lucide-react';
import { API_CONFIG, buildApiUrl } from '@/lib/api';
import { motion } from 'framer-motion';
import { useSectionInView } from '@/lib/useSectionInView';

interface Website {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  type: string;
  mainImage: {
    secure_url: string;
    public_id: string;
  };
  technologies: string[];
  viewsCount: number;
  isResponsive: boolean;
  hasAdminPanel: boolean;
  hasDatabase: boolean;
  discountPercent?: number;
  finalPrice?: number;
}

export default function FeaturedWebsites() {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [loading, setLoading] = useState(true);
  const { ref, isInView } = useSectionInView({ threshold: 0.2 });
  useEffect(() => {
    fetchFeaturedWebsites();
  }, []);
  
  const fetchFeaturedWebsites = async () => {
    try {
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.WEBSITES.AVAILABLE));
      const data = await response.json();
      setWebsites(data.slice(0, 6)); // Show only first 6 websites
    } catch (error) {
      console.error('Error fetching websites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContactUs = (websiteName: string) => {
    const message = `Hi! I'm interested in the website: ${websiteName}. Can you provide more details?`;
    const whatsappUrl = API_CONFIG.WHATSAPP.getUrl(message);
    window.open(whatsappUrl, '_blank');
  };

  if (loading) {
    return (
      <motion.section
        ref={ref}
        initial={{ opacity: 0, y: 80 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="bg-dark-800 py-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Featured Websites
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-dark-900 rounded-xl overflow-hidden animate-pulse">
                <div className="h-48 bg-dark-700"></div>
                <div className="p-6">
                  <div className="h-4 bg-dark-700 rounded mb-2"></div>
                  <div className="h-3 bg-dark-700 rounded mb-4"></div>
                  <div className="h-8 bg-dark-700 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>
    );
  }

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 80 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="bg-dark-800 py-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Featured Websites
          </h2>
          <p className="text-dark-300 text-lg">
            Discover our most popular and high-quality websites
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {websites.map((website) => (
            <div
              key={website._id}
              className="bg-dark-900 rounded-xl overflow-hidden card-hover border border-dark-700 hover:border-red-500"
            >
              <div className="relative h-48 bg-dark-700">
                {website.mainImage?.secure_url ? (
                  <img
                    src={website.mainImage.secure_url}
                    alt={website.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-red-gradient flex items-center justify-center">
                    <span className="text-white font-bold text-2xl">
                      {website.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-dark-900/80 backdrop-blur-sm rounded-lg px-2 py-1">
                  {website.discountPercent && website.finalPrice && website.discountPercent > 0 ? (
                    <span className="flex items-center gap-2">
                      <span className="text-dark-400 line-through text-xs">
                        ${website.price}
                      </span>
                      <span className="bg-red-600 text-white px-1 py-0.5 rounded text-xs">
                        -{website.discountPercent}%
                      </span>
                      <span className="text-red-400 font-semibold text-sm">
                        ${website.finalPrice}
                      </span>
                    </span>
                  ) : (
                    <span className="text-red-400 font-semibold text-sm">
                      ${website.price}
                    </span>
                  )}
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-red-400 text-sm font-medium uppercase">
                    {website.type}
                  </span>
                  <div className="flex items-center text-dark-400 text-sm">
                    <Eye size={14} className="mr-1" />
                    {website.viewsCount}
                  </div>
                </div>

                <h3 className="text-white font-bold text-lg mb-2">
                  {website.name}
                </h3>

                <p className="text-dark-300 text-sm mb-4 line-clamp-2">
                  {website.description}
                </p>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {website.isResponsive && (
                    <span className="bg-dark-800 text-green-400 text-xs px-2 py-1 rounded">
                      Responsive
                    </span>
                  )}
                  {website.hasAdminPanel && (
                    <span className="bg-dark-800 text-blue-400 text-xs px-2 py-1 rounded">
                      Admin Panel
                    </span>
                  )}
                  {website.hasDatabase && (
                    <span className="bg-dark-800 text-purple-400 text-xs px-2 py-1 rounded">
                      Database
                    </span>
                  )}
                </div>

                {/* Technologies */}
                {website.technologies && website.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {website.technologies.slice(0, 3).map((tech, index) => (
                      <span
                        key={index}
                        className="bg-red-900/30 text-red-300 text-xs px-2 py-1 rounded"
                      >
                        {tech}
                      </span>
                    ))}
                    {website.technologies.length > 3 && (
                      <span className="text-dark-400 text-xs px-2 py-1">
                        +{website.technologies.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                <div className="flex gap-2">
                  <Link
                    href={`/websites/${website.slug}`}
                    className="flex-1 bg-dark-700 text-white text-center py-2 px-4 rounded-lg hover:bg-dark-600 transition-colors flex items-center justify-center space-x-2"
                  >
                    <ExternalLink size={16} />
                    <span>View Details</span>
                  </Link>
                  <button
                    onClick={() => handleContactUs(website.name)}
                    className="btn-primary flex items-center justify-center space-x-2 px-4"
                  >
                    <MessageCircle size={16} />
                    <span>Contact</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/websites" className="btn-primary">
            View All Websites
          </Link>
        </div>
      </div>
    </motion.section>
  );
}