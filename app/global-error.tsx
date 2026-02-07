"use client";

import { useEffect } from "react";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Global Error:", error);
    }, [error]);

    return (
        <html>
            <body>
                <div style={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "1rem",
                    backgroundColor: "#f9fafb",
                }}>
                    <div style={{
                        maxWidth: "32rem",
                        width: "100%",
                        backgroundColor: "white",
                        borderRadius: "0.75rem",
                        padding: "3rem 2rem",
                        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                        textAlign: "center",
                    }}>
                        <div style={{
                            fontSize: "4rem",
                            marginBottom: "1rem",
                        }}>⚠️</div>

                        <h1 style={{
                            fontSize: "2rem",
                            fontWeight: "bold",
                            color: "#dc2626",
                            marginBottom: "0.5rem",
                        }}>
                            Critical Error
                        </h1>

                        <p style={{
                            color: "#6b7280",
                            marginBottom: "2rem",
                        }}>
                            A critical error occurred. Please refresh the page or contact support if the problem persists.
                        </p>

                        {process.env.NODE_ENV === "development" && (
                            <div style={{
                                marginBottom: "2rem",
                                padding: "1rem",
                                backgroundColor: "#f3f4f6",
                                borderRadius: "0.5rem",
                                textAlign: "left",
                            }}>
                                <p style={{ fontSize: "0.875rem", color: "#374151" }}>
                                    <strong>Error:</strong> {error.message}
                                </p>
                                {error.digest && (
                                    <p style={{ fontSize: "0.875rem", color: "#374151", marginTop: "0.5rem" }}>
                                        <strong>Error ID:</strong> {error.digest}
                                    </p>
                                )}
                            </div>
                        )}

                        <div style={{
                            display: "flex",
                            gap: "1rem",
                            justifyContent: "center",
                        }}>
                            <button
                                onClick={reset}
                                style={{
                                    padding: "0.75rem 1.5rem",
                                    backgroundColor: "#2563eb",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "0.5rem",
                                    cursor: "pointer",
                                    fontSize: "1rem",
                                    fontWeight: "500",
                                }}
                            >
                                Try Again
                            </button>

                            <button
                                onClick={() => window.location.href = "/"}
                                style={{
                                    padding: "0.75rem 1.5rem",
                                    backgroundColor: "white",
                                    color: "#374151",
                                    border: "1px solid #d1d5db",
                                    borderRadius: "0.5rem",
                                    cursor: "pointer",
                                    fontSize: "1rem",
                                    fontWeight: "500",
                                }}
                            >
                                Go Home
                            </button>
                        </div>
                    </div>
                </div>
            </body>
        </html>
    );
}
