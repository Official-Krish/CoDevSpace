import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ProblemProps {
  description: string;
  difficulty: string;
}

export function ProblemStatement({ description, difficulty }: ProblemProps) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-full">
      {/* Problem Title and Description */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Problem Description</h2>
      </div>

      {/* Difficulty Tag */}
      <div className="bg-gray-100 inline-block px-3 py-1 rounded-full text-gray-700 text-sm font-medium mb-4">
        {difficulty}
      </div>

      {/* Markdown Content */}
      <div className="prose lg:prose-xl dark:prose-invert max-w-full">
        <Markdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ node, ...props }) => <h1 className="text-3xl font-bold my-4" {...props} />,
            h2: ({ node, ...props }) => <h2 className="text-2xl font-semibold my-3" {...props} />,
            p: ({ node, ...props }) => <p className="my-2 text-gray-800 leading-relaxed" {...props} />,
            pre: ({ node, ...props }) => (
              <div className="bg-gray-900 text-white px-4 py-2 my-4 rounded-lg">
                <pre {...props} />
              </div>
            ),
            
            blockquote: ({ node, ...props }) => (
              <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4 text-gray-700" {...props} />
            ),
            ul: ({ node, ...props }) => (
              <ul className="list-disc list-inside my-2 text-gray-800" {...props} />
            ),
            li: ({ node, ...props }) => (
              <li className="ml-4 my-1">{props.children}</li>
            ),
            h4: ({ node, ...props }) => <h4 className="font-bold my-2 text-gray-900" {...props} />,
          }}
        >
          {description}
        </Markdown>
      </div>
    </div>
  );
}
