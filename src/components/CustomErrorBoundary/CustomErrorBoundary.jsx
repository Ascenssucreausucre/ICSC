import React from "react";

class CustomErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Affiche une UI de repli au prochain rendu
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log l'erreur (console, monitoring, etc.)
    this.setState({ errorInfo });

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      // Affiche un fallback custom si fourni
      if (this.props.fallback) {
        return typeof this.props.fallback === "function"
          ? this.props.fallback({
              error: this.state.error,
              errorInfo: this.state.errorInfo,
            })
          : this.props.fallback;
      }

      // Fallback par défaut
      return <h2>Une erreur est survenue.</h2>;
    }

    return this.props.children;
  }
}

export default CustomErrorBoundary;
