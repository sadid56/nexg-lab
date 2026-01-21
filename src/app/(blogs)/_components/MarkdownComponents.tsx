import { showToast } from "@/providers/ToastProvider";
import { Clipboard, ClipboardCheck, ExternalLink, Image as ImageIcon } from "lucide-react";
import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  vscDarkPlus,
  atomDark,
  zTouch,
  dark,
  coldarkDark,
  a11yDark,
  base16AteliersulphurpoolLight,
  cb,
  coldarkCold,
  coy,
  coyWithoutShadows,
  darcula,
  dracula,
  duotoneDark,
  duotoneEarth,
  duotoneForest,
  duotoneLight,
  duotoneSea,
  duotoneSpace,
  funky,
  ghcolors,
  gruvboxDark,
  gruvboxLight,
  holiTheme,
  hopscotch,
  lucario,
  materialDark,
  materialLight,
  materialOceanic,
  nightOwl,
  nord,
  okaidia,
  oneDark,
  oneLight,
  pojoaque,
  prism,
  shadesOfPurple,
  solarizedDarkAtom,
  solarizedlight,
  synthwave84,
  tomorrow,
  vs,
  twilight,
  xonokai,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { useConfigStore, TYPOGRAPHY } from "@/store/useConfigStore";

const syntaxThemes: Record<string, any> = {
  vscDarkPlus,
  atomDark,
  zTouch,
  dark,
  coldarkDark,
  a11yDark,
  base16AteliersulphurpoolLight,
  cb,
  coldarkCold,
  coy,
  coyWithoutShadows,
  darcula,
  dracula,
  duotoneDark,
  duotoneEarth,
  duotoneForest,
  duotoneLight,
  duotoneSea,
  duotoneSpace,
  funky,
  ghcolors,
  gruvboxDark,
  gruvboxLight,
  holiTheme,
  hopscotch,
  lucario,
  materialDark,
  materialLight,
  materialOceanic,
  nightOwl,
  nord,
  okaidia,
  oneDark,
  oneLight,
  pojoaque,
  prism,
  shadesOfPurple,
  solarizedDarkAtom,
  solarizedlight,
  synthwave84,
  tomorrow,
  vs,
  twilight,
  xonokai,
};

const CodeBlock = ({ className, children }: any) => {
  const [copied, setCopied] = useState(false);
  const { syntaxTheme } = useConfigStore();
  const codeText = String(children).replace(/\n$/, "");
  const language = className?.replace("language-", "") || "code";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(codeText);
    setCopied(true);
    showToast({ message: "Copied to clipboard!", type: "success" });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className='relative group mb-6 rounded-2xl overflow-hidden border border-muted/50 bg-linear-to-br from-muted/50 to-muted/30 backdrop-blur-sm shadow transition-all duration-300'>
      {/* Language badge */}
      <div className='absolute top-3 left-4 z-10'>
        <span className='text-xs font-mono font-semibold text-muted-foreground bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full border border-muted/50'>
          {language}
        </span>
      </div>

      <div className='p-2 pt-14 overflow-x-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent'>
        <SyntaxHighlighter
          language={language}
          style={syntaxThemes[syntaxTheme] || vscDarkPlus}
          customStyle={{
            margin: 0,
            padding: "1rem",
            backgroundColor: "transparent",
            backgroundImage: "none",
            fontSize: "0.875rem",
            lineHeight: "1.625",
            borderRadius: "0.7rem",
          }}
          codeTagProps={{
            style: {
              fontFamily:
                'var(--font-mono), ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
            },
          }}
        >
          {codeText}
        </SyntaxHighlighter>
      </div>

      {/* Copy button */}
      <button
        onClick={handleCopy}
        className='absolute top-3 right-3 bg-gray-200 dark:bg-muted-foreground/20 hover:bg-background backdrop-blur-sm border border-muted/50 text-foreground px-3 py-1.5 rounded-xl flex items-center gap-2 text-xs font-medium transition-all duration-200 hover:scale-105 hover:shadow-md cursor-pointer'
      >
        {copied ? (
          <>
            <ClipboardCheck size={14} className='text-emerald-500' />
            <span className='text-emerald-500'>Copied!</span>
          </>
        ) : (
          <>
            <Clipboard size={14} />
            Copy
          </>
        )}
      </button>
    </div>
  );
};

