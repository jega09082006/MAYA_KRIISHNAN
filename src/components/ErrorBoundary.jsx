import React from "react";

/**
 * Route-level error boundary.
 * Catches any render-time JavaScript error thrown by a child component tree
 * and shows a translated recovery UI instead of a blank/crashed page.
 *
 * Usage:
 *   <ErrorBoundary>
 *     <SomePage />
 *   </ErrorBoundary>
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Log for development; swap for a real error service in production
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  handleReset() {
    this.setState({ hasError: false, error: null });
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    const isDev = import.meta.env?.DEV;

    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-5 px-4 py-16 bg-storefront text-bark-900">
        <p className="text-5xl select-none">⚠️</p>

        {/* Tamil heading */}
        <h2 className="text-xl sm:text-2xl font-extrabold font-catamaran text-bark-900 text-center">
          ஏதோ தவறு நடந்துவிட்டது
        </h2>
        {/* English sub-heading */}
        <p className="text-sm sm:text-base text-bark-600 text-center max-w-md">
          Something went wrong loading this page. Please try again.
        </p>

        {/* Dev-only: show error message */}
        {isDev && this.state.error && (
          <pre className="max-w-full w-full overflow-x-auto bg-red-50 border border-red-200 text-danger text-xs p-4 rounded-none text-left">
            {this.state.error.toString()}
          </pre>
        )}

        <div className="flex flex-wrap gap-3 justify-center">
          {/* Retry renders the same tree again */}
          <button
            onClick={() => this.handleReset()}
            className="bg-gold text-bark-900 font-extrabold px-5 py-2.5 rounded-none hover:bg-gold-600 transition-all shadow-green min-h-[44px] cursor-pointer"
          >
            மீண்டும் முயற்சி / Retry
          </button>

          {/* Navigate home with a hard reload so all state resets */}
          <a
            href="/"
            className="bg-[#1d3d29] text-cream-100 font-extrabold px-5 py-2.5 rounded-none hover:bg-forest-700 transition-all shadow-green min-h-[44px] cursor-pointer inline-flex items-center"
          >
            முகப்பு / Go to Home
          </a>
        </div>
      </div>
    );
  }
}
