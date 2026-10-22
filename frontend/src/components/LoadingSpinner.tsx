const LoadingSpinner = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 transition-colors duration-200 dark:bg-slate-950">
      <div className="flex flex-col items-center gap-3">
        <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-slate-200 border-t-blue-600 dark:border-slate-800 dark:border-t-blue-500" />
        <span className="text-xs font-medium text-slate-400 dark:text-slate-500">Loading...</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;