export const useMarkdownComponents = () => {
  return {
    h1: ({ ...props }: any) => <h1 className={TYPOGRAPHY.h1} {...props} />,

    h2: ({ ...props }: any) => <h2 className={TYPOGRAPHY.h2} {...props} />,

    h3: ({ ...props }: any) => <h3 className={TYPOGRAPHY.h3} {...props} />,

    h4: ({ ...props }: any) => <h4 className={TYPOGRAPHY.h4} {...props} />,

    h5: ({ ...props }: any) => <h5 className={TYPOGRAPHY.h5} {...props} />,

    h6: ({ ...props }: any) => <h6 className={TYPOGRAPHY.h6} {...props} />,

    p: ({ node, children, ...props }: any) => {
      if (node.children?.length === 1 && node.children[0].type === "element" && node.children[0].tagName === "code") {
        return <>{children}</>;
      }

      return (
        <p className={TYPOGRAPHY.p} {...props}>
          {children}
        </p>
      );
    },

    a: ({ href, children, ...props }: any) => (
      <a
        href={href}
        className={TYPOGRAPHY.link}
        target={href?.startsWith("http") ? "_blank" : undefined}
        rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
        {...props}
      >
        {children}
        {href?.startsWith("http") && <ExternalLink className='h-3.5 w-3.5 opacity-50 group-hover:opacity-100 transition-opacity' />}
      </a>
    ),

    ul: ({ ...props }: any) => <ul className='space-y-2 mb-6 pl-6' {...props} />,

    ol: ({ ...props }: any) => <ol className='space-y-2 mb-6 pl-6' {...props} />,

    li: ({ children, ...props }: any) => (
      <li
        className='text-foreground/80 leading-relaxed relative pl-2 before:absolute before:-left-4 before:content-["→"] before:text-primary/60 before:font-bold'
        {...props}
      >
        {children}
      </li>
    ),

    blockquote: ({ children, ...props }: any) => {
      // Flatten text from children (handle nested <p>, <span>, etc.)
      const textContent = React.Children.toArray(children)
        .map((child: any) => {
          if (typeof child === "string") return child;
          if (child.props?.children) return child.props.children;
          return "";
        })
        .join(" ");

      // Match type pattern at the start, e.g., "INFO:", "WARNING:"
      const match = textContent.match(/^([A-Z]+):\s*/);
      const type = match ? match[1] : "INFO";
      const content = match ? textContent.replace(`${type}: `, "") : textContent;

      const typeClasses: Record<string, string> = {
        INFO: "bg-blue-100 border-blue-500 text-blue-800",
        WARNING: "bg-yellow-100 border-yellow-500 text-yellow-800",
        ERROR: "bg-red-100 border-red-500 text-red-800",
        TIPS: "bg-green-100 border-green-500 text-green-800", // added TIPS
      };

      return (
        <div className={`border-l-4 p-4 mb-4 italic ${typeClasses[type] || typeClasses.INFO}`} {...props}>
          {content}
        </div>
      );
    },

    code: ({ inline, className, children, ...props }: any) => {
      if (inline) {
        return (
          <code
            className='bg-muted/60 border border-muted rounded-md px-2 py-0.5 text-sm font-mono text-foreground/90 font-semibold'
            {...props}
          >
            {children}
          </code>
        );
      }
      return <CodeBlock className={className}>{children}</CodeBlock>;
    },

    hr: ({ ...props }: any) => <hr className='border-0 h-px bg-linear-to-r from-transparent via-muted to-transparent my-12' {...props} />,

    table: ({ ...props }: any) => (
      <div className='overflow-x-auto mb-8 rounded-xl border border-muted/50 shadow'>
        <table className='w-full border-collapse bg-background/50 backdrop-blur-sm' {...props} />
      </div>
    ),

    thead: ({ ...props }: any) => <thead className='bg-linear-to-r from-muted/80 to-muted/40 backdrop-blur-sm' {...props} />,

    th: ({ ...props }: any) => (
      <th className='border-b border-muted px-6 py-4 text-left font-bold text-foreground text-sm uppercase tracking-wide' {...props} />
    ),

    td: ({ ...props }: any) => <td className='border-b border-muted/30 px-6 py-4 text-foreground/80' {...props} />,

    img: ({ src, alt, ...props }: any) => (
      <div className='group relative my-8 rounded-2xl overflow-hidden border border-muted/50 shadow-xl hover:shadow-2xl transition-all duration-300'>
        <img
          src={src}
          alt={alt}
          className='w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105'
          {...props}
        />
        {alt && (
          <div className='absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
            <p className='text-white text-sm flex items-center gap-2'>
              <ImageIcon size={16} />
              {alt}
            </p>
          </div>
        )}
      </div>
    ),

    input: ({ type, checked, ...props }: any) => (
      <input
        type={type}
        checked={checked}
        className='mr-2 h-4 w-4 rounded border-muted text-primary focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer'
        {...props}
      />
    ),

    em: ({ ...props }: any) => <em className='italic text-foreground/80 font-medium' {...props} />,

    strong: ({ ...props }: any) => <strong className='font-bold text-foreground' {...props} />,
  };
};
