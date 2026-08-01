"use client";

import Image from "next/image";

interface ChatModalProps {
  onClose: () => void;
}

export default function ChatModal({ onClose }: ChatModalProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center scale-in z-30 pointer-events-auto p-4">
      {/* Clickable Backdrop to dismiss */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Figma Frame 2037_4378: Rounded card with 3D Robot Assistant graphic */}
      <div
        className="relative overflow-hidden rounded-[28px] flex items-center justify-center z-10 pointer-events-auto"
        style={{
          width: "min(680px, 92vw)",
          height: "min(340px, 50vh)",
          background: "linear-gradient(135deg, rgba(235,238,245,0.96) 0%, rgba(210,215,225,0.94) 100%)",
          border: "1.5px solid rgba(255, 255, 255, 0.7)",
          boxShadow:
            "0 25px 70px rgba(0, 0, 0, 0.75), 0 0 50px rgba(255, 255, 255, 0.1)",
        }}
      >


        {/* 3D Robot Assistant Full Banner Image matching Figma node 2037_4378 */}
        <div className="w-full h-full relative overflow-hidden rounded-[28px]">
          <Image
            src="/robot_ai_assistant_chat.jpg"
            alt="AI Assistant"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </div>
  );
}
