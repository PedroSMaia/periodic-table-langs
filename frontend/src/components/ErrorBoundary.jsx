import { Component } from "react";

export default class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ width: "100vw", height: "100vh", background: "#0B0F19", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "12px" }}>
                    <div style={{ fontSize: "2.5rem" }}>⚠️</div>
                    <div style={{ fontFamily: "'Bebas Neue',display", fontSize: "1.4rem", letterSpacing: "0.06em", color: "#f87171" }}>
                        Something went wrong
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        style={{ marginTop: "8px", padding: "6px 18px", borderRadius: "8px", border: "1px solid #f87171", background: "transparent", color: "#f87171", cursor: "pointer", fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.8rem" }}
                    >
                        Reload
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
