import { Film, Mail } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import icon from "@/assets/icon.png";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-gradient-dark border-t border-cinema-border mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 font-bold">
              <img src={icon} alt="" className="h-6" />
              <span className="text-gradient text-2xl">Tickify</span>
            </Link>
            <p className="text-muted-foreground text-sm">
              Your premium destination for movie bookings and cinema
              experiences.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-foreground font-semibold">Quick Links</h3>
            <div className="space-y-2 text-sm">
              <a
                href="/"
                className="block text-muted-foreground hover:text-cinema-gold transition-colors"
              >
                Home
              </a>
              <a
                href="/bookings"
                className="block text-muted-foreground hover:text-cinema-gold transition-colors"
              >
                My Bookings
              </a>
              <a
                href="/profile"
                className="block text-muted-foreground hover:text-cinema-gold transition-colors"
              >
                Profile
              </a>
            </div>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-foreground font-semibold">Support</h3>
            <div className="space-y-2 text-sm">
              <a
                href="#"
                className="block text-muted-foreground hover:text-cinema-gold transition-colors"
              >
                Help Center
              </a>
              <a
                href="#"
                className="block text-muted-foreground hover:text-cinema-gold transition-colors"
              >
                Contact Us
              </a>
              <a
                href="#"
                className="block text-muted-foreground hover:text-cinema-gold transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="block text-muted-foreground hover:text-cinema-gold transition-colors"
              >
                Terms of Service
              </a>
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="text-foreground font-semibold">Connect</h3>
            <div className="flex space-x-4">
              <a
                href="https://github.com/aayanofficial5/tickify"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-cinema-gold transition-colors"
              >
                <FaGithub className="h-5 w-5" />
              </a>
              <a
                href="mailto:aayanofficial5@gmail.com"
                className="text-muted-foreground hover:text-cinema-gold transition-colors"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-cinema-border mt-8 pt-8 text-center">
          <p className="text-muted-foreground text-sm">
            © 2025 Tickify. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
