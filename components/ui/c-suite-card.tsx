import Image from "next/image";
import React, { useState, useEffect } from "react";

interface CSuiteAdvisorCardProps {
  name?: string;
  title?: string;
  expertise?: string;
  avatar?:
    | string
    | { src: string; alt?: string; width: number; height: number };
  isActive?: boolean;
  isClicked?: boolean;
  isReplying?: boolean;
  isThinking?: boolean;
  primaryColor?: string;
  className?: string;
  onClick?: () => void;
}

const CSuiteAdvisorCard: React.FC<CSuiteAdvisorCardProps> = ({
  name,
  title,
  // expertise = "Strategic Leadership & Vision",
  avatar,
  isActive = false,
  isReplying = false,
  isClicked = false,
  isThinking = false,
  primaryColor = "gray",
  className = "",
  onClick,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [aiThinking, setAiThinking] = useState(false);
  const [speakingPulse, setSpeakingPulse] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);

  const aiMessages = isClicked ? ["Ready to assist..."] : [name || "Advisor"];

  // Color mapping for CSS custom properties
  const colorMap: Record<string, { light: string; medium: string; dark: string; shadow: string }> = {
    blue: { light: "#60a5fa", medium: "#3b82f6", dark: "#1e40af", shadow: "#3b82f6" },
    green: { light: "#4ade80", medium: "#22c55e", dark: "#15803d", shadow: "#22c55e" },
    purple: { light: "#a78bfa", medium: "#8b5cf6", dark: "#7c3aed", shadow: "#8b5cf6" },
    pink: { light: "#f472b6", medium: "#ec4899", dark: "#be185d", shadow: "#ec4899" },
    gray: { light: "#9ca3af", medium: "#6b7280", dark: "#374151", shadow: "#6b7280" },
  };

  const colors = colorMap[primaryColor] || colorMap.gray;

  useEffect(() => {
    const loadTimer = setTimeout(() => setIsLoaded(true), 200);

    // AI thinking animation
    const thinkingTimer = setInterval(() => {
      setAiThinking((prev) => !prev);
      if (!aiThinking) {
        setMessageIndex((prev) => (prev + 1) % aiMessages.length);
      }
    }, 2500);

    // Speaking pulse for meeting-like feel
    const speakingTimer = setInterval(() => {
      setSpeakingPulse((prev) => !prev);
    }, 800);

    return () => {
      clearTimeout(loadTimer);
      clearInterval(thinkingTimer);
      clearInterval(speakingTimer);
    };
  }, [aiThinking, aiMessages.length]);

  return (
    <div
      onClick={onClick}
      style={{
        '--primary-light': colors.light,
        '--primary-medium': colors.medium,
        '--primary-dark': colors.dark,
        '--primary-shadow': colors.shadow,
      } as React.CSSProperties}
      className={`
        relative h-40 w-full
        bg-black border 
        ${
          isReplying
            ? "border-opacity-40 shadow-lg"
            : isActive
            ? "border-opacity-50 shadow-md"
            : "border-gray-800/60 hover:border-gray-700/80"
        }
        rounded-xl overflow-hidden
        cursor-pointer group
        transition-all duration-400 ease-out
        hover:shadow-xl hover:shadow-black/40
        ${
          isReplying
            ? "scale-[1.02]"
            : isActive
            ? "scale-[1.01]"
            : "hover:scale-[1.005]"
        }
        ${className}
      `}>
      {/* Background Gradient */}
      <div
        className={`
        absolute inset-0 transition-all duration-500
        ${
          isReplying
            ? "bg-gradient-to-br from-black via-black to-black"
            : isActive
            ? "bg-gradient-to-br from-black via-black to-black"
            : "bg-gradient-to-br from-gray-950/50 via-black to-gray-950/30"
        }
      `}
        style={{
          background: isReplying 
            ? `linear-gradient(to bottom right, ${colors.dark}40, black, ${colors.dark}20)`
            : isActive
            ? `linear-gradient(to bottom right, ${colors.dark}30, black, ${colors.dark}10)`
            : undefined
        }}
      />

      {/* Neural Network Pattern */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 200 200">
          <defs>
            <pattern
              id="neural-net"
              x="0"
              y="0"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="1" fill="currentColor" />
              <line
                x1="20"
                y1="20"
                x2="35"
                y2="15"
                stroke="currentColor"
                strokeWidth="0.5"
                opacity="0.3"
              />
              <line
                x1="20"
                y1="20"
                x2="5"
                y2="25"
                stroke="currentColor"
                strokeWidth="0.5"
                opacity="0.3"
              />
            </pattern>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill="url(#neural-net)"
            className="text-blue-400"
          />
        </svg>
      </div>

      {/* Main Content - Centered Layout */}
      <div className="relative z-10 p-4 h-full flex flex-col">
        {/* Status Bar */}
        <div className="flex items-center justify-between mb-4">
          {/* AI Terminal Status */}
          <div
            className={`
            flex items-center gap-1.5 px-2 py-1 rounded-full text-xs
            ${
              isReplying
                ? "bg-opacity-40 border border-opacity-30"
                : isActive
                ? "bg-opacity-50 border border-opacity-40"
                : "bg-gray-900/60 border border-gray-700/40 text-gray-400"
            }
            transition-all duration-300
          `}
            style={{
              backgroundColor: isReplying 
                ? `${colors.dark}40`
                : isActive
                ? `${colors.dark}50`
                : undefined,
              borderColor: isReplying
                ? `${colors.medium}30`
                : isActive
                ? `${colors.dark}40`
                : undefined,
              color: isReplying
                ? colors.light
                : isActive
                ? colors.medium
                : undefined
            }}
          >
            <div className="flex gap-1">
              <div className="w-1 h-1 bg-red-400 rounded-full"></div>
              <div className="w-1 h-1 bg-yellow-400 rounded-full"></div>
              <div
                className={`
                w-1 h-1 rounded-full transition-colors duration-300
                ${
                  isReplying
                    ? "animate-pulse"
                    : "bg-green-400"
                }
              `}
                style={{
                  backgroundColor: isReplying ? colors.medium : undefined
                }}
              ></div>
            </div>
            <span className="font-mono ml-1">
              {isThinking
                ? "thinking"
                : isReplying
                ? "responding"
                : isActive
                ? "active"
                : "ready"}
            </span>
          </div>

          {/* Status Indicator */}
          <div
            className={`
              w-2 h-2 rounded-full transition-all duration-300
              ${
                isThinking
                  ? "bg-yellow-400 animate-pulse shadow-sm"
                  : isReplying
                  ? "animate-pulse shadow-sm"
                  : isActive
                  ? ""
                  : "bg-emerald-500"
              }
            `}
            style={{
              backgroundColor: isThinking 
                ? undefined 
                : isReplying 
                ? colors.medium 
                : isActive 
                ? colors.medium 
                : undefined,
              boxShadow: isThinking 
                ? "0 0 0 1px rgba(250, 204, 21, 0.5)" 
                : isReplying 
                ? `0 0 0 1px ${colors.shadow}80`
                : undefined
            }}
          ></div>
        </div>

        {/* Center Section - Avatar & Info */}
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-3">
          {/* Avatar */}
          <div className="relative">
            <div
              className={`
              w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-500
              ${
                isThinking
                  ? "border-yellow-400/60 shadow-lg"
                  : isReplying
                  ? "border-opacity-60 shadow-lg"
                  : isActive
                  ? "border-opacity-50 shadow-md"
                  : "border-gray-700/60 group-hover:border-gray-600/80"
              }
            `}
              style={{
                borderColor: isThinking 
                  ? undefined 
                  : isReplying 
                  ? `${colors.medium}60` 
                  : isActive 
                  ? `${colors.medium}50` 
                  : undefined,
                boxShadow: isThinking 
                  ? "0 10px 15px -3px rgba(250, 204, 21, 0.2)" 
                  : isReplying 
                  ? `0 10px 15px -3px ${colors.shadow}20` 
                  : isActive 
                  ? `0 4px 6px -1px ${colors.shadow}20` 
                  : undefined
              }}
            >
              {avatar ? (
                <Image
                  src={avatar}
                  alt={name || "Advisor"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className={`
                  w-full h-full flex items-center justify-center relative overflow-hidden
                  ${
                    isReplying
                      ? ""
                      : isActive
                      ? ""
                      : "bg-gradient-to-br from-gray-700 to-gray-900"
                  }
                  transition-all duration-500
                `}
                  style={{
                    background: isReplying 
                      ? `linear-gradient(to bottom right, ${colors.medium}, ${colors.dark})`
                      : isActive
                      ? `linear-gradient(to bottom right, ${colors.dark}, ${colors.dark}90)`
                      : undefined
                  }}
                >
                  {/* Background Pattern */}
                  <div className="absolute inset-0">
                    <div
                      className={`
                      w-full h-full transition-opacity duration-500
                      ${
                        isActive || isReplying
                          ? ""
                          : "bg-gradient-to-br from-white/8 via-transparent to-white/4"
                      }
                    `}
                      style={{
                        background: isActive || isReplying
                          ? `linear-gradient(to bottom right, ${colors.medium}15, transparent, ${colors.medium}10)`
                          : undefined
                      }}
                    ></div>
                  </div>

                  {/* Role Icon */}
                  <svg
                    className={`
                    w-7 h-7 relative z-10 transition-colors duration-300
                    ${
                      isActive || isReplying
                        ? ""
                        : "text-gray-300"
                    }
                  `}
                    style={{
                      color: isActive || isReplying ? colors.light : undefined
                    }}
                    fill="currentColor"
                    viewBox="0 0 24 24">
                    <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 7C14.4 7 14 7.4 14 8S14.4 9 15 9H21ZM3 9H9C9.6 9 10 8.6 10 8S9.6 7 9 7H3V9ZM12 7.5C13.7 7.5 15 8.8 15 10.5V11H21V13H15V22H13V13H11V22H9V13H3V11H9V10.5C9 8.8 10.3 7.5 12 7.5Z" />
                  </svg>
                </div>
              )}
            </div>

            {/* Speaking Indicator - Subtle meeting-style */}
            {(isReplying || isThinking) && (
              <div
                className={`
                absolute -top-1 -right-1 w-3 h-3 rounded-full border border-black
                transition-all duration-500
                ${
                  speakingPulse
                    ? isThinking
                      ? "bg-yellow-400 scale-110"
                      : "scale-110"
                    : isThinking
                    ? "bg-yellow-500 scale-100"
                    : "scale-100"
                }
              `}
                style={{
                  backgroundColor: isThinking ? undefined : speakingPulse ? colors.medium : colors.dark
                }}
              ></div>
            )}

            {/* Active Checkmark */}
            {isActive && !isReplying && !isThinking && (
              <div
                className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-black flex items-center justify-center"
                style={{
                  backgroundColor: colors.medium
                }}>
                <svg
                  className="w-2.5 h-2.5 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            )}
          </div>

          {/* AI Chat Simulation */}
          <div className="w-full max-w-[80%]">
            <div
              className={`
              px-3 py-1.5 rounded-lg text-xs flex items-center justify-center gap-2
              transition-all duration-700
              ${
                isThinking
                  ? "bg-yellow-900/40 text-yellow-300 border border-yellow-700/30"
                  : isReplying
                  ? "bg-opacity-40 text-opacity-100 border border-opacity-30"
                  : isActive
                  ? "bg-opacity-50 text-opacity-100 border border-opacity-40"
                  : "bg-gray-900/60 text-gray-500 border border-gray-800/40"
              }
              ${aiThinking ? "opacity-100" : "opacity-70"}
            `}
              style={{
                backgroundColor: isThinking 
                  ? undefined 
                  : isReplying 
                  ? `${colors.dark}40` 
                  : isActive 
                  ? `${colors.dark}50` 
                  : undefined,
                color: isThinking 
                  ? undefined 
                  : isReplying 
                  ? colors.light 
                  : isActive 
                  ? colors.medium 
                  : undefined,
                borderColor: isThinking 
                  ? undefined 
                  : isReplying 
                  ? `${colors.medium}30` 
                  : isActive 
                  ? `${colors.dark}40` 
                  : undefined
              }}
            >
              {(isReplying || isThinking) && (
                <svg
                  className="w-3 h-3 animate-spin"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              )}
              <span className="font-mono">
                {isThinking
                  ? "Thinking..."
                  : isReplying
                  ? "Responding..."
                  : aiMessages[messageIndex]}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Section - Name & Info */}
        <div
          className={`
          text-center space-y-1
          transition-all duration-500 ease-out
          ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}
        `}>
          {/* Name */}
          <h3
            className={`
            text-sm font-semibold leading-tight transition-colors duration-300
            ${
              isReplying
                ? ""
                : isActive
                ? ""
                : "text-white group-hover:text-gray-100"
            }
          `}
            style={{
              color: isReplying 
                ? colors.light 
                : isActive 
                ? colors.light 
                : undefined
            }}
          >
            {name}
          </h3>

          {/* Title */}
          <p
            className={`
            text-xs font-medium transition-colors duration-300
            ${
              isReplying
                ? ""
                : isActive
                ? ""
                : "text-gray-400 group-hover:text-gray-300"
            }
          `}
            style={{
              color: isReplying 
                ? colors.medium 
                : isActive 
                ? colors.medium 
                : undefined
            }}
          >
            {title}
          </p>

          {/* Call to action hint */}
          <div
            className={`
            flex items-center justify-center gap-1 pt-0.5 opacity-0 group-hover:opacity-100 
            transition-all duration-300 text-xs
            ${isActive ? "" : "text-gray-500"}
          `}
            style={{
              color: isActive ? colors.medium : undefined
            }}
          >
            <span>Add to conversation</span>
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Subtle Glow Effects */}
      {isActive && (
        <div
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{
            background: `linear-gradient(to bottom right, ${colors.medium}05, transparent, ${colors.medium}05)`
          }}
        ></div>
      )}

      {isReplying && (
        <div
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{
            background: `linear-gradient(to bottom right, ${colors.medium}08, transparent, ${colors.medium}08)`
          }}
        ></div>
      )}

      {/* Hover Effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-gray-500/3 via-transparent to-gray-500/3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

      {/* Click Ripple */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/5 to-white/10 opacity-0 group-active:opacity-100 transition-opacity duration-150 pointer-events-none"></div>
    </div>
  );
};

export default CSuiteAdvisorCard;
