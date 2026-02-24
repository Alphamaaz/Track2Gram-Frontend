import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { googleAdsService } from "../services/googleAds";

export default function GoogleAdsAuthorize() {
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const hasSubmitted = useRef(false);

    const code = params.get("code");

    const submit = useCallback(
        async (authCode) => {
            if (!authCode || hasSubmitted.current) return;

            const token = localStorage.getItem('token');
            if (!token) {
                setError("Your authentication session was lost during the redirect. Please ensure you are logged in on this domain and try again.");
                return;
            }

            hasSubmitted.current = true;
            setLoading(true);
            setError("");

            try {
                await googleAdsService.callback(authCode);
                // Redirect back to the Google Ads integration page after success
                navigate("/integrations/google-ads", { replace: true });
            } catch (err) {
                const errMsg =
                    err?.message || err?.error || "Connection failed. Please try again.";
                setError(errMsg);
                hasSubmitted.current = false; // Allow retry
            } finally {
                setLoading(false);
            }
        },
        [navigate]
    );

    useEffect(() => {
        if (code) {
            submit(code);
        }
    }, [code, submit]);

    if (!code) {
        return (
            <div style={styles.wrapper}>
                <div style={styles.card}>
                    <svg style={styles.svgIcon} viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                        <line x1="12" y1="9" x2="12" y2="13" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                    <h3 style={styles.title}>Missing Authorization Code</h3>
                    <p style={styles.desc}>
                        No authorization code was found in the URL. Please try connecting
                        your Google Ads account again.
                    </p>
                    <button
                        style={styles.btn}
                        onClick={() => navigate("/integrations/google-ads", { replace: true })}
                    >
                        Back to Google Ads Integration
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.wrapper}>
            <div style={styles.card}>
                {loading && (
                    <>
                        <div style={styles.spinner} />
                        <h3 style={styles.title}>Connecting to Google Ads...</h3>
                        <p style={styles.desc}>
                            Please wait while we establish the connection.
                        </p>
                    </>
                )}

                {!loading && !error && (
                    <>
                        <svg style={{ ...styles.svgIcon, stroke: "#16a34a" }} viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="9 12 11 14 15 10" />
                        </svg>
                        <h3 style={styles.title}>Connected Successfully</h3>
                        <p style={styles.desc}>Redirecting you back to the integration page...</p>
                    </>
                )}

                {error && (
                    <>
                        <svg style={{ ...styles.svgIcon, stroke: "#ef4444" }} viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="15" y1="9" x2="9" y2="15" />
                            <line x1="9" y1="9" x2="15" y2="15" />
                        </svg>
                        <h3 style={{ ...styles.title, color: "#ef4444" }}>
                            Connection Failed
                        </h3>
                        <p style={{ ...styles.desc, color: "#dc2626" }}>{error}</p>
                        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                            <button
                                style={styles.btn}
                                onClick={() => submit(code)}
                                disabled={loading}
                            >
                                {loading ? "Retrying..." : "Retry Connection"}
                            </button>
                            <button
                                style={{ ...styles.btn, background: "#f1f5f9", color: "#334155" }}
                                onClick={() => navigate("/integrations/google-ads", { replace: true })}
                            >
                                Go Back
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

const styles = {
    wrapper: {
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f8fafc",
        padding: "24px",
    },
    card: {
        background: "#ffffff",
        borderRadius: "24px",
        boxShadow: "0 20px 60px -10px rgba(0,0,0,0.1)",
        padding: "48px 40px",
        textAlign: "center",
        maxWidth: "440px",
        width: "100%",
        border: "1px solid rgba(226, 232, 240, 0.8)",
    },
    svgIcon: {
        width: "56px",
        height: "56px",
        marginBottom: "20px",
        display: "block",
        margin: "0 auto 20px auto",
    },
    title: {
        fontSize: "22px",
        fontWeight: 700,
        color: "#1e293b",
        margin: "0 0 12px 0",
        fontFamily: "'Inter', system-ui, sans-serif",
    },
    desc: {
        fontSize: "14px",
        color: "#64748b",
        lineHeight: 1.6,
        margin: "0 0 28px 0",
        fontFamily: "'Inter', system-ui, sans-serif",
    },
    btn: {
        background: "#084b8a",
        color: "#ffffff",
        border: "none",
        borderRadius: "10px",
        padding: "12px 24px",
        fontSize: "14px",
        fontWeight: 600,
        cursor: "pointer",
        fontFamily: "'Inter', system-ui, sans-serif",
        transition: "background 0.2s",
    },
    spinner: {
        width: "48px",
        height: "48px",
        border: "4px solid #e2e8f0",
        borderTop: "4px solid #084b8a",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
        margin: "0 auto 24px auto",
    },
};

// Inject spinner keyframes once
if (typeof document !== "undefined" && !document.getElementById("gads-spinner-style")) {
    const style = document.createElement("style");
    style.id = "gads-spinner-style";
    style.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
    document.head.appendChild(style);
}
