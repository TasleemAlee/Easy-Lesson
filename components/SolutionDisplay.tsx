
import React, { useCallback, useState, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { LoadingSpinner } from './LoadingSpinner';
import { LightBulbIcon, DocumentTextIcon, ClipboardIcon, SparklesIcon, QuestionMarkCircleIcon, PencilIcon, ChevronUpIcon, ChevronDownIcon } from './icons';

interface SolutionDisplayProps {
  solution: string;
  isLoading: boolean;
  error: string | null;
}

// --- New Q&A Card Component ---
interface QACardProps {
  question: string;
  answer: string;
  number: number;
}

const QACard: React.FC<QACardProps> = ({ question, answer, number }) => {
  const [isAnswerVisible, setIsAnswerVisible] = useState(false);

  return (
    <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary-300 dark:hover:border-primary-700">
      {/* Question Header */}
      <div className="p-4 bg-slate-50 dark:bg-slate-800/30">
        <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1 w-8 h-8 rounded-full bg-sky-100 dark:bg-sky-900/50 flex items-center justify-center text-sky-600 dark:text-sky-400 font-bold text-sm">
                {number}
            </div>
            <div className="flex-grow">
                <div className="font-semibold text-slate-800 dark:text-slate-100">
                  <ReactMarkdown remarkPlugins={[remarkMath, remarkGfm]} rehypePlugins={[rehypeKatex]} components={{ p: ({...props}) => <p className="mb-2 last:mb-0" {...props} /> }}>
                    {question}
                  </ReactMarkdown>
                </div>
            </div>
        </div>
      </div>
      
      {/* Answer Section */}
      <div className="border-t border-slate-200 dark:border-slate-700">
        <button
          onClick={() => setIsAnswerVisible(!isAnswerVisible)}
          className="w-full flex items-center justify-between p-4 text-left text-sm font-semibold text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 focus:outline-none"
          aria-expanded={isAnswerVisible}
        >
          <span>Answer</span>
          {isAnswerVisible ? <ChevronUpIcon className="w-5 h-5" /> : <ChevronDownIcon className="w-5 h-5" />}
        </button>
        <div 
          className={`grid transition-all duration-500 ease-in-out ${isAnswerVisible ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
        >
          <div className="overflow-hidden">
             <div className="p-4 pt-0 text-slate-600 dark:text-slate-300">
              <ReactMarkdown 
                remarkPlugins={[remarkMath, remarkGfm]} 
                rehypePlugins={[rehypeKatex]}
                components={{
                  strong: ({...props}) => <strong className="text-primary-600 dark:text-primary-400 font-semibold" {...props} />,
                }}
              >
                {answer}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


// --- Parsing Logic ---
type ParsedItem = 
  | { type: 'heading'; content: string }
  | { type: 'qa'; question: string; answer: string }
  | { type: 'fill'; content: string }
  | { type: 'table'; content: string }
  | { type: 'other'; content: string };

const parseSolution = (solution: string): ParsedItem[] => {
  if (!solution) return [];

  const exerciseBlocks = solution.split('---');
  const parsedItems: ParsedItem[] = [];

  exerciseBlocks.forEach(block => {
    let currentBlock = block.trim();
    if (!currentBlock) return;

    // Extract heading first
    const headingMatch = currentBlock.match(/^##\s*(.*)/);
    if (headingMatch) {
      parsedItems.push({ type: 'heading', content: headingMatch[1].trim() });
      currentBlock = currentBlock.substring(headingMatch[0].length).trim();
    }
    if (!currentBlock) return;

    // Process structured Q&A (**Question:** / **Answer:**)
    const qaRegex = /^\d+\.\s*\*\*Question:\*\*\s*(.*?)\s*\*\*Answer:\*\*\s*([\s\S]*?)(?=\n\d+\.\s*\*\*Question:\*\*|$)/gm;
    let qaMatch;
    let lastIndex = 0;
    while ((qaMatch = qaRegex.exec(currentBlock)) !== null) {
      parsedItems.push({ type: 'qa', question: qaMatch[1].trim(), answer: qaMatch[2].trim() });
      lastIndex = qaMatch.index + qaMatch[0].length;
    }
    
    const remainingContent = currentBlock.substring(lastIndex).trim();

    if (remainingContent) {
      // Tables are usually self-contained blocks
      if (remainingContent.includes('|') && remainingContent.includes('-') && !remainingContent.match(/^\d+\./)) {
        parsedItems.push({ type: 'table', content: remainingContent });
        return;
      }

      // Split remaining content by numbered list items
      const items = remainingContent.split(/\s*(?=\d+\.\s)/).filter(s => s.trim());
      items.forEach(itemText => {
          const trimmedItem = itemText.trim();
          if (!trimmedItem) return;

          // General Q&A format (includes MCQs)
          if (trimmedItem.includes('\n**Answer:**')) {
              const parts = trimmedItem.split(/\n\s*\*\*Answer:\*\*/);
              const questionPart = parts[0].replace(/^\d+\.\s*/, '').trim();
              const answerPart = parts[1] ? parts[1].trim() : '';
              parsedItems.push({ type: 'qa', question: questionPart, answer: answerPart });
          } 
          // Fill-in-the-blanks
          else if (trimmedItem.includes('**')) {
              parsedItems.push({ type: 'fill', content: trimmedItem });
          }
          // Other content (instructions, questions without immediate answers)
          else {
              parsedItems.push({ type: 'other', content: trimmedItem });
          }
      });
    }
  });

  return parsedItems;
};

export const SolutionDisplay: React.FC<SolutionDisplayProps> = ({ solution, isLoading, error }) => {
  const [copyButtonText, setCopyButtonText] = useState('Copy');
  
  const parsedSolution = useMemo(() => parseSolution(solution), [solution]);
  let qaCounter = 0;

  const handleDownloadTxt = useCallback(() => {
    if (!solution) return;
    const blob = new Blob([solution], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lesson-solution.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [solution]);

  const handleCopyToClipboard = useCallback(() => {
    if (!solution) return;
    navigator.clipboard.writeText(solution).then(() => {
      setCopyButtonText('Copied!');
      setTimeout(() => setCopyButtonText('Copy'), 2000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  }, [solution]);

  return (
    <div className="h-full min-h-[400px] lg:min-h-[600px] flex flex-col">
       <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Solved Exercises</h2>
        {solution && !isLoading && (
          <div className="flex items-center gap-2">
            <button onClick={handleDownloadTxt} className="flex items-center gap-2 text-sm bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium py-2 px-3 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors" aria-label="Download solution as text file" >
              <DocumentTextIcon className="w-4 h-4" />
              Download .txt
            </button>
             <button onClick={handleCopyToClipboard} className="flex items-center gap-2 text-sm w-24 justify-center bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium py-2 px-3 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors" aria-label="Copy solution to clipboard" >
              <ClipboardIcon className="w-4 h-4" />
              {copyButtonText}
            </button>
          </div>
        )}
      </div>
      <div className="flex-grow bg-slate-100 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 overflow-y-auto">
        {isLoading && (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 dark:text-slate-400">
            <LoadingSpinner />
            <p className="mt-4 text-center">AI is analyzing your lesson...</p>
          </div>
        )}
        {error && (
          <div className="flex flex-col items-center justify-center h-full text-red-500 p-4">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="font-semibold">An Error Occurred</p>
            <p className="text-sm text-center mt-1">{error}</p>
          </div>
        )}
        {!isLoading && !error && !solution && (
           <div className="flex flex-col items-center justify-center h-full text-slate-500 dark:text-slate-400 p-4">
            <LightBulbIcon className="w-12 h-12 mb-4" />
            <p className="font-semibold">Ready to Solve</p>
            <p className="text-sm text-center mt-1">Upload your lesson images to see the magic happen.</p>
          </div>
        )}
        {solution && (
          <div className="p-4 sm:p-6 animate-fade-in space-y-6" key={solution}>
            {parsedSolution.map((item, index) => {
              switch (item.type) {
                case 'heading':
                  qaCounter = 0; // Reset question counter for new exercise
                  return (
                    <h2 key={index} className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white pb-3 border-b-2 border-primary-500/30 flex items-center gap-3">
                      <SparklesIcon className="w-6 h-6 text-primary-500 flex-shrink-0" />
                      <span>{item.content}</span>
                    </h2>
                  );
                case 'qa':
                  qaCounter++;
                  return <QACard key={index} question={item.question} answer={item.answer} number={qaCounter} />;
                case 'fill':
                  return (
                     <div key={index} className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow-sm flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1 w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center text-amber-600 dark:text-amber-400">
                           <PencilIcon className="w-5 h-5" />
                        </div>
                        <div className="text-slate-700 dark:text-slate-200 flex-grow">
                           <ReactMarkdown 
                              remarkPlugins={[remarkMath, remarkGfm]} 
                              rehypePlugins={[rehypeKatex]}
                              components={{ strong: ({...props}) => <strong className="text-amber-600 dark:text-amber-400 font-semibold" {...props} />, p: ({...props}) => <p className="mb-2 last:mb-0" {...props} /> }}
                            >
                              {item.content}
                           </ReactMarkdown>
                        </div>
                      </div>
                  );
                case 'table':
                    return (
                        <div key={index} className="overflow-x-auto bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                            <ReactMarkdown 
                                remarkPlugins={[remarkMath, remarkGfm]} 
                                rehypePlugins={[rehypeKatex]}
                                components={{
                                  table: ({...props}) => <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400" {...props} />,
                                  thead: ({...props}) => <thead className="text-xs text-slate-700 dark:text-slate-200 uppercase bg-slate-100 dark:bg-slate-800" {...props} />,
                                  tr: ({...props}) => <tr className="border-b border-slate-200 dark:border-slate-700 last:border-b-0 hover:bg-slate-50 dark:hover:bg-slate-700/50" {...props} />,
                                  th: ({...props}) => <th scope="col" className="px-6 py-3 font-bold" {...props} />,
                                  td: ({...props}) => <td className="px-6 py-4" {...props} />,
                                }}
                              >
                                {item.content}
                            </ReactMarkdown>
                        </div>
                    );
                case 'other':
                  return (
                    <div key={index} className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow-sm">
                        <div className="text-slate-700 dark:text-slate-200">
                            <ReactMarkdown remarkPlugins={[remarkMath, remarkGfm]} rehypePlugins={[rehypeKatex]} components={{ p: ({...props}) => <p className="mb-2 last:mb-0" {...props} /> }}>
                                {item.content}
                            </ReactMarkdown>
                        </div>
                    </div>
                  );
                default:
                  return null;
              }
            })}
          </div>
        )}
      </div>
    </div>
  );
};
