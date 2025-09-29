// src/components/Footer.tsx
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-green-900 text-green-100 py-16 relative overflow-hidden">
      <div className="absolute -top-16 -left-16 w-40 h-40 bg-green-700 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-60 h-60 bg-green-800 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>

      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-4 text-white">SwachhNation</h2>
            <p className="text-green-200 text-sm">
              Join us in creating a cleaner, greener India. Empower communities, track progress, and earn rewards for sustainability.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-green-200">
              <li>
                <Link to="/get-started" className="hover:text-white">Get Started</Link>
              </li>
              <li>
                <Link to="/learning" className="hover:text-white">Learning Hub</Link>
              </li>
              <li>
                <Link to="/features" className="hover:text-white">Features</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white">About Us</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-green-200">
              <li><a href="#" className="hover:text-white">Blog</a></li>
              <li><a href="#" className="hover:text-white">FAQ</a></li>
              <li><a href="#" className="hover:text-white">Support</a></li>
              <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <p className="text-green-200 text-sm mb-4">Email: support@swachhnation.org</p>
            <p className="text-green-200 text-sm mb-4">Phone: +91 12345 67890</p>

            <div className="flex gap-4 mt-2">
              <a href="#" className="text-green-200 hover:text-white"><Facebook size={20} /></a>
              <a href="#" className="text-green-200 hover:text-white"><Twitter size={20} /></a>
              <a href="#" className="text-green-200 hover:text-white"><Instagram size={20} /></a>
              <a href="#" className="text-green-200 hover:text-white"><Linkedin size={20} /></a>
            </div>
          </div>
        </div>

        <div className="border-t border-green-700 mt-12 pt-6 text-center text-green-200 text-sm">
          &copy; {new Date().getFullYear()} SwachhNation. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;