import React from "react";
import { THEMES } from "../constants/index";
import { useDispatch, useSelector } from "react-redux";
import { setTheme } from "../store/themeSlice";
import { Send } from "lucide-react";

const PREVIEW_MESSAGES = [
  { id: 1, content: "Hey! How's it going?", isSent: false },
  {
    id: 2,
    content: "I'm doing great! Just working on some new features.",
    isSent: true,
  },
];
const SettingsPage = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.theme);
  return (
    <div className="min-h-screen container mx-auto pt-20 max-w-5xl">
      <div>
        <h2>Theme</h2>
        <p>Choose a theme for your chat interface</p>
      </div>
      <div className="grid grid-cols-4 sm:grid-cols-6  md:grid-cols-8 gap-2">
        {THEMES.map((t) => (
          <button
            key={t}
            className={`
                group flex flex-col items-center gap-1.5 p-2 rounded-lg transition-colors 
                ${theme === t ? "bg-base-200" : "hover:bg-base-200/50"}
                `}
            onClick={() => dispatch(setTheme(t))}
          >
            <div
              className="relative h-8 w-full rounded-md overflow-hidden"
              data-theme={t}
            >
              <div className="absolute inset-0 grid grid-cols-4 gap-px p-1">
                <div className="rounded bg-primary"></div>
                <div className="rounded bg-secondary"></div>
                <div className="rounded bg-accent"></div>
                <div className="rounded bg-neutral"></div>
              </div>
            </div>
            <span className="text-[11px] font-medium truncate w-full text-center">
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </span>
          </button>
        ))}
      </div>
      <h3>Preview</h3>
      <div className="rounded-xl border border-base-300 overflow-hidden bg-base-100 shadow-lg">
        <div className="bg-base-200 p-4">
          <div className="max-w-lg mx-auto">
            <div className="bg-base-100 rounded-xl shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-base-300 bg-base-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-content flex items-center justify-center">
                    J
                  </div>
                  <div>
                    <h2>John Doe</h2>
                    <p>Online</p>
                  </div>
                </div>
              </div>
              {/*chat message*/}
              <div className="p-4 space-y-4 min-h-[200px] max-h-[200px] overflow-y-auto bg-base-100">
                {PREVIEW_MESSAGES.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isSent ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-xl p-3 shadow-sm ${message.isSent ? "bg-primary text-primary-content" : "bg-base-200"}`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p
                        className={`mt-1.2 text-[10px]${message.isSent ? "text-primary-content/70" : "text-base-content/70"}`}
                      >
                        12.00 PM
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              {/*chat input*/}
              <div className="border-t border-base-300 bg-base-100 p-4">
                <div className="flex gap-2 ">
                  <input
                    type="text"
                    className="input input-bordered flex-1 text-sm h-10"
                    placeholder="Type a message ..."
                    value="This is a preview"
                    readOnly
                  />
                  <button className="btn btn-primary h-10 min-h-10">
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
