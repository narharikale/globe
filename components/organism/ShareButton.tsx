import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, X, Copy, Twitter, Facebook, MessageCircle, Mail } from 'lucide-react';
import { Button } from './Button';

interface ShareButtonProps {
  username: string;
  score: {
    correct: number;
    incorrect: number;
  };
}

export const ShareButton: React.FC<ShareButtonProps> = ({ username, score }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Generate a URL with the user's name and score
  const shareUrl = `${window.location.origin}?player=${encodeURIComponent(username)}&score=${score.correct}`;
  
  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleShare = () => {
    // Always open the custom modal
    setIsOpen(true);
  };

  const shareMessage = `I've scored ${score.correct} correct answers in Globetrotter Challenge! Can you beat me?`;
  
  const socialShareUrls = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}&url=${encodeURIComponent(shareUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareMessage)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${shareMessage} ${shareUrl}`)}`,
    email: `mailto:?subject=${encodeURIComponent('Globetrotter Challenge')}&body=${encodeURIComponent(`${shareMessage}\n\n${shareUrl}`)}`
  };
  
  return (
    <>
      <Button 
        onClick={handleShare}
        variant="outline"
        className="flex items-center"
      >
        <Share2 className="w-4 h-4 mr-2" />
        Challenge a Friend
      </Button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Challenge a Friend</h3>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="mb-6">
                <div className="bg-indigo-50 rounded-lg p-4 mb-4">
                  <p className="text-indigo-800 font-medium">
                    You scored {score.correct}!
                  </p>
                  <p className="text-indigo-700 mt-2">
                    Challenge your friends to beat your score!
                  </p>
                </div>
                
                <div className="flex items-center bg-gray-100 rounded-lg overflow-hidden mb-2">
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="flex-1 bg-transparent px-3 py-2 outline-none text-sm"
                  />
                  <button
                    onClick={handleCopy}
                    className="bg-indigo-600 text-white p-2 hover:bg-indigo-700"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                </div>
                
                {copied && (
                  <p className="text-green-600 text-sm">Link copied to clipboard!</p>
                )}

                <div className="mt-4">
                  <p className="text-gray-700 mb-2 font-medium">Share via:</p>
                  <div className="flex space-x-3">
                    <a 
                      href={socialShareUrls.twitter} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-[#1DA1F2] text-white p-2 rounded-full hover:bg-opacity-90"
                    >
                      <Twitter className="w-5 h-5" />
                    </a>
                    <a 
                      href={socialShareUrls.facebook} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-[#4267B2] text-white p-2 rounded-full hover:bg-opacity-90"
                    >
                      <Facebook className="w-5 h-5" />
                    </a>
                    <a 
                      href={socialShareUrls.whatsapp} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-[#25D366] text-white p-2 rounded-full hover:bg-opacity-90"
                    >
                      <MessageCircle className="w-5 h-5" />
                    </a>
                    <a 
                      href={socialShareUrls.email} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-gray-600 text-white p-2 rounded-full hover:bg-opacity-90"
                    >
                      <Mail className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={() => setIsOpen(false)}>
                  Close
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};