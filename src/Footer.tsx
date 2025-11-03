export default function Footer() {
  return (
    <footer
      style={{
        marginTop: "2em",
        padding: "1.2em 0",
        textAlign: "center",
        background: "#222",
        color: "#ccc",
        fontSize: "1em",
        letterSpacing: "0.02em",
        width: "100%"
      }}
    >
      &copy; {new Date().getFullYear()} <a href="https://github.com/csokertesi">Contact</a> &mdash; <a href="https://example.com">ToS</a> 
    </footer>
  );
}
