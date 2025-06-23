'use client';

import Link from 'next/link';
import { MessageCircle, Mail, Phone } from 'lucide-react';
import { API_CONFIG } from '@/lib/api';

export default function Footer() {
  return (
    <footer
      className="bg-dark-950 border-t border-dark-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-red-gradient rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">W</span>
              </div>
              <span className="text-xl font-bold text-gradient">WebMarket</span>
            </div>
            <p className="text-dark-400 mb-4 max-w-md">
              Discover premium ready-made websites for your business. Browse our collection of professionally designed websites and find the perfect solution for your needs.
            </p>
            <div className="flex space-x-4">
              <a
                href={API_CONFIG.WHATSAPP.getUrl("Hello! I'm interested in your website services.")}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-green-400 hover:text-green-300 transition-colors"
              >
                <MessageCircle size={20} />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-dark-400 hover:text-red-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/websites" className="text-dark-400 hover:text-red-400 transition-colors">
                  Browse Websites
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-dark-400 hover:text-red-400 transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-dark-400 hover:text-red-400 transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2 text-dark-400">
                <Phone size={16} />
                <span>{API_CONFIG.WHATSAPP.NUMBER}</span>
              </li>
              <li className="flex items-center space-x-2 text-dark-400">
                <Mail size={16} />
                <span>info@webmarket.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-dark-800 mt-8 pt-8 text-center">
          <p className="text-dark-400">
            © 2024 WebMarket. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}