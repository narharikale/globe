import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, X, Copy } from 'lucide-react';
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
  
  // In a real app, this would be a dynamic URL with the user's ID
  const shareUrl = `${window.location.origin}?invite=${username}`;
  
  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleShare = () => {
    // Check if Web Share API is available and if we're in a secure context
    if (navigator.share && window.isSecureContext) {
      try {
        navigator.share({
          title: 'Globetrotter Challenge',
          text: `I've scored ${score.correct} correct answers in Globetrotter Challenge! Can you beat me?`,
          url: shareUrl,
        }).catch(error => {
          // If share fails (user cancels or other error), fall back to modal
          console.log('Share failed:', error);
          setIsOpen(true);
        });
      } catch (error) {
        console.log('Share error:', error);
        setIsOpen(true);
      }
    } else {
      // If Web Share API is not available, show the modal
      setIsOpen(true);
    }
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
                    {username} has scored {score.correct} correct answers! Can you beat that?
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